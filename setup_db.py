import sqlite3
from sqlite3 import Error
import os


def create_connection(db_file):
    """ create a database connection to a SQLite database """
    conn = None
    try:
        print("Initializing DB...")
        conn = sqlite3.connect(db_file)
        create_tables(conn)
        print("Done.")
    except Error as e:
        print(e)
    finally:
        if conn:
            conn.close()

def create_tables(conn):
  cursor = conn
  cursor.execute("""
                 CREATE TABLE IF NOT EXISTS family_members(
                   id integer PRIMARY KEY,
                   name text NOT NULL,
                   earning_status BOOLEAN NOT NULL CHECK (earning_status IN (0, 1)),
                   earnings integer NOT NULL DEFAULT 0
                 );
                 """)

  cursor.execute("""
                 CREATE TABLE IF NOT EXISTS categories(
                   id integer PRIMARY KEY,
                   category TEXT NOT NULL
                 );
                 """)

  cursor.execute("""
                 CREATE TABLE IF NOT EXISTS expenses(
                   id integer PRIMARY KEY,
                   category_id integer NOT NULL,
                   description TEXT,
                   FOREIGN KEY (category_id) REFERENCES categories (id)
                 );
                 """)

  # Check if table exists
  table_not_empty = cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='categories';").fetchone() is not None

  if not table_not_empty:
    cursor.execute("""
                  INSERT INTO categories (id, category) VALUES
                  (1, 'Housing'),
                  (2, 'Food'),
                  (3, 'Transportation'),
                  (4, 'Entertainment'),
                  (5, 'Child-Related'),
                  (6, 'Medical'),
                  (7, 'Investment'),
                  (8, 'Miscellaneous');
                  """)

  conn.commit()

if __name__ == '__main__':
    create_connection(os.getcwd() + '/db.sqlite')