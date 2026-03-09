import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, DollarSign, Receipt, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetBar } from "@/components/budget-bar";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { FamilyMember, Expense } from "@shared/schema";

export default function DashboardPage() {
  const { data: members = [] } = useQuery<FamilyMember[]>({
    queryKey: ['/api/family-members'],
  });

  const { data: expenses = [] } = useQuery<Expense[]>({
    queryKey: ['/api/expenses'],
  });

  const totalIncome = members.reduce((sum, m) => sum + parseFloat(m.income || "0"), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  
  const thisMonth = new Date();
  const monthExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return expenseDate.getMonth() === thisMonth.getMonth() &&
           expenseDate.getFullYear() === thisMonth.getFullYear();
  });
  const monthlySpend = monthExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const recentExpenses = expenses.slice(-5).reverse();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-[family-name:var(--font-sans)]">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your family expense tracker</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <BudgetBar totalIncome={totalIncome} totalExpenses={totalExpenses} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-bold" data-testid="text-monthly-spend">
              {formatCurrency(monthlySpend)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {monthExpenses.length} transactions this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-bold" data-testid="text-total-transactions">
              {expenses.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All time expense records
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold" data-testid="text-top-category">
              {topCategory ? topCategory[0] : "None"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {topCategory ? formatCurrency(topCategory[1]) : "No expenses yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {recentExpenses.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No expenses yet</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Start tracking by adding your first expense
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentExpenses.map((expense) => {
                const member = members.find(m => m.id === expense.memberId);
                return (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                    data-testid={`expense-${expense.id}`}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {expense.category} • {member?.name} • {formatDate(expense.date)}
                      </p>
                    </div>
                    <p className="font-mono font-semibold text-lg">
                      {formatCurrency(expense.amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
