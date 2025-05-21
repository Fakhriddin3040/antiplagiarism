import re
import pdfplumber
from typing import Generator
from src.app.core.abstracts.text_parser import AbstractParser

HEADER_FOOTER_SCAN = 5
MAX_HEADER_HEIGHT = 70  # pt
MAX_FOOTER_HEIGHT = 50  # pt

PAGE_NUM_RE = re.compile(r"^\s*[—–-]?\s*(?:page\s+)?\d+\s*[—–-]?\s*$", re.I)


class PdfParser(AbstractParser):
    def parse(self) -> str:
        parts = list(self._parse())
        return " ".join(parts)

    def _parse(self) -> Generator[str, None, None]:
        with pdfplumber.open(self.path) as pdf:
            # 1. собираем общие строки
            probe_lines = [
                (pdf.pages[i].extract_text() or "").splitlines()
                for i in range(min(HEADER_FOOTER_SCAN, len(pdf.pages)))
            ]
            common_lines = self.scan_common(probe_lines)

            # 2. основной проход
            for page in pdf.pages:
                # обрежем по геометрии
                if page.rotation in (90, 270):  # альбомка
                    body = page.crop(
                        (
                            MAX_HEADER_HEIGHT,
                            0,
                            page.width - MAX_FOOTER_HEIGHT,
                            page.height,
                        )
                    )
                else:
                    body = page.within_bbox(
                        (
                            0,
                            MAX_HEADER_HEIGHT,
                            page.width,
                            page.height - MAX_FOOTER_HEIGHT,
                        )
                    )

                text = body.extract_text() or ""
                lines = text.splitlines()

                cleaned = [
                    ln
                    for ln in lines
                    if ln and ln not in common_lines and not PAGE_NUM_RE.fullmatch(ln)
                ]
                if cleaned:
                    yield "\n".join(cleaned)
