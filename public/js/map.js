var app;
$(function() {
  L.mapbox.accessToken = 'pk.eyJ1IjoibWxsb3lkIiwiYSI6Im9nMDN3aW8ifQ.mwiVAv4E-1OeaoR25QZAvw';
  var geocoder = L.mapbox.geocoder('mapbox.places');

  $('#placename').autocomplete({
    minLength: 3,
    dataType: 'json',
    source: function (req, res) {
      var search = $('#placename').val();
      var query = search.replace(/\s/g, '+');
      $.ajax({
        url: 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + query + '.json?access_token=' + L.mapbox.accessToken,
        method: 'GET',
        contentType: 'application/json',
        success: function (data) {
          res($.map(data.features, function (place){
            // console.log(place);
            return {
              label: place.place_name,
              value: place.text,
              coords: place.center,
              address: place.properties.address
            }
          }))
        },
        error: function (error) {
          console.error(error);
        }
      })
    },
    select: function (event, ui) {
      console.log(ui);
      $('input[name="address"]').val(ui.item.address);
      $('input[name="coords"]').val([ui.item.coords[1],ui.item.coords[0]]);
    }
  })
//   .autocomplete( "instance" )._renderItem = function( ul, item ) {
//     // Inside of _renderItem you can use any property that exists on each item that we built
//     // with $.map above */
//     return $("<li>")
//         .append("<a>" + item.name + "</a>")
//         .appendTo(ul);
// };

  var map = L.mapbox.map('dc-map', 'mapbox.emerald', {
    scrollWheelZoom: false,
    minZoom: 12
  }).setView([38.903, -77.038], 12);

  // add coordinates to form
  var tempMarker;
  map.on('click', function(e) {
    if (tempMarker !== undefined) {
      map.removeLayer(tempMarker);
    }

    var latlngArr = [e.latlng["lat"].toFixed(4), e.latlng["lng"].toFixed(4)];
    $('form').find('input[name = "coords"]').val(latlngArr);

    tempMarker = L.mapbox.featureLayer({
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [latlngArr[1], latlngArr[0]],
        "marker-color": "#5644FF"
      }
    }).addTo(map);

  });


  function formatTooltip(layer) {
    var props = layer.feature.properties;
    var content = '<p class = "tt-title">' + props.name + ' <\/p><br\/>' +
      '<p class = "tt-address">' + props.address + '<\/p><br\/>' +
      '<p class ="tt-tips">' + props.tips + '<\/p>';
    layer.bindPopup(content);
  }

  var places = {};

  function getPlaces() {
    var geoJSON = {
      type: "FeatureCollection",
      "features": []
    };

    $.ajax({
      url: '/places',
      method: 'GET'
    }).done(function(res) {
      var toAdd = [];
      for (var place in res) {
        if (!(res[place]._id in places)) {
          toAdd.push(res[place])
          places[res[place]._id] = res[place];
        }
      }

      toAdd.forEach(function(place) {
        var newFeature = {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": []
          }
        };
        var markerSym = place.tags[0] === 'US Government' ? 'monument' : place.tags[0];
        newFeature.geometry.coordinates = place.coordinates;
        newFeature.properties = {
          name: place.name,
          address: place.address,
          tips: place.tips,
          tags: place.tags,
          'marker-color': "#519CFF",
          "marker-symbol": markerSym
        };
        geoJSON.features.push(newFeature);
      })
      var markers = L.mapbox.featureLayer().addTo(map);
      markers.setGeoJSON(geoJSON);
      markers.eachLayer(formatTooltip);

      //populate list at the side
      var $listings = $('.listings');

      markers.eachLayer(function(locale) {
        var prop = locale.feature.properties;

        var $el = $('<div class="item" />'),
          $link = $('<a href="#" class="title" />'),
          $tips = $('<div class="list-tips"/>'),
          $p = $('<p class="list-p" />');

        $listings.append($el);
        $el.append($link)
        $link.html(prop.name);

        var tips = $el.append($tips);
        tips.append($p);
        $p.html(prop.tips);

        $link.on('click', function() {
          map.setView(locale.getLatLng(), 15);
          locale.openPopup();
        })
      })
    });
  }
  //initialize the places already on the map
  getPlaces();
  // setInterval(getPlaces, 500);


  function processForm() {
    var newPlace = {};

    $('input.pure-input-1').each(function(index, el) {
      var name = $(el).prop('name');
      var val = $(el).prop('value');
      if (name === 'coords') {
        var split = val.split(',')
        newPlace["lat"] = Number(split[0]);
        newPlace["lon"] = Number(split[1]);
      } else {
        newPlace[name] = val;
      }
    });

    newPlace["tips"] = $('textarea').prop('value');

    var tags = [];
    $('input[type = checkbox]').each(function(index, el) {
      // console.log('checked, value', $(el).prop('checked'), $(el).prop('value'))
      if ($(el).prop('checked')) {
        tags.push($(el).prop('value').toLowerCase());
      }
    })
    newPlace["tags"] = tags;

    $('form')[0].reset();
    return newPlace;
  };

  $('form').submit(function(e) {
    e.preventDefault();
    var newPlace = processForm();
    $.ajax({
      url: '/places',
      type: 'POST',
      data: JSON.stringify(newPlace),
      contentType: 'application/json'
    }).done(function(res) {
      console.log('data sent to server');
      getPlaces();
    })
  });
}());
