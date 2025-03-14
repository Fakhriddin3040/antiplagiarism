from dotenv import load_dotenv

from utils.functions import get_from_env


load_dotenv()


# ===== DATABASE ======
DATABASE_URL = get_from_env("DATABASE_URL", required=True)
