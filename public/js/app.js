
L.mapbox.accessToken = 'pk.eyJ1IjoibWxsb3lkIiwiYSI6Im9nMDN3aW8ifQ.mwiVAv4E-1OeaoR25QZAvw';
var map = L.mapbox.map('dc-map','mlloyd.noehc1pf', {
  scrollWheelZoom: false,
  minZoom: 12
}).setView([38.898, -77.046], 12);

map.on('click', function(e) {
    console.log(e.latlng);
});


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
    Places.getPlaces().then(function (res){
      $scope.data.places = res;
      console.log(res);
    })
    .catch(function (err) {
      console.error(err);
    })
  }

  $scope.getPlaces();

  $scope.data.forEach(function (place){
    var newFeature = {"type":"Feature",
                      "geometry": {"type":"Point", "coordinates":[]},
                      "properties": {}
                    };
    newFeature.geometry.coordinates.push()
  })

  // var markers = L.mapbox.featureLayer().addTo(map);
  // markers.setGeoJSON($scope.data); 


})