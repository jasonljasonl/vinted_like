import os

from fastapi import APIRouter
from fastapi.staticfiles import StaticFiles

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "statics_files", "images")

router.mount("/images", StaticFiles(directory=STATIC_DIR), name="images")