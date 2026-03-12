from urllib.parse import quote_plus

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    DB_HOST: str = "rm-2ze1r48g54eg09z53.mysql.rds.aliyuncs.com"
    DB_PORT: int = 3306
    DB_USER: str = "stat_dev_251029"
    DB_PASSWORD: str = ""
    DB_NAME: str = "test_stat_data"

    # AI - 火山引擎
    VOLCANO_API_KEY: str = ""
    VOLCANO_BASE_URL: str = "https://ark.cn-beijing.volces.com/api/v3"
    VOLCANO_MODEL: str = "deepseek-v3-2-251201"

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    @property
    def database_url(self) -> str:
        password = quote_plus(self.DB_PASSWORD)
        return (
            f"mysql+pymysql://{self.DB_USER}:{password}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}?charset=utf8mb4"
        )

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
