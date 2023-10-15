import sqlite3

class FamilyMember:
    def __init__(self, id, name, earning_status=True, earnings=0):
        self.id = id
        self.name = name
        self.earning_status = earning_status
        self.earnings = earnings

    def __str__(self):
        return (
            f"ID: {self.id}, Name: {self.name}, Earning Status: {'Earning' if self.earning_status else 'Not Earning'}, "
            f"Earnings: {self.earnings}"
        )


class Expense:
    def __init__(self, id, value, category, description):
        self.id = id
        self.value = value
        self.category = category
        self.description = description

    def __str__(self):
        return f"ID: {self.id}, Value: {self.value}, Category: {self.category}, Description: {self.description}"

class Category:
    def __init__(self, id, name):
        self.id = id
        self.name = name

    def __str__(self):
        return f"ID: {self.id}, Category: {self.name}"


class FamilyExpenseTracker:
    def __init__(self):
        self.repo = Repository('db.sqlite')

    def add_family_member(self, name, earning_status=True, earnings=0):
        if not name.strip():
            raise ValueError("Name field cannot be empty")

        self.repo.add_family_member(name, earning_status, earnings)
    
    def delete_family_member(self, member):
        self.repo.remove_family_member(member.id)

    def update_family_member(self, member, earning_status=True, earnings=0):
        if member:
            print(member)
            self.repo.update_family_member(member.id, earning_status, earnings)

    def calculate_total_earnings(self):
        members = self.repo.get_family_members()
        total_earnings = sum(
            member.earnings for member in members if member.earning_status
        )
        return total_earnings

    def add_expense(self, value, category, description):
        if value == 0:
            raise ValueError("Value cannot be zero")
        if not category.strip():
            raise ValueError("Please choose a category")

        self.repo.add_expense(value, category, description)

    def merge_similar_category(self, value, category, description):
        if value == 0:
            raise ValueError("Value cannot be zero")
        if not category.strip():
            raise ValueError("Please choose a category")

        existing_expense = None
        for expense in self.expense_list:
            if expense.category == category:
                existing_expense = expense
                break

        if existing_expense:
            existing_expense.value += value
            if description:
                existing_expense.description = description
        else:
            self.add_expense(value, category, description)
    
    def calculate_total_expenditure(self):
        expenses = self.repo.get_expenses()
        total_expenditure = sum(expense.value for expense in expenses)
        return total_expenditure

    def deduct_expenses(self):
        total_earnings = self.calculate_total_earnings()
        total_expenditure = self.calculate_total_expenditure()
        remaining_balance = total_earnings - total_expenditure
        return remaining_balance

class Repository:
    def __init__(self, db_file):
        conn = None
        try:
            conn = sqlite3.connect(db_file, check_same_thread=False)
            self.conn = conn
        except:
            print('Error: cannot connect to Database.')

    def get_family_members(self):
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM family_members;")
        rows = cursor.fetchall()
        family_members = []
        for row in rows:
            family_members.append(FamilyMember(id=row[0], name=row[1], earning_status=bool(row[2]), earnings=row[3]))
        return family_members

    def add_family_member(self, name, earning_status, earnings):
        conn = self.conn
        cursor = conn.cursor()
        earnings = earnings if earning_status else 0
        earning_status = 1 if earning_status else 0
        cursor.execute(f"INSERT INTO family_members(name, earning_status, earnings) VALUES (?, ?, ?)", (name, earning_status, earnings))
        conn.commit()
        return cursor.lastrowid

    def remove_family_member(self, id):
        conn = self.conn
        cursor = conn.cursor()
        cursor.execute(f"DELETE FROM family_members WHERE id = {id}")
        conn.commit()

    def update_family_member(self, id, earning_status, earnings):
        print(id, earning_status, earnings)
        conn = self.conn
        cursor = conn.cursor()
        earning_status = 1 if earning_status else 0
        if(earning_status == 0): earnings = 0
        cursor.execute(f"UPDATE family_members SET earning_status = {earning_status}, earnings = {earnings} WHERE id = {id}")
        conn.commit()

    def add_expense(self, value, category, description):
        conn = self.conn
        cursor = conn.cursor()
        cat = self.get_category(category)
        cursor.execute(f"INSERT INTO expenses(category_id, description, value) VALUES (?, ?, ?)", (cat.id, description, value))
        conn.commit()
        return cursor.lastrowid

    def get_expenses(self):
        conn = self.conn
        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM expenses INNER JOIN categories ON expenses.category_id = categories.id")
        rows = cursor.fetchall()
        expenses = []
        for row in rows:
            expenses.append(Expense(row[0], row[3], row[5], row[2]))
        return expenses

    def get_categories(self):
        conn = self.conn
        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM categories")
        rows = cursor.fetchall()
        categories = []
        for row in rows:
            categories.append(Category(row[0], row[1]))
        return categories

    def get_category(self, category_name):
        categories = self.get_categories()
        for cat in categories:
            if cat.name == category_name:
                return cat
        return None


if __name__ == "__main__":
    expense_tracker = FamilyExpenseTracker()