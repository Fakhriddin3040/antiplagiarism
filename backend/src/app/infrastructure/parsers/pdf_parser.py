from typing import Generator

import pdfplumber

from src.app.core.abstracts.text_parser import AbstractParser


class PdfParser(AbstractParser):
    def parse(self) -> str:
        parts = list(self._parse())
        full_text = " ".join(part for part in parts if part)
        return full_text

    def _parse(self) -> Generator[str, None, None]:
        with pdfplumber.open(self.path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    yield text
