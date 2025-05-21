from enum import StrEnum, auto
from typing import Dict, Type

from src.app.core.abstracts.text_parser import AbstractParser
from src.app.core.enums import FileAllowedExtensionEnum
from src.app.infrastructure.parsers.content_parsers.docx_parser import DocxParser
from src.app.infrastructure.parsers.content_parsers.markdown_parser import (
    MarkdownParser,
)
from src.app.infrastructure.parsers.content_parsers.pdf_parser import PdfParser
from src.app.infrastructure.parsers.content_parsers.rtf_parser import RtfParser
from src.app.infrastructure.parsers.content_parsers.txt_parser import TxtParser
from src.utils.constants.models_fields import (
    UserField,
    FileField,
    DocumentAuthorField,
    FolderField,
    DocumentField,
)


class JwtKeys(StrEnum):
    IAT = auto()
    EXP = auto()
    ALG = auto()
    TYP = auto()


class JwtType(StrEnum):
    ACCESS_TOKEN = auto()
    REFRESH_TOKEN = auto()


JWT_REQUIRED_PAYLOAD = {
    UserField.as_outref(),
    JwtKeys.IAT,
    JwtKeys.EXP,
}

JWT_HASH_ALG = "HS256"

ACCESS_TOKEN_EXPIRATION_SECONDS = (
    60 * 60 * 24
) * 1000  # 60 sec * 60 min = 1 hour; * 24 = 1 day


MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


class AllowedMimeTypeEnum(StrEnum):
    PDF = "application/pdf"
    DOC = "application/msword"
    DOCX = "application/vnd.openxmlformats.wordprocessingml.document"
    RTF = "application/rtf"
    TXT = "text/plain"
    MD = "text/markdown"


ALLOWED_MIME_TYPES = {
    AllowedMimeTypeEnum.PDF,
    AllowedMimeTypeEnum.DOC,
    AllowedMimeTypeEnum.DOCX,
    AllowedMimeTypeEnum.RTF,
    AllowedMimeTypeEnum.TXT,
    AllowedMimeTypeEnum.MD,
}


DISALLOWED_EXTENSIONS = {"exe", "dll", "bat", "com", "sh", "py", "bin", "elf"}


class FileUploadType(StrEnum):
    FILE = auto()
    IMAGE = auto()


# ===== API =====
FILE_SEARCH_PERMITTED_FIELDS = {FileField.TITLE, FileField.DESCRIPTION}
DOCUMENT_AUTHOR_SEARCH_PERMITTED_FIELDS = {
    DocumentAuthorField.FIRST_NAME,
    DocumentAuthorField.LAST_NAME,
}
FOLDER_SEARCH_PERMITTED_FIELDS = {
    FolderField.TITLE,
    FolderField.DESCRIPTION,
}
DOCUMENT_SEARCH_PERMITTED_FIELDS = {
    DocumentField.TITLE,
    DocumentField.DESCRIPTION,
}


EXTENSION_CONTENT_PARSER_MAP: Dict[FileAllowedExtensionEnum, Type[AbstractParser]] = {
    FileAllowedExtensionEnum.DOCX: DocxParser,
    FileAllowedExtensionEnum.PDF: PdfParser,
    FileAllowedExtensionEnum.DOC: DocxParser,
    FileAllowedExtensionEnum.RTF: RtfParser,
    FileAllowedExtensionEnum.TXT: TxtParser,
    FileAllowedExtensionEnum.MD: MarkdownParser,
}


# ===== ANTIPLAGIARISM ======
SIMILARITY_THRESHOLD = 0.8
MIN_COVERAGE = 0.3
TOP_K_CHUNKS = 5
