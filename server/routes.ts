import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertFamilyMemberSchema, 
  insertExpenseSchema, 
  updateFamilyMemberSchema, 
  updateExpenseSchema, 
  EXPENSE_CATEGORIES 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/categories", async (_req, res) => {
    try {
      res.json(EXPENSE_CATEGORIES);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/budget/summary", async (_req, res) => {
    try {
      const members = await storage.getFamilyMembers();
      const expenses = await storage.getExpenses();
      
      const totalIncome = members.reduce((sum, m) => sum + parseFloat(m.income || "0"), 0);
      const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
      
      res.json({
        totalIncome,
        totalExpenses,
        remaining: totalIncome - totalExpenses,
        percentage: totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate budget" });
    }
  });

  app.get("/api/family-members", async (_req, res) => {
    try {
      const members = await storage.getFamilyMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch family members" });
    }
  });

  app.post("/api/family-members", async (req, res) => {
    try {
      const validatedData = insertFamilyMemberSchema.parse(req.body);
      const member = await storage.createFamilyMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ error: "Invalid family member data" });
    }
  });

  app.get("/api/family-members/:id", async (req, res) => {
    try {
      const member = await storage.getFamilyMember(req.params.id);
      if (!member) {
        res.status(404).json({ error: "Family member not found" });
        return;
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch family member" });
    }
  });

  app.patch("/api/family-members/:id", async (req, res) => {
    try {
      const validatedData = updateFamilyMemberSchema.parse(req.body);
      const member = await storage.updateFamilyMember(req.params.id, validatedData);
      if (!member) {
        res.status(404).json({ error: "Family member not found" });
        return;
      }
      res.json(member);
    } catch (error) {
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  app.delete("/api/family-members/:id", async (req, res) => {
    try {
      const success = await storage.deleteFamilyMember(req.params.id);
      if (!success) {
        res.status(404).json({ error: "Family member not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete family member" });
    }
  });

  app.get("/api/expenses", async (_req, res) => {
    try {
      const expenses = await storage.getExpenses();
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expenses" });
    }
  });

  app.get("/api/expenses/by-category", async (_req, res) => {
    try {
      const expenses = await storage.getExpenses();
      const categoryTotals = expenses.reduce((acc, expense) => {
        const existing = acc.find(item => item.category === expense.category);
        const amount = parseFloat(expense.amount);
        if (existing) {
          existing.total += amount;
          existing.count += 1;
        } else {
          acc.push({
            category: expense.category,
            total: amount,
            count: 1,
          });
        }
        return acc;
      }, [] as Array<{ category: string; total: number; count: number }>);
      res.json(categoryTotals);
    } catch (error) {
      res.status(500).json({ error: "Failed to aggregate expenses by category" });
    }
  });

  app.get("/api/expenses/by-member", async (_req, res) => {
    try {
      const expenses = await storage.getExpenses();
      const members = await storage.getFamilyMembers();
      
      const memberTotals = members.map(member => {
        const memberExpenses = expenses.filter(e => e.memberId === member.id);
        const total = memberExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
        
        return {
          memberId: member.id,
          memberName: member.name,
          income: parseFloat(member.income || "0"),
          expenses: total,
          transactionCount: memberExpenses.length,
        };
      });
      
      res.json(memberTotals);
    } catch (error) {
      res.status(500).json({ error: "Failed to aggregate expenses by member" });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const validatedData = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(validatedData);
      res.status(201).json(expense);
    } catch (error) {
      res.status(400).json({ error: "Invalid expense data" });
    }
  });

  app.get("/api/expenses/:id", async (req, res) => {
    try {
      const expense = await storage.getExpense(req.params.id);
      if (!expense) {
        res.status(404).json({ error: "Expense not found" });
        return;
      }
      res.json(expense);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expense" });
    }
  });

  app.patch("/api/expenses/:id", async (req, res) => {
    try {
      const validatedData = updateExpenseSchema.parse(req.body);
      const expense = await storage.updateExpense(req.params.id, validatedData);
      if (!expense) {
        res.status(404).json({ error: "Expense not found" });
        return;
      }
      res.json(expense);
    } catch (error) {
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  app.delete("/api/expenses/:id", async (req, res) => {
    try {
      const success = await storage.deleteExpense(req.params.id);
      if (!success) {
        res.status(404).json({ error: "Expense not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete expense" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
