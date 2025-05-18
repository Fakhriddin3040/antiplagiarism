from src.app.core.abstracts.text_parser import AbstractParser


class TxtParser(AbstractParser):
    def parse(self) -> str:
        content = self.get_file_content()
        return content
