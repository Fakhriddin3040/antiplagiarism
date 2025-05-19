from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from src.app.infrastructure.db.orm import DatabaseTables
from src.app.infrastructure.db.orm.types.type_decorators.file_extension import (
    FileExtensionTD,
)
from src.app.infrastructure.db.orm.types.type_decorators.mimetypes import MimeTypeTD
from src.base.types.orm.models import SQLAlchemyBaseModel, ChronoModelMixin
from src.base.types.pytypes import ID_T


class File(SQLAlchemyBaseModel, ChronoModelMixin):
    __tablename__ = DatabaseTables.FILES

    title: Mapped[str] = mapped_column(nullable=False, index=True)
    description: Mapped[str] = mapped_column(nullable=False)
    owner_id: Mapped[ID_T] = mapped_column(
        ForeignKey(DatabaseTables.USERS.as_foreign_key), nullable=False, index=True
    )
    path: Mapped[str] = mapped_column(nullable=False)
    extension: Mapped[FileExtensionTD.choices] = mapped_column(
        FileExtensionTD, nullable=False
    )
    mimetype: Mapped[MimeTypeTD.choices] = mapped_column(
        MimeTypeTD,
        nullable=False,
    )
