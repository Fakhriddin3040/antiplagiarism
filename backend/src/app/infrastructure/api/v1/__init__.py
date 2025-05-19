from .user import router as user_router
from .file import router as file_router
from .author import router as document_author_router
from .folder import router as folder_router


__all__ = ["user_router", "file_router", "document_author_router", "folder_router"]
