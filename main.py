class FamilyMember:
    def __init__(self, name, earning_status=True, earnings=0):
        self.name = name
        self.earning_status = earning_status
        self.earnings = earnings

    def __str__(self):
        return f"Name: {self.name}, Earning Status: {'Earning' if self.earning_status else 'Not Earning'}, Earnings: {self.earnings}"

class FamilyExpenseTracker:
    def __init__(self):
        self.members = []

    def add_family_member(self, name, earning_status=True, earnings=0):
        member = FamilyMember(name, earning_status, earnings)
        self.members.append(member)

    def calculate_total_earnings(self):
        total_earnings = sum(member.earnings for member in self.members if member.earning_status)
        return total_earnings

    def deduct_expenses(self, expenses):
        total_earnings = self.calculate_total_earnings()
        remaining_balance = total_earnings - expenses
        return remaining_balance

if __name__ == "__main__":
    expense_tracker = FamilyExpenseTracker()

