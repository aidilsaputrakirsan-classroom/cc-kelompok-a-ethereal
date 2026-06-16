import sqlite3
import os
from passlib.context import CryptContext

# Database paths
auth_db_path = "services/auth-service/auth.db"
backend_db_path = "backend/test.db"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed_password = pwd_context.hash("Password123")

def seed_db(db_path):
    if not os.path.exists(db_path):
        print(f"Database {db_path} not found, skipping.")
        return

    print(f"Seeding database: {db_path}")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Ensure table users exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users';")
    if not cursor.fetchone():
        print(f"Table 'users' does not exist in {db_path} yet. Running the app will create it first.")
        conn.close()
        return

    # Check if 'role' column exists in users table
    cursor.execute("PRAGMA table_info(users);")
    columns = [col[1] for col in cursor.fetchall()]
    if 'role' not in columns:
        print("Adding 'role' column to 'users' table...")
        cursor.execute("ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'member';")
        conn.commit()

    # Insert/upsert users
    users_to_seed = [
        ("admin@gmail.com", "Admin User", hashed_password, "admin"),
        ("leader@gmail.com", "Leader User", hashed_password, "leader"),
        ("member@gmail.com", "Member User", hashed_password, "member")
    ]

    for email, name, pwd, role in users_to_seed:
        # Check if user already exists
        cursor.execute("SELECT id FROM users WHERE email = ?;", (email,))
        user_row = cursor.fetchone()
        if user_row:
            user_id = user_row[0]
            print(f"User {email} already exists (ID: {user_id}). Updating role to {role}...")
            cursor.execute("UPDATE users SET role = ?, name = ? WHERE id = ?;", (role, name, user_id))
        else:
            print(f"Inserting new user: {email} with role: {role}...")
            cursor.execute("PRAGMA table_info(users);")
            db_cols = [col[1] for col in cursor.fetchall()]
            
            insert_cols = ["email", "name", "role"]
            placeholders = ["?", "?", "?"]
            vals = [email, name, role]

            if "hashed_password" in db_cols:
                insert_cols.append("hashed_password")
                placeholders.append("?")
                vals.append(pwd)
            elif "password_hash" in db_cols:
                insert_cols.append("password_hash")
                placeholders.append("?")
                vals.append(pwd)

            if "is_active" in db_cols:
                insert_cols.append("is_active")
                placeholders.append("?")
                vals.append(1)

            query = f"INSERT INTO users ({', '.join(insert_cols)}) VALUES ({', '.join(placeholders)});"
            cursor.execute(query, tuple(vals))
    
    conn.commit()
    conn.close()
    print(f"Successfully seeded {db_path}!\n")

if __name__ == "__main__":
    seed_db(auth_db_path)
    seed_db(backend_db_path)
