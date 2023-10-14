import streamlit as st
from main import FamilyExpenseTracker

# Streamlit configuration
st.set_page_config(page_title="Family Expense Tracker", page_icon="💰", layout="wide")

st.title("Family Expense Tracker")

# Create a session state object
session_state = st.session_state

# Check if the 'expense_tracker' object exists in the session state
if "expense_tracker" not in session_state:
    # If not, create and initialize it
    session_state.expense_tracker = FamilyExpenseTracker()

# Sidebar for adding family members
st.sidebar.header("Add Family Member")
member_name = st.sidebar.text_input("Name").title()
earning_status = st.sidebar.checkbox("Earning Status")
if earning_status:
    earnings = st.sidebar.number_input("Earnings", value=0, min_value=0)
else:
    earnings = 0

# Access the 'expense_tracker' object from session state
expense_tracker = session_state.expense_tracker

if st.sidebar.button("Add Member"):
    try:
        # Check if family member exists
        member = [
            member for member in expense_tracker.repo.get_family_members() if member.name == member_name
        ]
        # If not exist add family member
        if not member:
            expense_tracker.add_family_member(member_name, earning_status, earnings)
            st.sidebar.success("Member added successfully!")
        # Else, update it
        else:
            expense_tracker.update_family_member(member[0], earning_status, earnings)
            st.sidebar.success("Member updated successfully!")
    except ValueError as e:
        st.sidebar.error(str(e))

# Sidebar for adding expenses
st.sidebar.header("Add Expenses")
expense_category = st.sidebar.selectbox(
    "Category",
    (
        category.name for category in expense_tracker.repo.get_categories()
    ),
)
expense_description = st.sidebar.text_input("Description (optional)").title()
expense_value = st.sidebar.number_input("Value", min_value=0)

if st.sidebar.button("Add Expense"):
    try:
        # Add the expense
        expense_tracker.add_expense(
            expense_value, expense_category, expense_description
        )
        st.sidebar.success("Expense addedd successfully!")
    except ValueError as e:
        st.sidebar.error(str(e))

# Display family members
st.header("Family Members")

if not expense_tracker.members:
    st.info("Start by adding family members to track your expenses together! Currently, no members have been added. Get started by clicking the 'Add Member' button on the sidebar.")
else:
    name_column, earning_status_column, earnings_column, action_column = st.columns(4)
    name_column.write("**Name**")
    earning_status_column.write("**Earning status**")
    earnings_column.write("**Earnings**")
    action_column.write("**Action**")

    for member in expense_tracker.repo.get_family_members():
        name_column.write(member.name)
        earning_status_column.write("Earning" if member.earning_status else "Not Earning")
        earnings_column.write(member.earnings)

        if action_column.button(f"Delete {member.name}"):
            expense_tracker.delete_family_member(member)
            st.rerun()

# Display total earnings
total_earnings = expense_tracker.calculate_total_earnings()
st.header("Total Earnings")
st.write(f"Total Earnings: {total_earnings}")

# Display expenses
st.header("Expenses")

value_column, category_column, description_column = st.columns(3)
value_column.write("**Value**")
category_column.write("**Category**")
description_column.write("**Description**")

for expense in expense_tracker.repo.get_expenses():
    value_column.write(expense.value)
    category_column.write(expense.category)
    description_column.write(expense.description)

# Display total expenditure
total_expenditure = expense_tracker.calculate_total_expenditure()
st.header("Total Expenditure")
st.write(f"Total Expenditure: {total_expenditure}")

# Display remaining balance
remaining_balance = total_earnings - total_expenditure
st.header("Remaining Balance")
st.write(f"Remaining Balance: {remaining_balance}")
