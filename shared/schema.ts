import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const familyMembers = pgTable("family_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  income: decimal("income", { precision: 10, scale: 2 }).default("0"),
  avatarColor: text("avatar_color").notNull().default("#0ea5e9"),
});

export const expenses = pgTable("expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull(),
  category: text("category").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull().default(sql`now()`),
});

export const insertFamilyMemberSchema = createInsertSchema(familyMembers).omit({
  id: true,
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
}).extend({
  date: z.string().or(z.date()),
});

export const updateFamilyMemberSchema = insertFamilyMemberSchema.partial();

export const updateExpenseSchema = insertExpenseSchema.omit({
  memberId: true,
}).partial().extend({
  date: z.string().or(z.date()).optional(),
});

export type InsertFamilyMember = z.infer<typeof insertFamilyMemberSchema>;
export type FamilyMember = typeof familyMembers.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Expense = typeof expenses.$inferSelect;
export type UpdateFamilyMember = z.infer<typeof updateFamilyMemberSchema>;
export type UpdateExpense = z.infer<typeof updateExpenseSchema>;

export const EXPENSE_CATEGORIES = [
  "Housing",
  "Transportation",
  "Food & Dining",
  "Utilities",
  "Healthcare",
  "Entertainment",
  "Shopping",
  "Education",
  "Personal Care",
  "Insurance",
  "Savings",
  "Other",
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

export const CATEGORY_COLORS: Record<string, string> = {
  "Housing": "hsl(210, 100%, 50%)",
  "Transportation": "hsl(142, 71%, 45%)",
  "Food & Dining": "hsl(38, 92%, 50%)",
  "Utilities": "hsl(280, 65%, 50%)",
  "Healthcare": "hsl(0, 84%, 60%)",
  "Entertainment": "hsl(310, 70%, 50%)",
  "Shopping": "hsl(50, 98%, 50%)",
  "Education": "hsl(200, 80%, 50%)",
  "Personal Care": "hsl(340, 80%, 55%)",
  "Insurance": "hsl(180, 60%, 45%)",
  "Savings": "hsl(142, 71%, 45%)",
  "Other": "hsl(220, 15%, 55%)",
};

export const AVATAR_COLORS = [
  "#0ea5e9", // Sky blue
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#6366f1", // Indigo
  "#f97316", // Orange
  "#14b8a6", // Teal
];
