var mongoose = require('mongoose');



// var GeoSchema = new mongoose.Schema({
//   type: {type: String, default: "Point"},
//   coordinates: [{type: Number}]
// });

// var PropSchema = new mongoose.Schema({
//   name: {type: String, required: true},
//   address: String,
//   phone: String,
//   tips: String,
//   typeTags: [{type: String}]
// })

var PlaceSchema = new mongoose.Schema({
  coordinates: [{type: Number}],
  name: {type: String, required: true},
  address: String,
  phone: String,
  tips: String,
  tags: [{type:String}]
})


module.exports = {
  Place: mongoose.model('places', PlaceSchema)
  // Geom: mongoose.model('geoms', GeoSchema),
  // Prop: mongoose.model('props', PropSchema)
}

