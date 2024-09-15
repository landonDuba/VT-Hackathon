let map;
let directionsService;
let directionsRenderer;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.2284, lng: -80.4234 }, // Adjust as needed
        zoom: 12
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const startInput = document.getElementById('start');
    const endInput = document.getElementById('end');

    const autocompleteStart = new google.maps.places.Autocomplete(startInput);
    const autocompleteEnd = new google.maps.places.Autocomplete(endInput);

    // Add event listeners to calculate the route when places are selected
    autocompleteStart.addListener('place_changed', calculateRoute);
    autocompleteEnd.addListener('place_changed', calculateRoute);
}

function calculateRoute() {
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;

    if (!start || !end) return;

    const request = {
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    };

    directionsService.route(request, (response, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);

            const route = response.routes[0].legs[0];
            const distance = route.distance.text;
            const duration = route.duration.text;

            document.getElementById('distance').textContent = distance;
            document.getElementById('duration').textContent = duration;
        } else {
            console.error('Directions request failed due to ' + status);
        }
    });
}
