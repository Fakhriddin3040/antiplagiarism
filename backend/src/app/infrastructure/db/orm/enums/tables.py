from enum import StrEnum


class DatabaseTables(StrEnum):
    # User
    USERS = "users"

    # Document
    DOCUMENTS = "documents"
    DOCUMENT_CHUNKS = "document_chunks"
    TEXTS = "texts"

    # Plagiarism result
    PLAGIARISM_CHECKS = "plagiarism_checks"
    PLAGIARISM_MATCHES = "plagiarism_matches"

    @property
    def as_foreign_key(self):
        return f"{self.value}.id"

    def specific_field(self, column: str):
        return f"{self.value}.{column}"
