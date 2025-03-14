import os
from typing import Optional


def get_from_env(
    key: str, default: Optional[str] = None, required: bool = False
) -> str:
    value = os.getenv(key, default)

    if required and value is None:
        raise ValueError(f"Environment variable {key} is required")

    return value
