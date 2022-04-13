// Define the getColor function
function getColor(d){
    return d > 90 ? "#f00b07":
          d > 70 ? "#e85c05":
          d > 50 ? "#dbac4f":
          d > 30 ? "#ed9f05":
          d > 10 ? "#aae605":
                  "#21bf2b";
  }
  
  // Create the createMap function
  function createMap(earthquakes) {
  
    // Create the tile layer
  var lightmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  
    // Create a baseMaps object for the tile layer
  var baseMaps = {
    "Street": lightmap
  };
    // Create an overlayMaps
  var overlayMaps = {
    "Earthquakes": earthquakes
  };
  
    // Create the map object with the correct coordinates and layers
  var myMap = L.map("map", {
    center: [34.11, -107.299],
    zoom: 6,
    layers: [lightmap, earthquakes]
  });

    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
  
    //Create the legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
    depths = [0, 10, 30, 50, 70, 90],
    labels = [];
    // create the loop
    for (var i = 0; i < depths.length; i++) {
      div.innerHTML +=
      '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
      depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
  };
  
  // Create the createMarkers function
  function createMarkers(response) {
    d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data){
      console.log(data)
    });
  
    // collect all the earthquakes from the response
    var earthquakes = response.features;
  
    // array for earthqauke markers
    var EQMarkers = [];
  
    // Loop through the earthquakes array
    for (var i = 0; i < earthquakes.length; i++) {
      // collect the magnitude and depth details
      var magnitude = earthquakes[i].properties.mag;
      var depth = earthquakes[i].geometry.coordinates[2];
      var location = earthquakes[i].properties.place
      console.log(depth);
        
        // Create a popup with details for each eartquake and a marker
        var EQMarker = L.circle([earthquakes[i].geometry.coordinates[1], earthquakes[i].geometry.coordinates[0]], {
        color: 'black',
        fillColor: getColor(depth),
        fillOpacity: 0.75,
        radius: magnitude * 10000 
      }).bindPopup("<h1> Location: </h1> <h2>" + location + "</h2> <hr> <h2> Magnitude: </h2> <h3>" +
      magnitude + "</h3> <br> <h2> Depth: </h2> <h3>" + depth + "</h3>")
      // Add to the array.
      EQMarkers.push(EQMarker)
  }
    createMap(L.layerGroup(EQMarkers));
  };
  
  // API call for the earthquake information and then adding the markers
  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
  d3.json(url).then(createMarkers)