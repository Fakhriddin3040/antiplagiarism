import markdown
from bs4 import BeautifulSoup

from src.app.core.abstracts.text_parser import AbstractParser


class MarkdownParser(AbstractParser):
    def parse(self) -> str:
        raw_md = self.read_text()
        html = markdown.markdown(raw_md)
        soup = BeautifulSoup(html, "html.parser")

        lines = soup.get_text(separator="\n").splitlines()
        common = self.scan_common(lines)

        cleaned = [ln for ln in lines if ln and ln not in common and not ln.isdigit()]
        return "\n".join(cleaned)
