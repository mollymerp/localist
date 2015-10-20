var Q = require('q'),
schema = require('./places/placeModel');

// import nested schema
Place = schema.Place;
Geom = schema.Geom;
Properties =schema.Prop; 

// create function to add a new place to the db
exports.savePlace = function(req, res, next) {
  console.log('request recieved');
  console.log('req.body', req.body);
  var createPlace = Q.bind(Place.save, Place);
  var findPlace = Q.nbind(Place.findOne, Place);
  console.log('req.body.name', req.body.name);
  // findPlace({"properties.name": req.body.name})
  Place.find({"properties.name": req.body.name})

    .exec(function(err,match){
      if (err) {
        console.log('Error reading URL heading: ', err);
        return res.send(404);
      }

      if (match.length){
        console.log('found match');
        res.send(match[0])
      } else {
        var newPlace = new Place();
        if (req.body.lat && req.body.lon){
          newPlace.geometry.push({coordinates: [req.body.lat,req.body.lon]});
        }
        // newPlace.geometry.push({coordinates: req.body.coordinates});
        newPlace.properties.push({
                  name: req.body.name,
                  address: req.body.address,
                  phone: req.body.phone,
                  tips: req.body.tips,
                  typeTags: req.body.tags
                });
        newPlace.save(function (err) {
          if (err){
            console.log("error on save place");
          }
        });
        res.json(newPlace);
      }
    });
}

var fetchAllPlaces = Q.bind(Place.find, Place);

exports.fetchPlaces = function (req, res, next){
  console.log('in database');
  Place.find({}).exec(function(err, places){
    if (err){
      console.error(err);
      res.send(404);
    }
    console.log('places in db', places)
    res.send(places);
  });
};