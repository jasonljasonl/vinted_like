from fastapi import FastAPI
from backend.base_models.base import Base
from backend.database_files.database_connection import engine
from backend.accounts.account_routes import router as user_router
from backend.accounts.account_security import router as auth_router
from backend.products.product_routes import router as product_router
from backend.upload_system import router as images_router

app = FastAPI()
Base.metadata.create_all(bind=engine)

app.include_router(user_router, prefix='/users')
app.include_router(auth_router)
app.include_router(product_router, prefix='/products')
app.include_router(images_router)

@app.get('/')
async def root():
    return {'message': 'Hello World'}

