var express = require('express');
var app = express();

var session = require('express-session');
app.use(session({
  secret: "shhh",
  cookie: { httpOnly: false, secure: false },
  resave: true,
  saveUninitialized: true
}));

var path = require('path');
var api = require('./api');
app.use('/api', api);

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1"
});

var db = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();


app.set('port', 3000);

var nunjucks = require('nunjucks');
nunjucks.configure(path.join(__dirname, '../views'), {
  autoescape: true,
  express: app
});

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

var sess;
app.get('/feed', function (req, res) {
  sess = req.session;

  if (sess.logged_in) {
    if (!sess.uuid) {
      // No session ID yet
      sess.uuid = generateSessionID();
    }

    getSavedList(sess.uuid).then(data => {
      if (typeof(data) == 'undefined') {
        addSavedList(sess.uuid, sess.logged_in);
      }
    }).catch(err => {
      console.error(err);
    });

    res.redirect('/feed/u/' + sess.uuid);

  } else {
    res.render('userfeed.html');
  }

});

app.get('/feed/u/:uuid', function(req, res) {
  sess = req.session;

  if (sess.uuid != req.params.uuid) {
    req.session.uuid = req.params.uuid;
  }
  var id = req.params.uuid;

  res.render('userfeed.html')
});

app.get('/feed/address/:eth_address', function(req, res) {
  sess = req.session;

  if (sess.logged_in) {
    res.redirect('/feed/address/' + req.params.eth_address + '/u/' + sess.uuid);
  } else {
    res.render('userfeed.html', {
      usrAddr: req.params.eth_address
    })
  }
});

app.get('/feed/address/:eth_address/u/:uuid', function(req, res) {
  sess = req.session;

  if (sess.uuid != req.params.uuid) {
    getSavedList(req.params.uuid).then(list => {
      console.log("view other user", list);

      res.render('userfeed.html', {
        usrAddr: req.params.eth_address,
        usrBook: list.bookmarks
      });
    })
  } else {
    res.render('userfeed.html', {
      usrAddr: req.params.eth_address
    });
  }
});

app.get('/search', function(req, res) {
  sess = req.session;

  if (req.query.walletId) {
    res.redirect('/feed/address/' + req.query.walletId);
  } else {
    res.redirect('/feed/');
  }
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
  console.log(req.query.call)
  console.log(getresult.name)
  res.render('tokeninfo.html', {tokenInfo: getresult, tID: tokenID})

});

// app.get('/getSavedList/:user_id', function(req, res) {
//   sess = req.session;
//
//   var id = req.params.user_id;
//   if (id) {
//
//     var params = {
//       TableName: "savedLists",
//       Key: {
//         uuid: id
//       }
//     };
//
//     docClient.get(params, function(err, data) {
//       if (err) {
//         console.error("Unable to get item. Error JSON:", JSON.stringify(err, null, 2));
//         res.send("<h1>Error</h1>" + JSON.stringify(err, null, 2));
//       } else {
//         console.log("getSavedList retrieved item:", data);
//         res.send("<h1>Success</h1>" + JSON.stringify(data.Item, null, 2));
//       }
//     });
//
//   } else {
//     res.send("No id supplied");
//   }
// })
//
// app.get('/addSavedList/:user_id/:eth_address', function(req, res) {
//   var id = req.params.user_id;
//   var address = req.params.eth_address;
//   var inputList = [address];
//
//   var params = {
//     TableName: "savedLists",
//     Item:{
//       "uuid" : id,
//       "bookmarks" : inputList
//     }
//   };
//
//   docClient.put(params, function(err, data) {
//     if (err) {
//       console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
//       res.send("<h1>Error</h1>" + JSON.stringify(err, null, 2));
//     } else {
//       console.log("addSavedList added item:", data);
//       res.send("<h1>Success</h1>" + JSON.stringify(data, null, 2));
//     }
//   });
//
// })

app.get('/getBookmarks', function(req, res) {
  sess = req.session;

  console.log("GET BOOKMARKS:", sess, sess.logged_in, sess.uuid);
  if (sess.logged_in && sess.uuid) {
    getSavedList(sess.uuid).then(list => {
      res.send(list);
    }).catch(err => {
      res.send({"getBookmark error": err});
    })
  } else {
    res.send({"getBookmark error": "Not logged in or no session UUID"});
  }
});

app.post('/addBookmark', function(req, res) {
  sess = req.session;

  if (sess.logged_in && sess.uuid) {
    addSavedList(sess.uuid, req.body.eth_save).then(res => {
      console.log("addBookmark saved", req.body.eth_save);
    }).catch(err => {
      res.send({"addBookmark error" : err});
    });
  } else {
    res.send({"addBookmark error": "Not logged in or no session UUID"});
  }
})

app.get('/destroy',function(req,res){

  req.session.destroy(function(err) {
    if(err) {
      console.error(err);
    } else {
      res.redirect('/feed');
    }
  })
});

app.post("/login", function(req, res) {
  sess = req.session;

  console.log("login start");
  if (!sess.logged_in) {
    if (req.body.eth_account) {
      console.log("login req body: ", req.body.eth_account)
      sess.logged_in = req.body.eth_account;
      res.send({redirect: '/feed/', logged_in: sess.logged_in, uuid: sess.uuid});
    } else {
      res.send({error: "No eth account attached"});
    }
  } else {
    res.send({message: "Already logged in."});
  }
});

/* ================== START SERVER ==================================== */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, HEAD, DELETE, PUT, TRACE");
  next();
});

var server = app.listen(app.get('port'), function () {
  console.log('The server is running on http://localhost:' + app.get('port'));
});

/* ================= Functions =========================================== */
function generateSessionID() {
  var time = new Date().getTime().toString();

  var hash = require('crypto').createHash('sha256').update(time).digest('hex');

  return hash.slice(0, 8);
}

function getSavedList(userID) {
  return new Promise(function(resolve, reject) {
    var table = "savedLists";
    var params = {
      TableName: "savedLists",
      Key: {
        uuid: userID
      }
    };

    docClient.get(params, function(err, data) {
      if (err) {
        console.error("Unable to get item. Error JSON:", JSON.stringify(err, null, 2));
        reject(err);
      } else {
        console.log("getSavedList retrieved item:", data);
        resolve(data.Item);
      }
    });
  })
}

function addSavedList(userID, address) {
  return new Promise(function(resolve, reject){
    getSavedList(userID).then(item => {
      var existingList = [];
      var newAddressExists = false;

      if(typeof(item) != 'undefined') {
        console.log("This is item: ", item.bookmarks)
        for (var i = 0; i < item.bookmarks.length; i++) {
          if (item.bookmarks[i] == address.toLowerCase()) {
            newAddressExists = true;
          }
        }
        existingList = item.bookmarks;
      }

      if (!newAddressExists) {
        existingList.push(address.toLowerCase());
      }

      return existingList;
    }).then(inputList => {
      var params = {
        TableName: "savedLists",
        Item:{
          "uuid" : userID,
          "bookmarks" : inputList
        }
      };

      docClient.put(params, function(err, data) {
        if (err) {
          reject(err);
          console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
          console.log("addSavedList added item:", data);
          resolve(data);
        }
      });

    })
  })
}
