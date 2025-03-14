from fastapi import FastAPI
from contextlib import contextmanager

from src.app.infrastructure.db.orm.setup import init_tables

app = FastAPI()


@contextmanager
async def main():
    await init_tables()
    yield


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "entrypoint:app",
        host="0.0.0.0",
        port=8000,
        log_level="debug",
        reload=True,
    )
