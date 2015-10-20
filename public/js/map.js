
var app;
$(function() {
  L.mapbox.accessToken = 'pk.eyJ1IjoibWxsb3lkIiwiYSI6Im9nMDN3aW8ifQ.mwiVAv4E-1OeaoR25QZAvw';
  var map = L.mapbox.map('dc-map','mlloyd.noehc1pf', {
    scrollWheelZoom: false,
    minZoom: 12
  }).setView([38.898, -77.046], 12);


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

// add coordinates to form
  map.on('click', function (e){
    var latlngArr =[e.latlng["lat"], e.latlng["lng"]];
    $('form').find('input[name = "coords"]').val(latlngArr);
  });

  $('form').submit(function (e){
    e.preventDefault();
    // $('input').forEach(function (e){
    //   console.log('event, value: ', e, e.val());
    // })
    console.log($('input'))
  });


}());