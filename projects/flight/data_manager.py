import json
import logging
import os
import time
from pathlib import Path

import requests
from requests.auth import HTTPBasicAuth

logger = logging.getLogger(__name__)

SHEETY_ENDPOINT = "https://api.sheety.co/d9b4a027842556a51be022c30ac92c1e/flightDeals/prices"

CACHE_TTL = 600                 # 記憶體快取有效期（秒）
TIMEOUT = (5, 20)               # (連線逾時, 讀取逾時)
SNAPSHOT = Path(__file__).resolve().parent / "data" / "destinations.json"


class MissingCredentials(RuntimeError):
    """.env 沒設好時拋出，讓呼叫端可以優雅降級而不是整站掛掉。"""


class DataManager:
    def __init__(self):
        self.user = os.environ.get("sheety_username")
        self.password = os.environ.get("sheety_password")
        if not self.user or not self.password:
            raise MissingCredentials(
                "缺少 sheety_username / sheety_password，請檢查 .env"
            )
        self.auth = HTTPBasicAuth(self.user, self.password)
        self._cache = None
        self._cache_at = 0.0

    def get_destination_data(self):
        now = time.time()
        # 第一層：記憶體快取
        if self._cache is not None and now - self._cache_at < CACHE_TTL:
            logger.debug("目的地清單：命中記憶體快取")
            return self._cache

        try:
            response = requests.get(SHEETY_ENDPOINT, auth=self.auth, timeout=TIMEOUT)
            response.raise_for_status()
            data = response.json()["prices"]
        except (requests.RequestException, ValueError, KeyError) as err:
            # 第二層：外部服務掛掉時，改讀本地快照
            logger.warning("Sheety 取得失敗（%s），改用本地快照", err)
            return self._load_snapshot()

        self._cache = data
        self._cache_at = now
        self._save_snapshot(data)
        logger.info("目的地清單：已向 Sheety 更新 %d 筆", len(data))
        return data

    def _load_snapshot(self):
        if not SNAPSHOT.exists():
            logger.error("本地快照不存在，回傳空清單")
            return []
        try:
            return json.loads(SNAPSHOT.read_text(encoding="utf-8"))
        except ValueError:
            logger.error("本地快照損毀，回傳空清單")
            return []

    def _save_snapshot(self, data):
        try:
            SNAPSHOT.parent.mkdir(parents=True, exist_ok=True)
            SNAPSHOT.write_text(
                json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
            )
        except OSError as err:
            logger.warning("快照寫入失敗：%s", err)

    def update_destination_codes(self):
        """目前未被任何路由使用，保留給 100 Days 課程後續章節。"""
        for city in self._cache or []:
            payload = {"price": {"iataCode": city["iataCode"]}}
            requests.put(
                f"{SHEETY_ENDPOINT}/{city['id']}",
                json=payload,
                auth=self.auth,
                timeout=TIMEOUT,
            )