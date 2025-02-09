// Configuration
const config = {
    openWeatherMap: {
        apiKey: '5450d9439a806988f7cf5d08b2438677', // Replace with your OpenWeather API key
        baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
    },
    aviationStack: {
        apiKey: "6058c68d1f590ddfe30463858de01443", // Replace with your Aviation Stack API key
        flightUrl: "https://api.aviationstack.com/v1/flights"
    }
};

// DOM Elements
const elements = {
    location: document.getElementById('location'),
    from: document.getElementById('from'),
    to: document.getElementById('to'),
    searchBtn: document.getElementById('searchBtn'),
    searchFlightsBtn: document.getElementById('searchFlightsBtn'),
    weather: document.getElementById('weather'),
    flights: document.getElementById('flights'),
    flightLoader: document.getElementById('flightLoader'),
    map: document.getElementById('map')
};

// Map variables
let map;
let markers = [];
let placesService;
let bounds;

// Initialize Google Maps
function initMap() {
    map = new google.maps.Map(elements.map, {
        zoom: 13,
        center: { lat: 0, lng: 0 },
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    });
    placesService = new google.maps.places.PlacesService(map);
    bounds = new google.maps.LatLngBounds();
}

// Clear existing markers
function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    bounds = new google.maps.LatLngBounds();
}

// Add marker to map with enhanced info window
// Add marker to map with proper labels and colors
function addMarker(place, isHospital) {
    const marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name,
        icon: {
            url: isHospital 
                ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' // Hospital
                : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Hotel
            scaledSize: new google.maps.Size(40, 40)
        },
        animation: google.maps.Animation.DROP
    });

    markers.push(marker);
    bounds.extend(place.geometry.location);

    // Info Window Content
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="min-width: 200px; padding: 10px; border-radius: 5px; background: ${isHospital ? '#ef4444' : '#3b82f6'}; color: white;">
                <h3 style="margin: 0;">${place.name}</h3>
                <p style="margin: 5px 0;">${isHospital ? '🏥 Hospital' : '🏨 Hotel'}</p>
                <p>${place.vicinity || 'No address available'}</p>
            </div>
        `
    });

    // Open info window on click
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}

// Search for hotels and hospitals
let hotels = [];
let hospitals = [];

function searchNearbyPlaces(location) {
    clearMarkers();
    hotels = [];
    hospitals = [];

    // Search for Hotels
    placesService.nearbySearch(
        {
            location: location,
            radius: 5000,
            type: ['lodging'],
            rankBy: google.maps.places.RankBy.RATING
        },
        (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                results.forEach(place => {
                    addMarker(place, false);
                    hotels.push(place);
                });
                map.fitBounds(bounds);
                displayPlaces(); // Display the list of hotels and hospitals
            }
        }
    );

    // Search for Hospitals
    placesService.nearbySearch(
        {
            location: location,
            radius: 5000,
            type: ['hospital'],
            rankBy: google.maps.places.RankBy.RATING
        },
        (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                results.forEach(place => {
                    addMarker(place, true);
                    hospitals.push(place);
                });
                map.fitBounds(bounds);
                displayPlaces(); // Display the list of hotels and hospitals
            }
        }
    );
}

function displayPlaces() {
    const placesContainer = document.createElement('div');
    placesContainer.className = 'places-container';

    // Display Hotels
    if (hotels.length > 0) {
        const hotelsList = document.createElement('div');
        hotelsList.className = 'places-list';
        hotelsList.innerHTML = `<h3>🏨 Hotels (${hotels.length})</h3>`;

        hotels.forEach(hotel => {
            const hotelItem = document.createElement('div');
            hotelItem.className = 'place-item';
            hotelItem.innerHTML = `
                <p><strong>${hotel.name}</strong></p>
                <p>${hotel.vicinity || 'No address available'}</p>
                <p>Rating: ${hotel.rating || 'N/A'}</p>
            `;
            hotelsList.appendChild(hotelItem);
        });

        placesContainer.appendChild(hotelsList);
    } else {
        placesContainer.innerHTML += `<p>No hotels found in the area.</p>`;
    }

    // Display Hospitals
    if (hospitals.length > 0) {
        const hospitalsList = document.createElement('div');
        hospitalsList.className = 'places-list';
        hospitalsList.innerHTML = `<h3>🏥 Hospitals (${hospitals.length})</h3>`;

        hospitals.forEach(hospital => {
            const hospitalItem = document.createElement('div');
            hospitalItem.className = 'place-item';
            hospitalItem.innerHTML = `
                <p><strong>${hospital.name}</strong></p>
                <p>${hospital.vicinity || 'No address available'}</p>
                <p>Rating: ${hospital.rating || 'N/A'}</p>
            `;
            hospitalsList.appendChild(hospitalItem);
        });

        placesContainer.appendChild(hospitalsList);
    } else {
        placesContainer.innerHTML += `<p>No hospitals found in the area.</p>`;
    }

    // Append to the DOM
    const existingPlaces = document.getElementById('places');
    if (existingPlaces) {
        existingPlaces.remove(); // Remove existing places list if it exists
    }

    placesContainer.id = 'places';
    document.body.appendChild(placesContainer);
}


// Clear existing markers
function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    bounds = new google.maps.LatLngBounds();
}


// Fetch weather data
async function getWeather(city) {
    try {
        const response = await fetch(
            `${config.openWeatherMap.baseUrl}?q=${city}&appid=${config.openWeatherMap.apiKey}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error('Weather data not found');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

// Display weather information with enhanced UI
function displayWeather(weatherData) {
    const temp = Math.round(weatherData.main.temp);
    const humidity = weatherData.main.humidity;
    const windSpeed = Math.round(weatherData.wind.speed * 3.6);
    const description = weatherData.weather[0].description;
    const icon = weatherData.weather[0].icon;
    const feelsLike = Math.round(weatherData.main.feels_like);

    elements.weather.innerHTML = `
        <div class="weather-card">
            <h3>Temperature</h3>
            <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon" class="weather-icon">
            <p class="temp">${temp}°C</p>
            <p class="feels-like">Feels like: ${feelsLike}°C</p>
            <p class="description">${description}</p>
        </div>
        <div class="weather-card">
            <h3>Humidity</h3>
            <p class="humidity">${humidity}%</p>
            <div class="humidity-bar" style="background: linear-gradient(to right, #3b82f6 ${humidity}%, #e2e8f0 ${humidity}%); height: 8px; border-radius: 4px; margin-top: 8px;"></div>
        </div>
        <div class="weather-card">
            <h3>Wind Speed</h3>
            <p class="wind-speed">${windSpeed} km/h</p>
            <div class="wind-direction" style="transform: rotate(${weatherData.wind.deg}deg)">↑</div>
        </div>
    `;
}

// Fetch and display flights
async function searchFlights() {
    const from = elements.from.value.toUpperCase();
    const to = elements.to.value.toUpperCase();

    if (!from || !to) {
        showError('Please enter valid IATA codes');
        return;
    }

    if (from === to) {
        showError('Origin and destination cannot be the same');
        return;
    }

    showLoader(true);

    try {
        const params = new URLSearchParams({
            access_key: config.aviationStack.apiKey,
            dep_iata: from,
            arr_iata: to,
            flight_status: "scheduled"
        });

        const response = await fetch(`${config.aviationStack.flightUrl}?${params}`);
        const flightData = await response.json();

        if (!response.ok || flightData.error) {
            showError(`API Error: ${flightData.error ? flightData.error.info : 'Unknown error'}`);
            return;
        }

        if (!flightData.data || flightData.data.length === 0) {
            showError('No flights found.');
            return;
        }

        displayFlights(flightData.data);
    } catch (error) {
        console.error("Error fetching flights:", error);
        showError('Network error while fetching flights.');
    } finally {
        showLoader(false);
    }
}

// Display flights with enhanced UI
function displayFlights(flights) {
    const flightsHTML = flights.map(flight => {
        const airline = flight.airline.name || "Unknown Airline";
        const flightNumber = flight.flight.iata || "N/A";
        const status = flight.flight_status || "Unknown";
        const departure = flight.departure.iata || "Unknown";
        const arrival = flight.arrival.iata || "Unknown";
        const departureTime = formatDate(flight.departure.estimated || flight.departure.scheduled);
        const arrivalTime = formatDate(flight.arrival.estimated || flight.arrival.scheduled);
        const statusColor = getStatusColor(status);
        const bookingLink = `https://www.google.com/search?q=${airline}+${flightNumber}+flight+tickets`;

        return `
            <div class="flight-card">
                <h3>${airline} - Flight ${flightNumber}</h3>
                <div class="flight-details">
                    <p><strong>From:</strong> ${departure} at ${departureTime}</p>
                    <p><strong>To:</strong> ${arrival} at ${arrivalTime}</p>
                    <p class="status" style="color: ${statusColor}">
                        <strong>Status:</strong> ${status.toUpperCase()}
                    </p>
                </div>
                <a href="${bookingLink}" target="_blank" class="book-link">
                    🔗 Book Flight
                </a>
            </div>
        `;
    }).join('');

    elements.flights.innerHTML = `
        <h3 style="margin-bottom: 1rem;">Available Flights:</h3>
        ${flightsHTML}
    `;
}

function formatDate(dateString) {
    if (!dateString) return "N/A";
    const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
}

function getStatusColor(status) {
    const colors = {
        scheduled: '#2563eb',
        active: '#22c55e',
        landed: '#059669',
        cancelled: '#ef4444',
        incident: '#dc2626',
        diverted: '#f59e0b'
    };
    return colors[status.toLowerCase()] || '#6b7280';
}

function showError(message) {
    elements.flights.innerHTML = `<p class="error">${message}</p>`;
}

function showLoader(show) {
    elements.flightLoader.classList.toggle('hidden', !show);
    elements.searchFlightsBtn.disabled = show;
}

// Main search function
async function handleSearch() {
    const city = elements.location.value.trim();
    
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    try {
        const request = {
            query: `${city}`,
            fields: ['name', 'geometry']
        };

        placesService.findPlaceFromQuery(request, async (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results[0]) {
                const location = results[0].geometry.location;
                
                // Center map and search for places
                map.setCenter(location);
                searchNearbyPlaces(location);

                // Get and display weather
                try {
                    const weatherData = await getWeather(city);
                    displayWeather(weatherData);
                } catch (error) {
                    elements.weather.innerHTML = `
                        <div class="error">
                            Unable to fetch weather data. Please try again later.
                        </div>
                    `;
                }
            } else {
                alert('City not found. Please try another city name.');
            }
        });
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.searchFlightsBtn.addEventListener('click', searchFlights);
    elements.location.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    elements.from.addEventListener('input', e => e.target.value = e.target.value.toUpperCase());
    elements.to.addEventListener('input', e => e.target.value = e.target.value.toUpperCase());
});