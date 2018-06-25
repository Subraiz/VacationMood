
var express = require('express');
var nunjucks = require('nunjucks')
var path = require('path');
var app = express();
var api = require('./api');

nunjucks.configure(path.join(__dirname, '../views'), {
  autoescape: true,
  express: app
});

app.set('port', 3000);

app.use(express.static(path.join(__dirname, '../public')));
app.use("/contracts", express.static(path.join(__dirname, '../../build/contracts')));


/*
 * This is where we parse the host header to determine which "mini-site" to direct the 
 * browser to.  For example, if the browser goes to spin.alicetoken.com we will 
 * render ./web/views/spin.html.  To add attional mini-sites, place the HTML
 * for the site in ./web/views/ and the static content in a subdirectory of 
 * ./web/public, and then add a condition here to check for the host header.
 */
app.get('/', function (req, res) {
	if(req.header('host').startsWith("spin")) {
		res.render('spin.html')
	}
	else {
		res.render('alicetoken.html')
	}
});


app.get('/feed', function (req, res) {
  res.render('userfeed.html')
});

app.get('/feed/:eth_address', function (req, res) {
  res.render('userfeed.html', {
    usrAddr: req.params.eth_address
  })
})




app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, HEAD, DELETE, PUT, TRACE");
	next();
});

app.get('/tokens/:tokenID', function(req, res) {
  var tokenID = req.params.tokenID;

  // Until we implement metadata for other token IDs
  var getresult = {
    "name":"Alice in Wonderland",
    "image":"https://s3.amazonaws.com/alice-tokens/bluekeytoken.png",
    "description":"Free collectible and e-book.",
    "attributes":{"generation":"0"},
    "external_url":"https://www.alicetoken.com/tokens/1",
    "background_color":"2e466d"
  }

  res.render('tokeninfo.html', {tokenInfo: getresult, tID: tokenID})

})

var server = app.listen(app.get('port'), function () {
  console.log('The server is running on http://localhost:' + app.get('port'));
});

app.use('/api', api);
