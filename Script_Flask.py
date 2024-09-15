from flask import Flask, request, jsonify
import requests
import pandas as pd

app = Flask(__name__)

class SafeRouteCalculator:
    def __init__(self, api_key, safety_data):
        self.api_key = api_key
        self.safety_data = safety_data

    def get_directions(self, origin, destination):
        url = f"https://maps.googleapis.com/maps/api/directions/json?origin={origin}&destination={destination}&alternatives=true&key={self.api_key}"
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Error fetching directions: {response.json()}")

    def get_road_safety(self, road_name):
        road_data = self.safety_data[self.safety_data['Route or Street Name'].str.contains(road_name, case=False, na=False)]
        if not road_data.empty:
            return road_data['adjusted_safety_rating'].values[0]
        return 100  # Default safety rating if the road is not found

    def calculate_route_safety(self, steps):
        total_safety = 0
        for step in steps:
            road_name = step['html_instructions']
            safety_rating = self.get_road_safety(road_name)
            total_safety += safety_rating
        return total_safety / len(steps) if len(steps) > 0 else 100

    def calculate_route_score(self, route_safety, travel_time, safety_weight=0.7, time_weight=0.3):
        max_travel_time = 3600  # Assume 1 hour max travel time for normalization (you can adjust this)
        time_score = 100 - (travel_time / max_travel_time * 100)  # Normalize time
        return (safety_weight * route_safety) + (time_weight * time_score)

    def run(self, origin, destination):
        routes_data = self.get_directions(origin, destination)
        routes_info = []

        # Loop over all routes and calculate safety and total score
        for route in routes_data['routes']:
            steps = route['legs'][0]['steps']
            travel_time = route['legs'][0]['duration']['value']  # Travel time in seconds
            route_safety = self.calculate_route_safety(steps)
            route_score = self.calculate_route_score(route_safety, travel_time)

            # Append route information to the list
            routes_info.append({
                'route': route,
                'safety_score': route_safety,
                'route_score': route_score,
                'travel_time': travel_time
            })

        return routes_info

# Load your safety data (assuming you already have it in CSV format)
safety_data = pd.read_csv('safety_data.csv')
api_key = 'AIzaSyC149u_RPVLNfkwHO9JFA0aHo0yuvXIefY'
safe_route_calculator = SafeRouteCalculator(api_key, safety_data)

@app.route('/get_routes', methods=['POST'])
def get_routes():
    data = request.json
    origin = data.get('origin')
    destination = data.get('destination')

    if not origin or not destination:
        return jsonify({"error": "Please provide both origin and destination"}), 400

    try:
        # Run the safety route calculation
        routes_info = safe_route_calculator.run(origin, destination)
        return jsonify(routes_info), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)