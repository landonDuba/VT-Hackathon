let map;
let directionsService;
let primaryPolyline, alternatePolyline;

// Initialize the map and set up event listeners
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.2284, lng: -80.4234 }, // Adjust as needed
        zoom: 12
    });

    // Set up event listeners for checkboxes
    document.getElementById('primaryRouteCheckbox').addEventListener('change', togglePrimaryRoute);
    document.getElementById('alternateRouteCheckbox').addEventListener('change', toggleAlternateRoute);

    // Initialize DirectionsService
    directionsService = new google.maps.DirectionsService();

    const startInput = document.getElementById('start');
    const endInput = document.getElementById('end');

    const autocompleteStart = new google.maps.places.Autocomplete(startInput);
    const autocompleteEnd = new google.maps.places.Autocomplete(endInput);

    // Add event listeners to calculate routes when places are selected
    autocompleteStart.addListener('place_changed', calculateRoutes);
    autocompleteEnd.addListener('place_changed', calculateRoutes);
}

// Fetch routes from Flask API and render them
function calculateRoutes() {
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;

    if (!start || !end) return;

    fetch('/get_routes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            origin: start,
            destination: end
        })
    })
    .then(response => response.json())
    .then(data => {
        // Clear previous routes
        clearRoutes();

        // Render the primary route (in red)
        const primaryRoute = data[0].route; // Assuming the first route is the primary
        primaryPolyline = renderRoute(primaryRoute, "#FF0000"); // Red color for the primary route

        // Render the alternate route (in blue)
        if (data[1]) {
            const alternateRoute = data[1].route; // Assuming the second route is an alternate
            alternatePolyline = renderRoute(alternateRoute, "#0000FF"); // Blue color for the alternate route
        }

        // Display distance and duration for the primary route
        const route = data[0].route.legs[0];
        document.getElementById('distance').textContent = route.distance.text;
        document.getElementById('duration').textContent = route.duration.text;
    })
    .catch(error => console.error('Error fetching routes:', error));
}

// Function to render custom routes
function renderRoute(route, color) {
    const path = google.maps.geometry.encoding.decodePath(route.overview_polyline.points);
    const polyline = new google.maps.Polyline({
        path: path,
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 6
    });
    polyline.setMap(map);
    return polyline;
}

// Function to clear previous routes
function clearRoutes() {
    if (primaryPolyline) primaryPolyline.setMap(null);
    if (alternatePolyline) alternatePolyline.setMap(null);
}

// Toggle visibility of primary route
function togglePrimaryRoute() {
    const isChecked = document.getElementById('primaryRouteCheckbox').checked;
    if (primaryPolyline) {
        primaryPolyline.setMap(isChecked ? map : null);
    }
}

// Toggle visibility of alternate route
function toggleAlternateRoute() {
    const isChecked = document.getElementById('alternateRouteCheckbox').checked;
    if (alternatePolyline) {
        alternatePolyline.setMap(isChecked ? map : null);
    }
}

// Call initMap to load the map
initMap();


