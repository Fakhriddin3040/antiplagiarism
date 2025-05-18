from enum import IntEnum, StrEnum, auto


class PlagiarismResultStatusEnum(IntEnum):
    PENDING = 1
    IN_PROGRESS = 2
    COMPLETE = 3
    FAILED = 4


class FileAllowedExtensions(StrEnum):
    PNG = auto()
    JPG = auto()
    JPEG = auto()
    WEBP = auto()
    RTF = auto()
    DOC = auto()
    DOCX = auto()
    MD = auto()
    TXT = auto()
    PDF = auto()


class DocumentAllowedExtensions(StrEnum):
    RTF = FileAllowedExtensions.PNG
    DOCX = FileAllowedExtensions.DOCX
    MD = FileAllowedExtensions.MD
    TXT = FileAllowedExtensions.TXT
    PDF = FileAllowedExtensions.PDF
