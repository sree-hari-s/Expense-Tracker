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
      member = [member for member in expense_tracker.members if member.name == member_name]
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

# Sidebar for managing expenses
st.sidebar.header("Manage Expenses")
expenses = st.sidebar.number_input("Expenses", value=0, min_value=0)

if st.sidebar.button("Deduct Expenses"):
    remaining_balance = expense_tracker.deduct_expenses(expenses)
    st.sidebar.success(f"Expenses deducted successfully! Remaining Balance: {remaining_balance}")

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

# Display total earnings
total_earnings = expense_tracker.calculate_total_earnings()
st.header("Total Earnings")
st.write(f"Total Earnings: {total_earnings}")

# Display remaining balance
remaining_balance = total_earnings - expenses
st.header("Remaining Balance")
st.write(f"Remaining Balance: {remaining_balance}")