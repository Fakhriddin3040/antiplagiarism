from src.app.infrastructure.db.orm.setup import async_session_maker


async def get_db():
    async with async_session_maker() as session:
        try:
            yield session
        except Exception as e:
            await session.rollback()
            raise e
        finally:
            await session.commit()
            await session.close()
