from enum import StrEnum, auto


class ApiEndpointsTags(StrEnum):
    AUTH = auto()
    FILES = auto()
    AUTHORS = auto()
    FOLDERS = auto()
    DOCUMENTS = auto()
    PLAGIARISM_CHECKS = auto()
