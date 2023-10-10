import streamlit as st
from main import FamilyExpenseTracker

# Streamlit configuration
st.set_page_config(
    page_title="Family Expense Tracker",
    page_icon="💰",
    layout="wide"
)

st.title("Family Expense Tracker")

# Create a session state object
session_state = st.session_state

# Check if the 'expense_tracker' object exists in the session state
if 'expense_tracker' not in session_state:
    # If not, create and initialize it
    session_state.expense_tracker = FamilyExpenseTracker()

# Sidebar for adding family members
st.sidebar.header("Add Family Member")
member_name = st.sidebar.text_input("Name")
earning_status = st.sidebar.checkbox("Earning Status")
if earning_status:
    earnings = st.sidebar.number_input("Earnings", value=0, min_value=0)
else:
    earnings = 0
# Access the 'expense_tracker' object from session state
expense_tracker = session_state.expense_tracker

if st.sidebar.button("Add Member"):
    try:   
        expense_tracker.add_family_member(member_name, earning_status, earnings)
        st.sidebar.success("Member added successfully!")
    except ValueError as e:
        st.sidebar.error(str(e))
        
# Sidebar for managing expenses
st.sidebar.header("Manage Expenses")
expense_categories = ["Housing", "Transportation", "Food", "Healthcare", "Other"]
selected_expense_category = st.sidebar.selectbox("Select an category", expense_categories)
expense_name = st.sidebar.text_input("Expense name")
expense_description = st.sidebar.text_input("Enter a description")
expense_cost = st.sidebar.number_input("Cost", value=0, min_value=0)

if st.sidebar.button("Add expense"):
    expense_tracker.add_expense(selected_expense_category, expense_name,expense_description, expense_cost)

# Display family members
st.header("Family Members")

name_column, earning_status_column, earnings_column = st.columns(3)
name_column.write("**Name**")
earning_status_column.write("**Earning status**")
earnings_column.write("**Earnings**")

for member in expense_tracker.members:
    name_column.write(member.name)
    earning_status_column.write('Earning' if member.earning_status else 'Not Earning')
    earnings_column.write(member.earnings)


# Display all cost
st.header("Expenses")
expense_category_column, expense_name_column, expense_cost_column, expense_description_column = st.columns(4)
expense_category_column.write("**Category**")
expense_name_column.write("**Name**")
expense_cost_column.write("**Cost**")
expense_description_column.write("**Description**")

for expense in expense_tracker.expenses:
    expense_category_column.write(expense.category)
    expense_name_column.write(expense.name)
    expense_cost_column.write(expense.cost)
    expense_description_column.write(expense.description)

total_earnings = expense_tracker.calculate_total_earnings()
st.header(f"Total Earnings: {total_earnings}")

total_cost = expense_tracker.calculate_total_expenses()
st.header(f"Total Cost: {total_cost}")

net_income = total_earnings - total_cost
st.header(f"Net Income: {net_income}")