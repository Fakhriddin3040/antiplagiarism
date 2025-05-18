from striprtf.striprtf import rtf_to_text

from src.app.core.abstracts.text_parser import AbstractParser


class RtfParser(AbstractParser):
    def parse(self) -> str:
        content = self.get_file_content()
        text = rtf_to_text(content)
        return text
