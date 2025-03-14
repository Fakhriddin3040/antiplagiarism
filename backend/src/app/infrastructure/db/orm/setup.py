from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from base.types.orm.models import SQLAlchemyBaseModel
from src.config.settings import DATABASE_URL

from src.app.infrastructure.db.orm.models import (  # noqa
    User,
    PlagiarismResult,
    Document,
    Text,
)

async_engine = create_async_engine(DATABASE_URL)

async_session_maker = async_sessionmaker(
    autocommit=False, autoflush=False, bind=async_engine
)


async def init_tables():
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLAlchemyBaseModel.metadata.create_all)
