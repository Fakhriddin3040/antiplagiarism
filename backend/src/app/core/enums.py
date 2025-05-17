from enum import IntEnum, StrEnum, auto


class PlagiarismResultStatusEnum(IntEnum):
    PENDING = 1
    IN_PROGRESS = 2
    COMPLETE = 3
    FAILED = 4


class FileAllowedExtensions(StrEnum):
    XLSX = auto()
    CSV = auto()
    PNG = auto()
    JPG = auto()
    JPEG = auto()
    WEBP = auto()
