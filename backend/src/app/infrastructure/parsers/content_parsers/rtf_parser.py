from striprtf.striprtf import rtf_to_text
from src.app.core.abstracts.text_parser import AbstractParser


class RtfParser(AbstractParser):
    def parse(self) -> str:
        txt = rtf_to_text(self.read_text())
        lines = txt.splitlines()
        common = self.scan_common(lines)

        cleaned = [ln for ln in lines if ln and ln not in common and not ln.isdigit()]
        return "\n".join(cleaned)
