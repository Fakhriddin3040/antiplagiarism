from typing import List

from sqlalchemy import String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.base.types.orm.models import (
    SQLAlchemyBaseModel,
    ChronoModelMixin,
    AuditableModelMixin,
)
from src.app.infrastructure.db.orm import DatabaseTables
from src.base.types.pytypes import ID_T
from src.utils.constants.models_fields import FolderField


class Folder(SQLAlchemyBaseModel, ChronoModelMixin, AuditableModelMixin):
    __tablename__ = DatabaseTables.FOLDERS

    title: Mapped[str] = mapped_column(String(30), nullable=False, index=True)
    description: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    parent_id: Mapped[ID_T] = mapped_column(
        ForeignKey(DatabaseTables.FOLDERS.as_foreign_key, ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    parent: Mapped["Folder"] = relationship(
        "Folder", remote_side="Folder.id", back_populates="children", lazy="noload"
    )
    children: Mapped[List["Folder"]] = relationship(
        "Folder",
        back_populates="parent",
        cascade="all, delete, delete-orphan",
        lazy="noload",
    )

    __table_args__ = (
        UniqueConstraint(
            FolderField.TITLE, FolderField.PARENT_ID, name="uq_folder_title_parent"
        ),
    )
