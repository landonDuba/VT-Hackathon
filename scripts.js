let map;
let directionsService;
let primaryPolyline, alternatePolyline;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.2284, lng: -80.4234 },
        zoom: 12
    });

    directionsService = new google.maps.DirectionsService();

    const startInput = document.getElementById('start');
    const endInput = document.getElementById('end');

    const autocompleteStart = new google.maps.places.Autocomplete(startInput);
    const autocompleteEnd = new google.maps.places.Autocomplete(endInput);

    autocompleteStart.addListener('place_changed', calculateRoutes);
    autocompleteEnd.addListener('place_changed', calculateRoutes);

    document.getElementById('primaryRouteCheckbox').addEventListener('change', togglePrimaryRoute);
    document.getElementById('alternateRouteCheckbox').addEventListener('change', toggleAlternateRoute);
}

function calculateRoutes() {
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;

    if (!start || !end) return;

    fetch('http://localhost:5000/get_routes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ origin: start, destination: end })
    })
    .then(response => response.json())
    .then(data => {
        clearRoutes();

        if (data.length > 0) {
            // Sort routes by score, safest first
            data.sort((a, b) => b.route_score - a.route_score);

            // Render the primary route (safest or based on custom criteria) in red
            primaryPolyline = renderRoute(data[0].route.routes[0].overview_polyline.points, "#FF0000");

            // Render the alternate route (second safest or based on custom criteria) in blue
            if (data[1]) {
                alternatePolyline = renderRoute(data[1].route.routes[0].overview_polyline.points, "#0000FF");
            }

            // Display distance and duration for the primary route
            const route = data[0].route.routes[0].legs[0];
            document.getElementById('distance').textContent = route.distance.text;
            document.getElementById('duration').textContent = route.duration.text;
        }
    })
    .catch(error => console.error('Error fetching routes:', error));
}

function renderRoute(encodedPoints, color) {
    const decodedPath = google.maps.geometry.encoding.decodePath(encodedPoints);
    const polyline = new google.maps.Polyline({
        path: decodedPath,
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 6
    });
    polyline.setMap(map);
    return polyline;
}

function clearRoutes() {
    if (primaryPolyline) primaryPolyline.setMap(null);
    if (alternatePolyline) alternatePolyline.setMap(null);
}

function togglePrimaryRoute() {
    const isChecked = document.getElementById('primaryRouteCheckbox').checked;
    if (primaryPolyline) {
        primaryPolyline.setMap(isChecked ? map : null);
    }
}

function toggleAlternateRoute() {
    const isChecked = document.getElementById('alternateRouteCheckbox').checked;
    if (alternatePolyline) {
        alternatePolyline.setMap(isChecked ? map : null);
    }
}

initMap();

