def calculate_retirement_goals():
    retirement_age = int(input("Enter the retirement age: "))
    annual_retirement_expenses = int(input("Enter annual retirement expenses: "))
    inflation_rate = float(input("Enter the inflation rate: "))
    current_retirement_savings = int(input("Enter current retirement savings: "))
    annual_retirement_income = int(input("Enter annual retirement income: "))
    current_age = int(input("Enter current age: "))

    retirement_duration = retirement_age - current_age
    amount = (
        (annual_retirement_expenses - annual_retirement_income) * (1 + inflation_rate) ** retirement_duration
    )
    return amount

print(calculate_retirement_goals())
