let Coin = require('./models/coin.js');
let addCoin = require('./update-coin-db');

module.exports = function(app) {

    // Keeps track of all messages sent by administrators.
    var messageCount = 0;
    var messages = {
    };

    // Returns the latest message pushed by an administrator.
    app.get("/api/messages/latest", function (req, res) {
        var msg = messages[messageCount - 1];
        var obj = {
            id: messageCount - 1,
            message: msg
        }
        res.status(200).send(JSON.stringify(obj));
    });

    // API call to post a messages.
    app.post("/api/messages", function(req, res) {
        var message = req.body.data;
        console.log(req.body);
        if (message) {
            messages[messageCount] = message;
            console.log(messages);
            messageCount++;
            res.status(200).send(JSON.stringify("Post request received"));
        } else {
            res.status(400).send("Something went wrong");
        }

    });

    // API call to get all messages.
    app.get("/api/messages", function(req, res) {
        res.status(200).send(messages);
    });

    // API call to delete a message with provided ID.
    app.delete("/api/messages/:id", function(req, res) {
        var id = req.param('id');
        if (messages[id]) {
            delete messages[id];
            res.status(200).send("Deleted message with id " + id);
        } else {
        res.status(400).send("That message id does not exist")
        }
    });

    // Get information for all cryptocurrencies.
    app.get("/api/coin-data", function(req, res) {
        Coin.find({}, {_id: false, __v: false}, function(err, coins) {
            if (err) {
                // Server error.
                return res.sendStatus(500);
            }
            else {
                // Send coins.
                res.status(200).send(coins);
            }
        })
    });

    // Get information for curreny with id ID.
    app.get("/api/coin-data/:id", function(req, res) {
        Coin.find({"id": req.params.id}, {_id: false, __v: false, secret: false}, function(err, coin) {
            if (err) {
                // Server error.
                return res.sendStatus(500);
            }

            else if (coin.length == 0) {
                // Coin ID doesn't exist.
                return res.sendStatus(400);
            }

            else {
                // Coin exists, send its information.
                res.status(200).send(coin);
            }
        });
    });


    // Create a new cryptocurrency.
    app.post("/api/coin-data", function(req, res) {
        // Ensure user posted with correct inputs.
        if (!req.body.id || !req.body.name || !req.body.symbol || !req.body.price || !req.body.market_cap || !req.body.secret) {
            return res.sendStatus(400);
        }

        // Check if the coin exists.
        Coin.find({"id": req.body.id}, {_id: false, __v: false, secret: false}, function(err, coin) {
            if (err) {
                // Server error.
                return res.sendStatus(500);
            }

            else if (coin.length == 0) {
                // Coin doesn't exist; create it.

                var date = new Date();
                var time = date.getTime();

                let newCoin = {
                    "id": req.body.id,
                    "name": req.body.name,
                    "symbol": req.body.symbol,
                    "rank": null,
                    "price_usd": req.body.price,
                    "price_btc": "N/A",
                    "market_cap_usd": req.body.market_cap,
                    "available_supply": "N/A",
                    "total_supply": "N/A",
                    "percent_change_1h": "N/A",
                    "percent_change_24h": "N/A",
                    "percent_change_7d": "N/A",
                    "last_updated": time,
                }

                addCoin(newCoin, req.body.secret);
                return res.status(200).send(newCoin);
            }

            else {
                // Coin already exists.
                return res.sendStatus(400);
            }
        })
    });

    // Edit an existing currency.
    app.put("/api/coin-data/:id", function(req, res) {
        // Ensure user posted with correct inputs.
        if (!req.body.name || !req.body.symbol || !req.body.price || !req.body.market_cap || !req.body.secret) {
            return res.sendStatus(400);
        }

        // Check if the coin exists and secret is correct.
        Coin.find({"id": req.params.id, "secret": req.body.secret}, {_id: false, __v: false, secret: false}, function(err, coin) {

            if (err) {
                // Server error.
                return res.sendStatus(500);
            }


            else if (coin.length == 0) {
                // Coin does not exist.
                return res.sendStatus(400);
            }

            else {
                // Coin exists; update it.
                var date = new Date();
                var time = date.getTime();

                let newCoin = {
                    "id": req.body.id,
                    "name": req.body.name,
                    "symbol": req.body.symbol,
                    "rank": null,
                    "price_usd": req.body.price,
                    "price_btc": "N/A",
                    "market_cap_usd": req.body.market_cap,
                    "available_supply": "N/A",
                    "total_supply": "N/A",
                    "percent_change_1h": "N/A",
                    "percent_change_24h": "N/A",
                    "percent_change_7d": "N/A",
                    "last_updated": time,
                }

                addCoin(newCoin, req.body.secret);
                return res.send(newCoin);
            }
        });
    });

    // Delete a currency.
    app.delete("/api/coin-data/:id", function(req, res) {
        // Ensure user posted with correct inputs.
        if (!req.body.secret) {
            return res.sendStatus(400);
        }

        Coin.deleteOne({id: req.params.id, secret: req.body.secret}, function(err, resp) {
            if (err) {
                // Server error.
                return res.sendStatus(500);
            }

            return res.status(200).send({message: "Successful delete!"});
        });
    });

}
