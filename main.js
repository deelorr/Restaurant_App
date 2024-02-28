let map;
let geocoder;
let service;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 38.5, lng: -121.4 },
    zoom: 7,
  });
  geocoder = new google.maps.Geocoder();
  service = new google.maps.places.PlacesService(map);

  document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault();
    searchLocation();
  });
}

function searchLocation() {
  const address = document.getElementById("searchInput").value;

  geocoder.geocode({ address: address }, (results, status) => {
    if (status === "OK") {
      map.setCenter(results[0].geometry.location);
      map.setZoom(15); // Autozoom for a closer view
      clearMarkers(); // Clear previous markers

      // Search for restaurants nearby
      const request = {
        location: results[0].geometry.location,
        radius: 20000, // in meters = 12.4 mile radius
        type: "restaurant"
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          displayRestaurants(results);
        } else {
          console.error("Places service status:", status);
        }
      });
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function displayRestaurants(results) {
  const restaurantsContainer = document.getElementById("restaurantBox");
  restaurantsContainer.innerHTML = "";

  results.forEach(place => {
    const name = place.name;
    const rating = place.rating || "Not rated";
    const address = place.vicinity;
    const photo = place.photos ? place.photos[0].getUrl() : 'placeholder.png'; // Use placeholder if no photo available

    const card = document.createElement("div");
    card.classList.add("restaurant-card");
    card.innerHTML = `
      <img src="${photo}" alt="${name}" class="restaurant-img">
      <div class="restaurant-details">
        <h2>${name}</h2>
        <p>${address}</p>
        <p>Rating: ${rating}</p>
      </div>
    `;

    card.addEventListener("click", function() {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    });

    restaurantBox.appendChild(card);
  });
}

function clearMarkers() {} // Implement this if needed in the future, for now, we are using PlacesService which handles markers internally