var mongoose = require('mongoose');



var Geo = new mongoose.Schema({
  type: {type: String, default: "Point"},
  coordinates: [{type: Number}]
});

var Props = new mongoose.Schema({
  name: {type: String, required: true},
  address: String,
  phone: String,
  tips: String,
  typeTags: [{type: String}]
})

var PlaceSchema = new mongoose.Schema({
  type: { type: String, default: "Feature" },
  geometry: [Geo],
  properties: [Props]
})


module.exports = mongoose.model('places', PlaceSchema);

