
var app;
$(function() {
  L.mapbox.accessToken = 'pk.eyJ1IjoibWxsb3lkIiwiYSI6Im9nMDN3aW8ifQ.mwiVAv4E-1OeaoR25QZAvw';
  var map = L.mapbox.map('dc-map','mlloyd.noehc1pf', {
    scrollWheelZoom: false,
    minZoom: 12
  }).setView([38.898, -77.046], 12);

  map.on('click', function(e) {
      console.log(e.latlng);
  });

  var places = {};
  var geoJSON = {type: "FeatureCollection", "features": []};

  $.ajax({
    url: '/places',
    method:'GET'
  }).done(function(res) {
    for (var place in res) {
      if (!(res[place]._id in places)){
        places[res[place]._id] = res[place];
      }
    }

    res.forEach(function (place){
      var newFeature = {"type":"Feature",
                        "geometry": {"type":"Point", "coordinates": [] }
                      };
      newFeature.geometry.coordinates = place.coordinates;
      newFeature.properties = {name: place.name, address: place.address, tips: place.tips, tags: place.tags};
      geoJSON.features.push(newFeature);
    })
    console.log('geoJson', geoJSON);

    var markers = L.mapbox.featureLayer().addTo(map);
    markers.setGeoJSON(geoJSON); 
  });

  function getClickCoords() {
    
  }

}());