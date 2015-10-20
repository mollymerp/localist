
// L.mapbox.accessToken = 'pk.eyJ1IjoibWxsb3lkIiwiYSI6Im9nMDN3aW8ifQ.mwiVAv4E-1OeaoR25QZAvw';
// var map = L.mapbox.map('dc-map','mlloyd.noehc1pf', {
//   scrollWheelZoom: false,
//   minZoom: 12
// }).setView([38.898, -77.046], 12);

// map.on('click', function(e) {
//     console.log(e.latlng);
// });

var geodata;

angular.module('localist',[])
.factory('Places', function ($http){

  var getPlaces = function (){
    return $http({
      method: 'GET',
      url: '/places'
    })
    .then(function (resp){
      return resp.data;
    });
  };

  var addPlace = function (place){
    return $http({
      method: 'POST',
      url: '/places'
    })
    .then(function (resp){
      return resp.data;
    });
  };

  return {
    getPlaces: getPlaces,
    addPlace: addPlace
  };
})

.controller('localistController', function ($scope, $location, Places){
  $scope.data = {};
  $scope.data.geoJSON = {type: "FeatureCollection", "features": []};
  $scope.getPlaces = function (){

    L.mapbox.accessToken = 'pk.eyJ1IjoibWxsb3lkIiwiYSI6Im9nMDN3aW8ifQ.mwiVAv4E-1OeaoR25QZAvw';
    var map = L.mapbox.map('dc-map','mlloyd.noehc1pf', {
      scrollWheelZoom: false,
      minZoom: 12
    }).setView([38.898, -77.046], 12);


    Places.getPlaces().then(function (res){
      $scope.data.places = res;
      console.log(res);
      $scope.data.places.forEach(function (place){
        var newFeature = {"type":"Feature",
                          "geometry": {"type":"Point", "coordinates":[]}
                        };
        newFeature.geometry.coordinates.push(place.coordinates);
        newFeature.geometry.properties = {name: place.name, address: place.address, tips: place.tips, tags: place.tags};
        $scope.data.geoJSON.features.push(newFeature);
      })

     geodata =  $scope.data.geoJSON;
    })
    .catch(function (err) {
      console.error(err);
    });

    // var markers = L.mapbox.featureLayer().addTo(map);
    // markers.setGeoJSON($scope.data.geoJSON); 
    // console.log(markers);

    var markerLayer = L.mapbox.featureLayer($scope.data.geoJSON).addTo(map);
  }

  $scope.getPlaces();

  



});

  // var markerLayer = L.mapbox.featureLayer($scope.data.geoJSON, {
  //   pointToLayer: function (feature, latlon) {
  //     return L.circleMarker(latlon, {
  //           fillColor: '#ff0000',
  //           fillOpacity: 0.8,
  //           stroke: false
  //         });
  //   }
  // }).addTo(map);
