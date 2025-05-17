from pathlib import Path

from dotenv import load_dotenv

from src.utils.functions import get_from_env


load_dotenv()


# ===== DATABASE ======
DATABASE_URL = get_from_env("DATABASE_URL", required=True)


# ====== AUTH ======
APP_SECRET = get_from_env("SECRET_KEY", required=True)


# ====== PROJECT ======
PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
STATIC_PATH = "static"
STATIC_ROOT = PROJECT_ROOT / STATIC_PATH


MEDIA_PATH = "media"
MEDIA_ROOT = PROJECT_ROOT / MEDIA_PATH

IMAGES_PATH = "images"
IMAGES_ROOT = MEDIA_ROOT / IMAGES_PATH

FILES_PATH = "files"
FILES_ROOT = MEDIA_ROOT / FILES_PATH
