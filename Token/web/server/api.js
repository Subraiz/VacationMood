var express = require('express');
var router = express.Router();
var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1"
});

var db = new AWS.DynamoDB();


router.get('/:token_id', function(req, res, next) {

    // TODO: parameterize table name
    var params = {
        TableName: "AliceToken",
        Key: {
            'tokenID': { 'N': req.params.token_id }
        }
    };

    db.getItem(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {

            // TODO: make this more generic, including trivially adding attributes
            var document = {
                "name": data.Item.name.S,
                "image": data.Item.image.S,
                "description": data.Item.description.S,
                "external_url": data.Item.external_url.S,
                "background_color": data.Item.background_color.S
            }

            var json = JSON.stringify(document);
            console.log("GetItem succeeded:" + json);
            res.type('json').send(json);

        }
    });
});


module.exports = router;
