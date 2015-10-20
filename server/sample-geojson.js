{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [
      -77.0366048812866,
      38.89784666877921
    ]
  },
  "properties": {
    "name":"The White House",
    "address":"1600 Pennsylvania Ave.",
    "tips": "Take a nice walk and enjoy the sights!",
    "typeTags": ["US Government", "monument"]
  }
},

{   "lon":-77.0366048812866,
    "lat":38.89784666877921,
    "name":"The White House",
    "address":"1600 Pennsylvania Ave.",
    "tips": "Take a nice walk and enjoy the sights!",
    "tags": ["US Government", "monument"]}

Indigo
243 K St NE
38.90240556584194,-77.0022652298212
Delicious carry-out Indian place. Eat in their open-air courtyard in the summer! 

[ { coordinates: [ -77.0366048812866, 38.89784666877921 ],
    tags: [ 'US Government', 'monument' ],
    __v: 0,
    tips: 'Take a nice walk and enjoy the sights!',
    address: '1600 Pennsylvania Ave.',
    name: 'The White House',
    _id: 5626718707c384500864717a },
  { coordinates: [ -77.02798023819923, 38.931104863484244 ],
    tags: ["restaurant"],
    __v: 0,
    tips: 'Happy hour all night on Mondays! Great tacos and margaritas.',
    address: '3313 11th St NW',
    name: 'El Chucho',
    _id: 562687c8fa5f81e50ca1cfc5 },
  { coordinates: [ -77.03441351652145, 38.93077102332432 ],
    tags: ["restaurant"],
    __v: 0,
    tips: 'Delicious Pho. They also have another location in Adams Morgan. ',
    address: '1436 Park Rd NW',
    name: 'Pho 14',
    _id: 562690f3b2e69c380e4e9c20 },
  { coordinates: [ -77.0124576240778, 38.91260775100532 ],
    tags: ["restaurant"],
    __v: 0,
    tips: 'Lovely spot to enjoy locally sourced breakfast and delicious coffee on a sunny Sunday',
    address: '1700 1st St NW',
    name: 'Big Bear Cafe',
    _id: 56269534b1522bd70e61bd66 } ]

db.places.update({"name": "Pho 14"}, {$push: {"tags":"restaurant"}})