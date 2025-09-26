from sqlalchemy.orm import Mapped, mapped_column

from src.app.infrastructure.db.orm import DatabaseTables
from src.app.infrastructure.db.orm.types.type_decorators.file_extension import (
    FileExtensionTD,
)
from src.app.infrastructure.db.orm.types.type_decorators.mimetypes import MimeTypeTD
from src.base.types.orm.models import (
    SQLAlchemyBaseModel,
    ChronoModelMixin,
    AuditableModelMixin,
)


class File(SQLAlchemyBaseModel, ChronoModelMixin, AuditableModelMixin):
    __tablename__ = DatabaseTables.FILES

    title: Mapped[str] = mapped_column(nullable=False, index=True)
    description: Mapped[str] = mapped_column(nullable=True)
    path: Mapped[str] = mapped_column(nullable=False)
    extension: Mapped[FileExtensionTD.choices] = mapped_column(
        FileExtensionTD, nullable=False
    )
    mimetype: Mapped[MimeTypeTD.choices] = mapped_column(
        MimeTypeTD,
        nullable=False,
    )
