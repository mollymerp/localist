
var app;
$(function() {
  L.mapbox.accessToken = 'pk.eyJ1IjoibWxsb3lkIiwiYSI6Im9nMDN3aW8ifQ.mwiVAv4E-1OeaoR25QZAvw';
  var map = L.mapbox.map('dc-map','mlloyd.noehc1pf', {
    scrollWheelZoom: false,
    minZoom: 12
  }).setView([38.898, -77.046], 10);

  // add coordinates to form
  var tempMarker;
  map.on('click', function (e){
    if (tempMarker !==undefined) {
      map.removeLayer(tempMarker);
    }

    var latlngArr =[e.latlng["lat"].toFixed(4), e.latlng["lng"].toFixed(4)];
    $('form').find('input[name = "coords"]').val(latlngArr);

    tempMarker = L.mapbox.featureLayer({"type": "Feature",
      "geometry": {
      "type": "Point",
      "coordinates": [latlngArr[1], latlngArr[0]],
      "marker-color":"#5644FF"
       }}).addTo(map);
  });

  if (tempMarker !== undefined) {
    tempMarker.on('click', function (e) {
      map.removeLayer(tempMarker);
    });
  }

  function formatTooltip (layer) {
    var props = layer.feature.properties;
    var content = '<p class = "tt-title">' + props.name +' <\/p><br\/>' +
                  '<p class = "tt-address">' + props.address + '<\/p><br\/>'+
                  '<p class ="tt-tips"> Tips: <br \/>'+ props.tips +'<\/p>';
    layer.bindPopup(content);
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
        var markerSym = place.tags[0] === 'restaurant' ? 'restaurant' : 'monument'
        newFeature.geometry.coordinates = place.coordinates;
        newFeature.properties = {name: place.name, address: place.address, tips: place.tips, tags: place.tags, 'marker-color': "#519CFF", "marker-symbol": markerSym};
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

    var tags = [];
    $('input[type = checkbox]').each(function (index, el){
      
      // console.log('checked, value', $(el).prop('checked'), $(el).prop('value'))
      if ($(el).prop('checked')){
        tags.push($(el).prop('value').toLowerCase());
        // $(el).prop('checked') = false;
      }
    })
    console.log('tags', tags);
    newPlace["tags"] = tags;

    // $('form').find('input[type = "text"], textarea').val("");
    $('form')[0].reset();

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