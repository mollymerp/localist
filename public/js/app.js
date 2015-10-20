angular.module('localist-factory',[])

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