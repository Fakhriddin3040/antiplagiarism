from sqlalchemy import ForeignKey, String, Text as TextType
from sqlalchemy.orm import Mapped, mapped_column, relationship

from base.types.pytypes import ID_T
from src.app.infrastructure.db.orm.enums import DatabaseTables
from base.types.orm.models import SQLAlchemyBaseModel
from src.app.infrastructure.db.orm.models.users.user import User


class Document(SQLAlchemyBaseModel):
    __tablename__ = DatabaseTables.DOCUMENTS

    author_id: Mapped[ID_T] = mapped_column(
        ForeignKey(DatabaseTables.USERS.as_foreign_key), nullable=False
    )
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(TextType, nullable=True)

    author: Mapped["User"] = relationship(back_populates="documents")
