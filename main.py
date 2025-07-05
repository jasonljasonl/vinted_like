from fastapi import FastAPI, Depends
from accounts.account import router as user_router
from accounts.account_security import router as auth_router
from accounts.models import Base
from database_files.database_connection import engine

app = FastAPI()
Base.metadata.create_all(bind=engine)

app.include_router(user_router)
app.include_router(auth_router)


@app.get('/')
async def root():
    return {'message': 'Hello World'}

