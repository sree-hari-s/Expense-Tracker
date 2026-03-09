import { formatCurrency } from "@/lib/utils";

interface BudgetBarProps {
  totalIncome: number;
  totalExpenses: number;
}

export function BudgetBar({ totalIncome, totalExpenses }: BudgetBarProps) {
  const remaining = totalIncome - totalExpenses;
  const percentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  
  const getBarColor = () => {
    if (percentage >= 100) return "bg-destructive";
    if (percentage >= 80) return "bg-warning";
    return "bg-success";
  };

  const getTextColor = () => {
    if (percentage >= 100) return "text-destructive";
    if (percentage >= 80) return "text-warning";
    return "text-success";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm text-muted-foreground">Total Income</p>
          <p className="text-2xl font-mono font-semibold" data-testid="text-total-income">
            {formatCurrency(totalIncome)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Total Spent</p>
          <p className="text-2xl font-mono font-semibold" data-testid="text-total-spent">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Remaining</p>
          <p className={`text-2xl font-mono font-semibold ${getTextColor()}`} data-testid="text-remaining">
            {formatCurrency(remaining)}
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full ${getBarColor()} transition-all duration-300 ease-out`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
            data-testid="budget-bar-fill"
          />
        </div>
        <p className="text-xs text-muted-foreground text-center">
          {percentage.toFixed(1)}% of budget used
        </p>
      </div>
    </div>
  );
}
