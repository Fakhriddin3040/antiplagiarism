from dotenv import load_dotenv

from src.utils.functions import get_from_env


load_dotenv()


# ===== DATABASE ======
DATABASE_URL = get_from_env("DATABASE_URL", required=True)
APP_SECRET = get_from_env("SECRET_KEY", required=True)
