var map = L.map("map").setView([38.0336, -84.5149], 14); // Set the initial map center and zoom level

// Add the Mapbox Streets tile layer
L.tileLayer(
  "https://api.mapbox.com/styles/v1/mdcruse/cljncp1g700lv01pd8f7g00fj/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWRjcnVzZSIsImEiOiJjanZvN25kaHQxdzAxNDhwZjM4NDNvMXV4In0.s4GSawMNB7Jo4Vf7LXKEew",
  {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
    tileSize: 512,
    zoomOffset: -1,
  }
).addTo(map);

// create custom icon
var barIcon = L.icon({
  iconUrl: "bar.png",
  iconSize: [38, 38], // size of the icon
  opacity: 0.2,
});

// Load the GeoJSON data and add clustered markers to the map
fetch("brewgrass_breweries.geojson")
  .then((response) => response.json())
  .then((data) => {
    var markers = L.markerClusterGroup();
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        var marker = L.marker(latlng, {
          icon: barIcon,
        });
        marker.bindPopup(
          `<strong><a href="${feature.properties.website}" target="_blank"><span style="font-size: 18px">${feature.properties.name}</span></a></strong><br>
                    ${feature.properties.address}<!--<br>${feature.properties.description}-->`
        );
        marker.on("click", function (e) {
          map.setView(latlng, 14); // Zoom the map to level 14
        });
        marker.on("mouseover", function (e) {
          document.getElementById("ui").classList.add("highlight-ui");
          var description = feature.properties.description + " ";
          var website = feature.properties.website;
          var websiteLink =
            '<a href="' + website + '" target="_blank">Brewery website.</a>';
          var name = "<strong>" + feature.properties.name + "</strong><br><br>";
          var content =
            '<div class="desc-content">' +
            name +
            description +
            websiteLink +
            "</div>";
          document.getElementById("marker-hover-text").innerHTML = content;
          this.openPopup();
        });
        marker.on("mouseout", function (e) {
          this.closePopup();
        });
        map.on("click", function (e) {
          var hasMarker = false;

          // Check if there is a marker at the clicked location
          for (var i = 0; i < markers.length; i++) {
            if (markers[i].getLatLng().equals(e.latlng)) {
              hasMarker = true;
              break;
            }
          }
          if (!hasMarker) {
            // Perform the actions if there is no marker at the clicked location
            // If no marker is found, remove the class, reset the width, and clear the content.
            document.getElementById("ui").classList.remove("highlight-ui");
            document.getElementById("ui").style.width = ""; // Reset the width
            document.getElementById("main").style.width = ""; // Reset the width
            document.getElementById("marker-hover-text").innerHTML = ""; // Clear the content
          }
        });
        return marker;
      },
    }).addTo(markers);
    map.addLayer(markers);

    // Center the map at the markers and fit the bounds at the current zoom level
    var bounds = markers.getBounds();
    map.fitBounds(bounds);
  });

var toggleButton = document.getElementById("toggleButton");
var sectionToToggle = document.getElementById("sectionToToggle");

toggleButton.addEventListener("click", function () {
  if (
    sectionToToggle.style.display === "none" ||
    sectionToToggle.style.display === ""
  ) {
    sectionToToggle.style.display = "block";
    toggleButton.textContent = "Close Directions";
  } else {
    sectionToToggle.style.display = "none";
    toggleButton.textContent = "Open Directions";
  }
});
