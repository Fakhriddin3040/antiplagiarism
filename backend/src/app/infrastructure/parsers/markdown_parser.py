import markdown
from bs4 import BeautifulSoup

from src.app.core.abstracts.text_parser import AbstractParser


class MarkdownParser(AbstractParser):
    def parse(self) -> str | None:
        file = self.open()
        content = file.read()
        self.close(file)

        html = markdown.markdown(content)
        soup = BeautifulSoup(html, "html.parser")
        return soup.get_text(separator="\n")  # noqa
