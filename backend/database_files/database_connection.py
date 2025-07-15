import sys
import os

from backend.base_models.base import Base

sys.path.append(os.path.dirname(os.path.dirname(__file__)))


from sqlalchemy.orm import sessionmaker, Session
from sqlmodel import create_engine
from dotenv import load_dotenv


load_dotenv()
DB_HOST=os.getenv('DB_HOST')
DB_PORT=os.getenv('DB_PORT')
DB_USER=os.getenv('DB_USER')
DB_PASSWORD=os.getenv('DB_PASSWORD')
DB_NAME=os.getenv('DB_NAME')

SQL_MODEL_DATABASE_URL = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

engine = create_engine(SQL_MODEL_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_session() -> Session:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()