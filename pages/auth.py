import streamlit as st
import sqlite3
import bcrypt
import os

# Check if the database file exists
if not os.path.isfile('data.db'):
    # If the database file doesn't exist, create it and the users table
    conn = sqlite3.connect('data.db')
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password VARCHAR(10) NOT NULL
        )
    ''')

    conn.commit()
else:
    # If the database file exists, simply connect to it
    conn = sqlite3.connect('data.db')
    cursor = conn.cursor()

# Define a function to register a new user and store hashed password in the database
def register_user(username, password):
    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    cursor.execute("INSERT INTO users (username,password) VALUES (?, ?)", (username,hashed_password))
    conn.commit()

# Define a function to check if login credentials are valid
def is_valid_login(username, password):
    cursor.execute("SELECT username, password FROM users WHERE username = ?", (username,))
    user_record = cursor.fetchone()
    if user_record:
        stored_password = user_record[1]
        # Verify the hashed password
        if bcrypt.checkpw(password.encode('utf-8'), stored_password):
            return True
    return False


# Streamlit app header
st.title("Registration and Login App")

# Sidebar to select between Registration and Login
menu = st.selectbox("Menu:", ["Login", "Register"])

if menu == "Login":
    st.header("Login")

    # User input for login
    username = st.text_input("Username",key="username")
    password = st.text_input("Password", type="password",key="password")

    # Login button
    if st.button("Login"):
        if is_valid_login(username, password):
            st.success("Logged in as: " + username)
        else:
            st.error("Invalid username or password")

else:
    st.header("Register")
    # User input for registration
    new_username = st.text_input("Username",key="new_username")
    new_password = st.text_input("Password", type="password",key="new_password")
    confirm_password = st.text_input("Confirm Password", type="password",key="confirm_password")

    if new_password == confirm_password:
        # Register button
        if st.button("Register"):
            register_user(new_username, new_password)
            st.success("Registration successful. You can now log in.")

# Close the database connection when Streamlit app is done
conn.close()
