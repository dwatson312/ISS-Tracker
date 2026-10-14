// Intialization
const map = L.map("map", {
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: false,
    boxZoom: false,
    keyboard: false,
    dragging: false
}).setView([0, 0], 4);

const issIcon = L.icon({
    iconUrl: 'iss-icon.png',
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    popupAnchor: [0, -25],
});

const issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Fetch ISS API Data

fetchData();

async function fetchData() {
    try {
        const response = await fetch("http://api.open-notify.org/iss-now.json");

        if (!response.ok) {
            throw new Error("Could not fetch resource.");
        }

        const data = await response.json();

        updateDisplay(data);
        updateMap(data);
    }
    catch (error) {
        console.error(error);
    }
}

function updateDisplay(data) {
    const timestamp = data.timestamp;
    const date = new Date(timestamp * 1000);

    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let meridiem = "AM"

    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    if (hours >= 12) {
        meridiem = "PM"
    } else {
        meridiem = "AM"
    }

    if (hours > 12) {
        hours = hours - 12;
    }

    if (hours === 0) {
        hours = 12;
    }

    document.getElementById("latitude").textContent = `Latitude: ${data.iss_position.latitude}`
    document.getElementById("longitude").textContent = `Longitude: ${data.iss_position.longitude}`
    document.getElementById("timestamp").textContent =`Timestamp: ${hours}:${minutes}:${seconds} ${meridiem}`;
}

function updateMap(data) {
    const latitude = data.iss_position.latitude;
    const longitude = data.iss_position.longitude;

    issMarker.setLatLng([latitude, longitude]);

    map.panTo([latitude, longitude]);
}

setInterval(fetchData, 5000)