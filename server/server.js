var express     = require('express'),
    mongoose    = require('mongoose'),
    bodyParser  = require('body-parser');

var handler = require('requestHandler');

// initialize express server and implement body parser
var app = express();
pp.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//connect to mongo server and test connection
mongoose.connect('mongodb://localhost/localist');
var db = mongoose.connection; // set up the connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('db open!');                                            
})

// set up static server
app.use(express.static(__dirname + '/../public'));

app.post('/places', handler.savePlace);
app.get('/places', handler.fetchPlaces);