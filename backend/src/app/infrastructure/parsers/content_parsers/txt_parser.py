from src.app.core.abstracts.text_parser import AbstractParser


class TxtParser(AbstractParser):
    def parse(self) -> str:
        lines = list(self.read_text().splitlines())
        common = self.scan_common(lines)

        cleaned = [ln for ln in lines if ln and ln not in common and not ln.isdigit()]
        return "\n".join(cleaned)
