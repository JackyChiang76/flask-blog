import logging
from datetime import datetime, timedelta

from flask import Blueprint, render_template, request

from .data_manager import DataManager, MissingCredentials
from .flight_data import search_cheapest_flight
from .flight_search import FlightSearch

logger = logging.getLogger(__name__)

flight_bp = Blueprint("flight", __name__, url_prefix="/projects/flight")

DEFAULT_ORIGIN = "LOND|27544008"   # 倫敦（skyId|entityId）

_data_manager = None
_flight_search = None


def get_data_manager():
    """延遲初始化：第一次用到才建立，而且只建立一次。"""
    global _data_manager
    if _data_manager is None:
        _data_manager = DataManager()
    return _data_manager


def get_flight_search():
    global _flight_search
    if _flight_search is None:
        _flight_search = FlightSearch()
    return _flight_search


@flight_bp.route("/")
def index():
    try:
        destinations = get_data_manager().get_destination_data()
    except MissingCredentials as err:
        logger.error("Flight 設定不完整：%s", err)
        destinations = []
    return render_template("projects/flight/index.html", destinations=destinations)


@flight_bp.route("/search", methods=["POST"])
def search():
    city_name = (request.form.get("city_name") or "").strip()
    lowest_price = request.form.get("lowest_price")

    flight = None
    try:
        searcher = get_flight_search()
        dest_ids = searcher.get_IATA_code(city_name)

        departure = datetime.now() + timedelta(days=1)
        return_date = departure + timedelta(days=7)

        data = searcher.search_flights(
            DEFAULT_ORIGIN, dest_ids, departure, return_date
        )
        flight = search_cheapest_flight(data)
    except MissingCredentials as err:
        logger.error("Flight 設定不完整：%s", err)
    except Exception:
        logger.exception("搜尋 %s 航班時發生未預期錯誤", city_name)

    return render_template(
        "projects/flight/result.html",
        flight=flight,
        city=city_name,
        lowest_price=lowest_price,
    )