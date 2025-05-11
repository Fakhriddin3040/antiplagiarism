from enum import StrEnum, auto


class DatabaseTables(StrEnum):
    # User
    USERS = auto()

    # Document
    DOCUMENTS = auto()
    DOCUMENTS_AUTHORS = auto()
    DOCUMENT_CHUNKS = auto()
    TEXTS = auto()
    FOLDERS = auto()

    # Plagiarism result
    PLAGIARISM_CHECKS = auto()
    PLAGIARISM_MATCHES = auto()

    @property
    def as_foreign_key(self):
        return f"{self.value}.id"

    def specific_field(self, column: str):
        return f"{self.value}.{column}"
