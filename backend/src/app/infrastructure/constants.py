from enum import StrEnum, auto

from src.utils.constants.models_fields import UserFields, FileFields


class JwtKeys(StrEnum):
    IAT = auto()
    EXP = auto()
    ALG = auto()
    TYP = auto()


class JwtType(StrEnum):
    ACCESS_TOKEN = auto()
    REFRESH_TOKEN = auto()


JWT_REQUIRED_PAYLOAD = {
    UserFields.as_outref(),
    JwtKeys.IAT,
    JwtKeys.EXP,
}

JWT_HASH_ALG = "HS256"

ACCESS_TOKEN_EXPIRATION_SECONDS = (
    60 * 60 * 24
) * 1000  # 60 sec * 60 min = 1 hour; * 24 = 1 day


MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


class AllowedMimeType(StrEnum):
    PDF = "application/pdf"
    DOC = "application/msword"
    DOCX = "application/vnd.openxmlformats.wordprocessingml.document"
    RTF = "application/rtf"
    TXT = "text/plain"
    MD = "text/markdown"


ALLOWED_MIME_TYPES = {
    AllowedMimeType.PDF,
    AllowedMimeType.DOC,
    AllowedMimeType.DOCX,
    AllowedMimeType.RTF,
    AllowedMimeType.TXT,
    AllowedMimeType.MD,
}


DISALLOWED_EXTENSIONS = {"exe", "dll", "bat", "com", "sh", "py", "bin", "elf"}


class FileUploadType(StrEnum):
    FILE = auto()
    IMAGE = auto()


# ===== API =====
FILE_SEARCH_PERMITTED_FIELDS = {FileFields.TITLE, FileFields.DESCRIPTION}
