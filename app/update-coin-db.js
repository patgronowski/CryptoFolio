const request = require('request');
var Coin = require('./models/coin.js');

// Search the CoinMarketCap API for cryptocurrencies and store them in our database.
setInterval(function() {
    request("https://api.coinmarketcap.com/v1/ticker/?limit=100", function(error, response, body) {
        if (error) {
            console.log("Something went wrong: ", error)
        } else {
            data = JSON.parse(body);
            for (let index in data) {
                let coinObject = data[index];
                let coin = new Coin();
                addCoin(coinObject, null);
            }
        }
    });
}, 20000);

// Add a coin to the database.
let addCoin = function(coinObject, username) {

    Coin.update(
        {"id": coinObject.id},
        {
            "id":coinObject.id,
            "name": coinObject.name,
            "symbol": coinObject.symbol,
            "rank": coinObject.rank,
            "price_usd": coinObject.price_usd,
            "price_btc": coinObject.price_btc,
            "market_cap_usd": coinObject.market_cap_usd,
            "available_supply": coinObject.available_supply,
            "total_supply": coinObject.total_supply,
            "percent_change_1h": coinObject.percent_change_1h,
            "percent_change_24h": coinObject.percent_change_24h,
            "percent_change_7d": coinObject.percent_change_7d,
            "last_updated": coinObject.last_updated,
            "secret": username
        },
        {"upsert": true},
        function(err,res) {
            // console.log(err)
            // console.log(res)
        }
    );
};

module.exports = addCoin;
