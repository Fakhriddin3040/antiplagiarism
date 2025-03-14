from sqlalchemy import ForeignKey, Text as TextType
from sqlalchemy.orm import mapped_column, Mapped

from base.types.pytypes import ID_T
from src.app.infrastructure.db.orm.enums import DatabaseTables
from src.app.infrastructure.db.orm.models.documents.document import Document


class Text(Document):
    __tablename__ = DatabaseTables.TEXTS
    id: Mapped[ID_T] = mapped_column(
        ForeignKey(DatabaseTables.DOCUMENTS.as_foreign_key), primary_key=True
    )
    text: Mapped[str] = mapped_column(TextType, nullable=False)
