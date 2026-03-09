import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { CurrentMemberProvider, useCurrentMember } from "@/hooks/use-current-member";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import AddExpensePage from "@/pages/add-expense";
import TransactionsPage from "@/pages/transactions";
import VisualizationsPage from "@/pages/visualizations";
import ExportPage from "@/pages/export";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { currentMember } = useCurrentMember();
  
  if (!currentMember) {
    return <Redirect to="/login" />;
  }
  
  return <Component />;
}

function Router() {
  const { currentMember } = useCurrentMember();

  return (
    <Switch>
      <Route path="/login">
        {currentMember ? <Redirect to="/" /> : <LoginPage />}
      </Route>
      <Route path="/">
        {() => <ProtectedRoute component={DashboardPage} />}
      </Route>
      <Route path="/add-expense">
        {() => <ProtectedRoute component={AddExpensePage} />}
      </Route>
      <Route path="/transactions">
        {() => <ProtectedRoute component={TransactionsPage} />}
      </Route>
      <Route path="/visualizations">
        {() => <ProtectedRoute component={VisualizationsPage} />}
      </Route>
      <Route path="/export">
        {() => <ProtectedRoute component={ExportPage} />}
      </Route>
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

function AppContent() {
  const { currentMember } = useCurrentMember();

  if (!currentMember) {
    return <Router />;
  }

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <Router />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <CurrentMemberProvider>
          <TooltipProvider>
            <AppContent />
            <Toaster />
          </TooltipProvider>
        </CurrentMemberProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
