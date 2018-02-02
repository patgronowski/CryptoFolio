const apiUtil = require('./api_util');
const User = require('./models/user');

module.exports = function(app, passport) {

    // API call to buy a currency
    app.post("/api/wallet/increment", apiUtil.isLoggedIn, (req, res) => {
        if(!req.body.coinID) {
            return res.sendStatus(400);
        }
        // Search for a user and update their wallet.
        User.findOne({username: req.user.username}, (err, user) => {
            if(err) {
                // Server error.
                return res.sendStatus(500);
            }

            if(!user) {
                // No user to search wallet for.
                return res.sendStatus(400);
            }

            if(!user.wallet) {
                // Initialize the user's wallet if they don't have one.
                user.wallet = {};
            }

            if(user.wallet[req.body.coinID]) {
                // Increment existing coin by 1.
                user.wallet[req.body.coinID] += 1;
            } else {
                // Initialize a new coin in wallet.
                user.wallet[req.body.coinID] = 1;
            }

            // Save the changes to the document.
            User.findOneAndUpdate({username: req.user.username}, {$set: {wallet: user.wallet}}, {new: true}, (err, newUser) => {
                if(err) {
                    return res.sendStatus(500);
                }

                console.log(newUser);
                return res.sendStatus(200);
            });
        });

    });


    // API call to sell a currency.
    app.post("/api/wallet/decrement", apiUtil.isLoggedIn, (req, res) => {
        if(!req.body.coinID) {
            // No coin ID to sell.
            return res.sendStatus(400);
        }
        // Search user for which to sell the currency.
        User.findOne({username: req.user.username}, (err, user) => {
            if(err) {
                //Server error.
                return res.sendStatus(500);
            }

            if(!user) {
                // No user to sell coins.
                return res.sendStatus(400);
            }


            if(user.wallet[req.body.coinID] > 1) {
                // Sell a coin if there's more to sell.
                user.wallet[req.body.coinID] -= 1;
            } else {
                // Remove the coin from the wallet if there's no more.
                delete user.wallet[req.body.coinID];
            }

            // Save the changes to the document.
            User.findOneAndUpdate({username: req.user.username}, {$set: {wallet: user.wallet}}, {new: true}, (err, newUser) => {
                if(err) {
                    return res.sendStatus(500);
                }
                return res.sendStatus(200);
            });
        });

    });

    // Get a user's wallet from the database.
    app.get("/api/wallet", apiUtil.isLoggedIn, (req, res) => {
        User.findOne({username: req.user.username}, (err, user) => {
            if(err) {
                // Server error.
                return res.sendStatus(500);
            }

            if(!user) {
                // No user to get wallet for.
                return res.sendStatus(400);
            }

            // Return user's wallet.
            res.status(200).send(JSON.stringify(user.wallet));
        });

    });

};
