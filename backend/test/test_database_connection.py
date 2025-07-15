import sys
import os

import pytest
from sqlalchemy import text
from sqlalchemy.exc import OperationalError

from backend.database_files.database_connection import engine

sys.path.append(os.path.dirname(os.path.dirname(__file__)))



def test_database_connection():
    try:
        with engine.connect() as connection:
            result = connection.execute(text('SELECT 1'))
            assert result.scalar() == 1
    except OperationalError:
        pytest.fail('Unable to connect')