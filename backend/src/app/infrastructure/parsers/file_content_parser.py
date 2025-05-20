import logging
from pathlib import Path
from typing import Optional

from src.app.core.enums import FileAllowedExtensionEnum
from src.app.infrastructure.constants import EXTENSION_CONTENT_PARSER_MAP


logger = logging.getLogger(__name__)


class FileContentParser:
    def parse_content(
        self, extension: FileAllowedExtensionEnum, path: Path | str
    ) -> Optional[str]:
        path = Path(path)

        if not path.exists():
            msg = (
                "The file with path %s exists in database, but not found in fs!"
                % str(path)
            )
            logger.critical(msg)
            raise ValueError(msg)

        full_path = path.resolve()

        parser_class = EXTENSION_CONTENT_PARSER_MAP.get(extension, None)
        if not parser_class:
            msg = "There is and extension(%s), which has no content parser!" % extension

            logger.critical(msg)
            raise AssertionError(msg)

        parser = parser_class(path=full_path)
        return parser.parse()
