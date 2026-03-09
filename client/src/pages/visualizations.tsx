import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_COLORS, type FamilyMember, type Expense } from "@shared/schema";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

export default function VisualizationsPage() {
  const { data: members = [] } = useQuery<FamilyMember[]>({
    queryKey: ['/api/family-members'],
  });

  const { data: expenses = [] } = useQuery<Expense[]>({
    queryKey: ['/api/expenses'],
  });

  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    const amount = parseFloat(expense.amount);
    if (existing) {
      existing.value += amount;
    } else {
      acc.push({
        name: expense.category,
        value: amount,
      });
    }
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  const memberData = members.map(member => {
    const memberExpenses = expenses
      .filter(e => e.memberId === member.id)
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);
    
    return {
      name: member.name,
      income: parseFloat(member.income || "0"),
      expenses: memberExpenses,
    };
  });

  const chartConfig = {
    income: {
      label: "Income",
      color: "hsl(var(--chart-2))",
    },
    expenses: {
      label: "Expenses",
      color: "hsl(var(--chart-5))",
    },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Visualizations</h1>
        <p className="text-muted-foreground">Insights into your family spending patterns</p>
      </div>

      {expenses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-lg font-medium text-muted-foreground">No data to visualize</p>
            <p className="text-sm text-muted-foreground mt-2">Start adding expenses to see charts</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const data = payload[0];
                        return (
                          <div className="rounded-lg border bg-card p-3 shadow-md">
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-medium">{data.name}</span>
                              <span className="text-lg font-mono font-bold">
                                {formatCurrency(data.value as number)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {((data.value as number / categoryData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => entry.name}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || "#8884d8"} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Income vs Expenses by Member</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={memberData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div className="rounded-lg border bg-card p-3 shadow-md">
                            <div className="flex flex-col gap-2">
                              <span className="font-medium">{payload[0].payload.name}</span>
                              {payload.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <div
                                    className="h-3 w-3 rounded-sm"
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span className="text-sm">
                                    {entry.name}: {formatCurrency(entry.value as number)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="hsl(var(--chart-2))" name="Income" />
                    <Bar dataKey="expenses" fill="hsl(var(--chart-5))" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="text-sm">Largest Category</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <>
                <p className="text-2xl font-semibold">{categoryData.sort((a, b) => b.value - a.value)[0].name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatCurrency(categoryData.sort((a, b) => b.value - a.value)[0].value)}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">No data</p>
            )}
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="text-sm">Total Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{categoryData.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Active spending areas</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="text-sm">Average Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-mono font-semibold">
              {expenses.length > 0
                ? formatCurrency(
                    expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0) / expenses.length
                  )
                : "$0.00"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Per transaction</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
