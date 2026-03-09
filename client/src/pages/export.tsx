import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CATEGORY_COLORS, type FamilyMember, type Expense } from "@shared/schema";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

export default function ExportPage() {
  const { toast } = useToast();
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);

  const { data: members = [] } = useQuery<FamilyMember[]>({
    queryKey: ['/api/family-members'],
  });

  const { data: expenses = [] } = useQuery<Expense[]>({
    queryKey: ['/api/expenses'],
  });

  const totalIncome = members.reduce((sum, m) => sum + parseFloat(m.income || "0"), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const exportToCSV = () => {
    const data = expenses.map(expense => {
      const member = members.find(m => m.id === expense.memberId);
      return {
        Date: formatDate(expense.date),
        Member: member?.name || "Unknown",
        Category: expense.category,
        Description: expense.description,
        Amount: parseFloat(expense.amount),
      };
    });

    if (includeSummary) {
      data.push({} as any);
      data.push({
        Date: "SUMMARY",
        Member: "",
        Category: "",
        Description: "",
        Amount: 0,
      } as any);
      data.push({
        Date: "Total Income",
        Member: "",
        Category: "",
        Description: "",
        Amount: totalIncome,
      } as any);
      data.push({
        Date: "Total Expenses",
        Member: "",
        Category: "",
        Description: "",
        Amount: totalExpenses,
      } as any);
      data.push({
        Date: "Remaining",
        Member: "",
        Category: "",
        Description: "",
        Amount: totalIncome - totalExpenses,
      } as any);
    }

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `family-expenses-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "CSV exported!",
      description: "Your expense data has been downloaded.",
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Family Expense Report', 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Generated: ${formatDate(new Date())}`, 14, 28);

    if (includeSummary) {
      doc.setFontSize(14);
      doc.text('Summary', 14, 40);
      
      doc.setFontSize(10);
      doc.text(`Total Income: ${formatCurrency(totalIncome)}`, 14, 48);
      doc.text(`Total Expenses: ${formatCurrency(totalExpenses)}`, 14, 54);
      doc.text(`Remaining: ${formatCurrency(totalIncome - totalExpenses)}`, 14, 60);
      doc.text(`Total Transactions: ${expenses.length}`, 14, 66);
    }

    const tableData = expenses.map(expense => {
      const member = members.find(m => m.id === expense.memberId);
      return [
        formatDate(expense.date),
        member?.name || "Unknown",
        expense.category,
        expense.description,
        formatCurrency(expense.amount),
      ];
    });

    autoTable(doc, {
      startY: includeSummary ? 75 : 40,
      head: [['Date', 'Member', 'Category', 'Description', 'Amount']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [33, 150, 243] },
    });

    if (includeCharts) {
      const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
        return acc;
      }, {} as Record<string, number>);

      const chartY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(12);
      doc.text('Category Breakdown', 14, chartY);
      
      let yPos = chartY + 8;
      Object.entries(categoryTotals).forEach(([category, amount]) => {
        doc.setFontSize(9);
        doc.text(`${category}: ${formatCurrency(amount)}`, 14, yPos);
        yPos += 6;
      });
    }

    doc.save(`family-expenses-${new Date().toISOString().split('T')[0]}.pdf`);

    toast({
      title: "PDF exported!",
      description: "Your expense report has been downloaded.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Export Data</h1>
        <p className="text-muted-foreground">Download your expense reports and visualizations</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg hover-elevate">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <FileSpreadsheet className="h-6 w-6 text-success" />
              </div>
              <div>
                <CardTitle>CSV Export</CardTitle>
                <CardDescription>Spreadsheet format</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Export all transaction data in CSV format, perfect for Excel, Google Sheets, or other spreadsheet applications.
            </p>
            <div className="space-y-3 py-2">
              <p className="text-sm font-medium">Includes:</p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• All transaction details</li>
                <li>• Member names</li>
                <li>• Category information</li>
                {includeSummary && <li>• Financial summary</li>}
              </ul>
            </div>
            <Button
              className="w-full"
              onClick={exportToCSV}
              disabled={expenses.length === 0}
              data-testid="button-export-csv"
            >
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover-elevate">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <FileText className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <CardTitle>PDF Export</CardTitle>
                <CardDescription>Formatted report</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate a comprehensive PDF report with formatted tables, summaries, and category breakdowns.
            </p>
            <div className="space-y-3 py-2">
              <p className="text-sm font-medium">Includes:</p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Formatted transaction table</li>
                {includeSummary && <li>• Financial summary</li>}
                {includeCharts && <li>• Category breakdown</li>}
                <li>• Professional layout</li>
              </ul>
            </div>
            <Button
              className="w-full"
              variant="destructive"
              onClick={exportToPDF}
              disabled={expenses.length === 0}
              data-testid="button-export-pdf"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>Customize what to include in your export</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="summary"
              checked={includeSummary}
              onCheckedChange={(checked) => setIncludeSummary(checked as boolean)}
              data-testid="checkbox-include-summary"
            />
            <Label htmlFor="summary" className="text-sm cursor-pointer">
              Include financial summary (total income, expenses, remaining balance)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="charts"
              checked={includeCharts}
              onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
              data-testid="checkbox-include-charts"
            />
            <Label htmlFor="charts" className="text-sm cursor-pointer">
              Include category breakdown (PDF only)
            </Label>
          </div>
        </CardContent>
      </Card>

      {expenses.length === 0 && (
        <Card className="border-warning">
          <CardContent className="flex items-center gap-3 py-6">
            <div className="p-3 bg-warning/10 rounded-lg">
              <FileText className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="font-medium">No data to export</p>
              <p className="text-sm text-muted-foreground">Add some expenses first to generate reports</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
