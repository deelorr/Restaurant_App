let map;
let geocoder;
let service;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 0, lng: 0 },
    zoom: 8,
  });
  geocoder = new google.maps.Geocoder();
  service = new google.maps.places.PlacesService(map);

  document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission
    searchLocation();
  });
}

function searchLocation() {
  const address = document.getElementById("searchInput").value;

  geocoder.geocode({ address: address }, (results, status) => {
    if (status === "OK") {
      map.setCenter(results[0].geometry.location);
      map.setZoom(15); // Zoom in for a closer view

      // Clear previous markers
      clearMarkers();

      // Search for restaurants nearby
      const request = {
        location: results[0].geometry.location,
        radius: 1500, // in meters (adjust as needed)
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

  return false; // Prevent form submission
}

function displayRestaurants(results) {
  const restaurantsList = document.getElementById("restaurantsList");
  restaurantsList.innerHTML = "";

  results.forEach(place => {
    const name = place.name;
    const rating = place.rating || "Not rated";
    const address = place.vicinity;
    const icon = {
      url: "car.png", // Path to car icon
      scaledSize: new google.maps.Size(32, 32) // Size of the icon
    };

    const marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      title: name,
      icon: icon
    });

    const li = document.createElement("li");
    li.classList.add("restaurantItem");
    li.innerHTML = `<strong>${name}</strong> - Rating: ${rating}<br>${address}`;
    restaurantsList.appendChild(li);
  });
}

function clearMarkers() {
  // Implement this if needed in future
  // For now, we are using PlacesService which handles markers internally
}