import os
import sys

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles

from backend.base_models.base import Base
from backend.database_files.database_connection import engine
from backend.accounts.account_routes import router as user_router
from backend.accounts.account_security import router as auth_router
from backend.products.product_routes import router as product_router
from backend.upload_system import router as images_router
from backend.utils.auto_import_models import auto_import_models_from_package


app = FastAPI()
app.mount("/statics_files", StaticFiles(directory="/backend/statics_files"), name="statics")

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

auto_import_models_from_package("backend")

Base.metadata.create_all(bind=engine)

app.include_router(user_router, prefix='/users')
app.include_router(auth_router)
app.include_router(product_router, prefix='/products')
app.include_router(images_router)

@app.get('/')
async def root():
    return {'message': 'Hello World'}

