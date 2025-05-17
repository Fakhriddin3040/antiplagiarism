# from sqlalchemy import ForeignKey
# from sqlalchemy.orm import Mapped, mapped_column
#
# from src.app.infrastructure.db.orm import DatabaseTables
# from src.base.types.orm.models import SQLAlchemyBaseModel, ChronoModelMixin
# from src.base.types.pytypes import ID_T
#
#
# class File(SQLAlchemyBaseModel, ChronoModelMixin):
#     __tablename__ = DatabaseTables
#
#     title: Mapped[str] = mapped_column(nullable=False)
#     description: Mapped[str] = mapped_column(nullable=False)
#     owner_id: Mapped[ID_T] = mapped_column(
#         ForeignKey(DatabaseTables.USERS.as_foreign_key), nullable=False,
#     )
#     path: Mapped[str] = mapped_column(nullable=False)
