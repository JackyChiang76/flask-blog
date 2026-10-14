class FlightData:
    def __init__(self, price, origin_location, destination, departure_date, return_date):
        self.price = price
        self.origin_location = origin_location
        self.destination_location = destination
        self.departure_date = departure_date
        self.return_date = return_date


def search_cheapest_flight(data):
    if data is None or 'data' not in data or 'itineraries' not in data['data']:
        print("No suitable flight was found, or the information format is incorrect.")
        return None

    itineraries = data['data']['itineraries']
    if len(itineraries) == 0:
        print("There are no flights on this date.")
        return None

    cheapest = itineraries[0]

    try:
        price = cheapest['price']['raw']

        outbound_leg = cheapest['legs'][0]
        origin = outbound_leg['origin']['displayCode']
        destination = outbound_leg['destination']['displayCode']
        departure_date = outbound_leg['departure'].split("T")[0]

        if len(cheapest['legs']) > 1:
            return_leg = cheapest['legs'][1]
            return_date = return_leg['departure'].split("T")[0]
        else:
            return_date = "N/A"

        return FlightData(price, origin, destination, departure_date, return_date)

    except KeyError as e:
        print(f"An error occurred while parsing the JSON; a key-value pair is missing.: {e}")
        return None