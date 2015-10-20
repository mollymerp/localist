var Q = require('q'),
schema = require('./places/placeModel');

// import nested schema
Place = schema.Place;
// Geom = schema.Geom;
// Properties =schema.Prop; 

// create function to add a new place to the db
exports.savePlace = function(req, res, next) {
  console.log('request recieved');
  console.log('req.body', req.body.typeTags);
  var createPlace = Q.bind(Place.save, Place);
  var findPlace = Q.nbind(Place.findOne, Place);
  //this deletes all current records -- comment out when you want to persist!
  Place.find({}).remove().exec();
  

  Place.find({name: req.body.name})
    .exec(function(err,match){
      if (err) {
        console.log('Error reading URL heading: ', err);
        return res.send(404);
      }

      if (match.length){
        console.log('found match');
        res.send(match[0])
      } else {
        var newPlace = new Place({
                  name: req.body.name,
                  address: req.body.address,
                  phone: req.body.phone,
                  tips: req.body.tips,
                  tags:[],
                  coordinates: [Number(req.body.lon),Number(req.body.lat)]
                });

        req.body.typeTags.forEach(function (tag){
          newPlace.tags.push(tag);
        });

        newPlace.save(function (err) {
          if (err){
            console.log("error on save place");
          }
          else {
            console.log("document saved!");
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