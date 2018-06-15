var express =require('express');
var app = express();

var phpExpress = require('php-express')({
  binPath: 'php'
});
app.set('views', './views');
app.engine('php', phpExpress.engine);
app.set('view engine', 'php');
app.all(/.+\.php$/, phpExpress.router);

function hey(){
  console.log("It works, I think...")
}

var server = app.listen(8000, hey);
app.use(express.static(__dirname + '/dev'));