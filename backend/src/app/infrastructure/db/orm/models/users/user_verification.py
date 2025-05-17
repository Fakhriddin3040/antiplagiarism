from datetime import datetime

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from src.app.infrastructure.db.orm import DatabaseTables
from src.base.types.orm.models import SQLAlchemyBaseModel, ChronoModelMixin
from src.base.types.pytypes import ID_T


class UserVerification(SQLAlchemyBaseModel, ChronoModelMixin):
    __tablename__ = DatabaseTables.USERS_VERIFICATIONS

    id = None

    user_id: Mapped[ID_T] = mapped_column(
        ForeignKey(DatabaseTables.USERS.as_foreign_key),
        nullable=False,
        primary_key=True,
    )
    otp: Mapped[str] = mapped_column(String(6), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(nullable=False)
    verified: Mapped[bool] = mapped_column(default=False)
