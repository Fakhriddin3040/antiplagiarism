from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.app.infrastructure.db.orm.enums import DatabaseTables
from base.types.orm.models import SQLAlchemyBaseModel
from src.app.infrastructure.db.orm.models.documents.document import Document


class User(SQLAlchemyBaseModel):
    __tablename__ = DatabaseTables.USERS

    username: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str | None] = mapped_column(String(25), nullable=True)
    last_name: Mapped[str | None] = mapped_column(String(25), nullable=True)
    documents: Mapped[list["Document"]] = relationship(back_populates="author")
