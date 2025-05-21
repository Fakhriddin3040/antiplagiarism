from enum import IntEnum, StrEnum, auto


class PlagiarismCheckStatusEnum(IntEnum):
    PENDING = 1
    IN_PROGRESS = 2
    COMPLETE = 3
    FAILED = 4


class PlagiarismCheckVerdictEnum(IntEnum):
    PLAGIARISM = auto()
    PARTIAL_PLAGIARISM = auto()
    UNIQUE = auto()


class FileAllowedExtensionEnum(StrEnum):
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
    RTF = FileAllowedExtensionEnum.PNG
    DOCX = FileAllowedExtensionEnum.DOCX
    MD = FileAllowedExtensionEnum.MD
    TXT = FileAllowedExtensionEnum.TXT
    PDF = FileAllowedExtensionEnum.PDF
