from fastapi import Depends

from src.app.infrastructure.db.orm import User
from src.app.infrastructure.db.repositories.users.user import UserRepository
from src.app.infrastructure.deps import get_db


def get_user_repository(db=Depends(get_db)) -> UserRepository:
    return UserRepository(db=db, model=User)
