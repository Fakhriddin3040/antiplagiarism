from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from src.app.infrastructure.db.orm.enums import DatabaseTables
from src.base.types.orm.models import SQLAlchemyBaseModel, ChronoModelMixin


class User(SQLAlchemyBaseModel, ChronoModelMixin):
    __tablename__ = DatabaseTables.USERS

    username: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    first_name: Mapped[str | None] = mapped_column(String(25), nullable=True)
    last_name: Mapped[str | None] = mapped_column(String(25), nullable=True)
    confirmed: Mapped[bool] = mapped_column(default=False)
