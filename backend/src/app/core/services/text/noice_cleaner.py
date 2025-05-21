import re


class TextNoiseCleaner:
    BULLETS_PATTERN = r"[•\u2022\u00B7\uF0B7]+"  # обычная «•», middle dot, Wingdings

    def __init__(self, min_repeats: int = 4):
        self.min_repeats = min_repeats

    def clean_repetitions(self, text: str) -> str:
        # Заменяем символы, повторяющиеся более N раз, на 3 подряд
        return re.sub(rf"(.)\1{{{self.min_repeats},}}", r"\1\1\1", text)

    def remove_weird_symbols(self, text: str) -> str:
        # Убираем мусор типа ----, ====, ❖❖❖, ​, неразрывные пробелы
        patterns = [
            r"[-=*_~<>•◦]{3,}",  # повтор спецсимволов
            r"[\u200b\u00a0]+",  # невидимые символы
            r"[\s]{4,}",  # куча пробелов
        ]
        for pattern in patterns:
            text = re.sub(pattern, " ", text)
        return text

    def remove_bullets(self, text: str) -> str:
        return re.sub(self.BULLETS_PATTERN, " ", text)

    def clean(self, text: str) -> str:
        text = self.clean_repetitions(text)
        text = self.remove_weird_symbols(text)
        text = self.remove_bullets(text)
        return re.sub(r"\s{2,}", " ", text).strip()
