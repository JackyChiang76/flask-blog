import logging
import os

import requests

from .data_manager import MissingCredentials

logger = logging.getLogger(__name__)

BASE_URL = "https://sky-scrapper.p.rapidapi.com/api/v1/flights"
TIMEOUT = (5, 20)


class FlightSearch:
    def __init__(self):
        self.api_key = os.environ.get("RAPIDAPI_KEY")
        if not self.api_key:
            raise MissingCredentials("缺少 RAPIDAPI_KEY，請檢查 .env")
        self.headers = {
            "x-rapidapi-key": self.api_key,
            "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
        }

    def get_IATA_code(self, city_name):
        try:
            response = requests.get(
                f"{BASE_URL}/searchAirport",
                headers=self.headers,
                params={"query": city_name},
                timeout=TIMEOUT,
            )
            response.raise_for_status()
            first = response.json()["data"][0]
            return f"{first['skyId']}|{first['entityId']}"
        except requests.RequestException as err:
            logger.error("查詢 %s 機場代碼失敗：%s", city_name, err)
            return None
        except (IndexError, KeyError, ValueError):
            logger.warning("找不到 %s 的機場代碼", city_name)
            return None

    def search_flights(self, origin_ids, dest_ids, departure_date, return_date):
        if not origin_ids or "|" not in origin_ids:
            logger.error("無效的出發地代碼：%r", origin_ids)
            return None
        if not dest_ids or "|" not in dest_ids:
            logger.error("無效的目的地代碼：%r", dest_ids)
            return None

        origin_sky, origin_entity = origin_ids.split("|")
        dest_sky, dest_entity = dest_ids.split("|")

        try:
            response = requests.get(
                f"{BASE_URL}/searchFlights",
                headers=self.headers,
                params={
                    "originSkyId": origin_sky,
                    "destinationSkyId": dest_sky,
                    "originEntityId": origin_entity,
                    "destinationEntityId": dest_entity,
                    "date": departure_date.strftime("%Y-%m-%d"),
                    "returnDate": return_date.strftime("%Y-%m-%d"),
                    "cabinClass": "economy",
                    "adults": 1,
                    "currency": "GBP",
                },
                timeout=TIMEOUT,
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as err:
            logger.error("搜尋 %s -> %s 航班失敗：%s", origin_sky, dest_sky, err)
            return None
        except ValueError:
            logger.error("航班 API 回傳的不是合法 JSON")
            return None