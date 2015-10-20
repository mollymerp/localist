
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



  function getPlaces (){
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
  }
  getPlaces();



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
      console.log('new place added to database, all places fetched from server');
      console.log('response', res);
      getPlaces();
    })
    
  });


}());