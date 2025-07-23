from sqlalchemy import text

from database_files.database_connection import engine
from base_models.base import Base

def reset_db():
    with engine.connect() as conn:
        conn.execute(text("DROP SCHEMA public CASCADE;"))
        conn.execute(text("CREATE SCHEMA public;"))
        conn.commit()
    Base.metadata.create_all(bind=engine)
    print("✅ Database reset complete.")

if __name__ == "__main__":
    reset_db()
