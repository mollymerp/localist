var request = require('request'),
Q = require('q'),
schema = require('places/placeModel');

// import nested schema
Place = schema.Place;
Geom = schema.Geom;
Properties =schema.Prop; 

// create function to add a new place to the db
exports.savePlace = function(req, res, next) {
  var createPlace = Q.bind(Place.create, Place);
  var findPlace = Q.nbind(Place.findOne, Place);

  findPlace({name: req.body.name})
    .then(function(match){
      if (match){
        res.send(match)
      } else {
        var newPlace = new Place();
        if (req.body.lat && req.body.lon){
          newPlace.geometry.push({coordinates: [req.body.lat,req.body.lon]);
        }
        newPlace.properties.push{
          name: req.body.name,
          address: req.body.address,
          phone: req.body.phone,
          tips: req.body.tips,
          typeTags = req.body.tags
        };
        return createPlace(newPlace);
      }
    })
    .then(function (createdPlace){
      if (createdPlace){
        res.json(createdPlace);
      }
    })
    .fail(function (error){
      next(error);
    });
}

exports.fetchPlaces = function (req, res, next){
  Place.remove({}).find().exec(function(err,places){
    if (err) {
      console.error(err);
    } else {
      res.send(200,places);
    }
  });
};