
var app;
$(function() {
  L.mapbox.accessToken = 'pk.eyJ1IjoibWxsb3lkIiwiYSI6Im9nMDN3aW8ifQ.mwiVAv4E-1OeaoR25QZAvw';
  var map = L.mapbox.map('dc-map','mlloyd.noehc1pf', {
    scrollWheelZoom: false,
    minZoom: 12
  }).setView([38.898, -77.046], 10);

  // add coordinates to form
    map.on('click', function (e){
      var latlngArr =[e.latlng["lat"], e.latlng["lng"]];
      $('form').find('input[name = "coords"]').val(latlngArr);
    });

  function formatTooltip (layer) {
    var props = layer.feature.properties;
    var content = '<p class = "tt-title">' + props.name +' <\/p><br\/>' +
                  '<p class = "tt-address">' + props.address + '<\/p><br\/>'+
                  '<p class ="tt-tips"> Tips: <br \/>'+ props.tips +'<\/p>';
    layer.bindPopup(content);
  }

  function clearPlaces () {
    map.removeLayer(markers);
  }
  var places = {};
  function getPlaces (){
    
    var geoJSON = {type: "FeatureCollection", "features": []};

    $.ajax({
      url: '/places',
      method:'GET'
    }).done(function(res) {
      toAdd =[]
      for (var place in res) {
        if (!(res[place]._id in places)){
          toAdd.push(res[place])
          places[res[place]._id] = res[place];
        }
      }

      toAdd.forEach(function (place){
        var newFeature = {"type":"Feature",
                          "geometry": {"type":"Point", "coordinates": [] }
                        };
        newFeature.geometry.coordinates = place.coordinates;
        newFeature.properties = {name: place.name, address: place.address, tips: place.tips, tags: place.tags, 'marker-color': "#519CFF"};
        geoJSON.features.push(newFeature);
      })
      var markers = L.mapbox.featureLayer().addTo(map);
      markers.setGeoJSON(geoJSON); 
      markers.eachLayer(formatTooltip);

    });
  }
  //initialize the places already on the map
  getPlaces();
  setInterval(getPlaces, 3000);


  function processForm() {
    var newPlace = {};

    $('input.pure-input-2-3').each(function (index, el){
      var name = $(el).prop('name');
      var val = $(el).prop('value');
      if (name==='coords') {
        var split= val.split(',')
        newPlace["lat"] = Number(split[0]);
        newPlace["lon"] = Number(split[1]);
      } else {
        newPlace[name] = val;
      }
    });

    newPlace["tips"] = $('textarea').prop('value');

    $('input[type = checkbox]').each(function (index, el){
      var tags = [];
      if ($(el).prop('checked')){
        tags.push($(el).prop('value'));
      }
      newPlace["tags"] = tags;
    })
    return newPlace;
  };


  $('form').submit(function (e){
    e.preventDefault();
    var newPlace = processForm();
    $.ajax({
      url: '/places',
      type: 'POST',
      data: JSON.stringify(newPlace),
      contentType: 'application/json'
    }).done(function (res){
      getPlaces();
    })
    
  });


}());