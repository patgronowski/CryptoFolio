const request = require('request');
var Coin = require('./models/coin.js');

setInterval(function() {
    request("https://api.coinmarketcap.com/v1/ticker/?limit=1", function(error, response, body) {
        if (error) {
            console.log("Something went wrong: ", error)
        } else {
            data = JSON.parse(body);
            for (let index in data) {

                let coin = data[index];
                // // Check if the coin was updated since the last time.
                // wasUpdated(schema, coin).then((isChanged) => {
                //     if (isChanged) {
                //         console.log("Was updated");
                //         updateCoin(schema, coin);
                //     }
                // });

                Coin.createCoin(coin);
            }
        }
    });
}, 5000);


//120000

// let wasUpdated = function(schema, coinObject) {
//     console.log(coinObject.id)
//     console.log(coinObject.last_updated)
//     console.log("Checking if updated");
//     return new Promise(function(resolve, reject) {
//         schema.findOne({"crypto.id": coinObject.id}, function(err, res) {
//             if (err) {
//                 // Report the error.
//                 reject(err);
//             } else if (res) {
//                 // Entry found; compare timestamps.
//                 console.log(coinObject.id)
//                 console.log(coinObject.last_updated)
//                 console.log(res.crypto.last_updated)
//                 if (res.crypto.last_updated != coinObject.last_updated) {
//                     console.log("is updated")
//                     // Was updated; return true.
//                     resolve(true);
//                 }
//             } else {
//                 // Entry not found; return false.
//                 console.log("Not found; updating")
//                 resolve(true);
//             }
//
//             resolve(false);
//         });
//     });
// };
//
// let updateCoin = function(coinObject) {
//     var newCoin = new Cypto();
//
//     newCoin.crypto.id: coinObject.id,
//     newCoin.crypto.name: coinObject.name,
//     newCoin.crypto.symbol: coinObject.symbol,
//     newCoin.crypto.rank: coinObject.rank,
//     newCoin.crypto.price_usd: coinObject.price_usd,
//     newCoin.crypto.price_btc: coinObject.price_btc,
//     newCoin.crypto.market_cap_usd: coinObject.market_cap_usd,
//     newCoin.crypto.available_supply: coinObject.available_supply,
//     newCoin.crypto.total_supply: coinObject.total_supply,
//     newCoin.crypto.percent_change_1h: coinObject.percent_change_1h,
//     newCoin.crypto.percent_change_24h: coinObject.percent_change_24h,
//     newCoin.crypto.percent_change_7d: coinObject.percent_change_7d,
//     newCoin.crypto.last_updated: coinObject.last_updated
//
//     console.log("Adding coin:", coinObject.id);
//     schema.replaceOne(
//         {"crypto.id": coinObject.id},
//         {
//             "id": coinObject.id,
//             "name": coinObject.name,
//             "symbol": coinObject.symbol,
//             "rank": coinObject.rank,
//             "price_usd": coinObject.price_usd,
//             "price_btc": coinObject.price_btc,
//             "market_cap_usd": coinObject.market_cap_usd,
//             "available_supply": coinObject.available_supply,
//             "total_supply": coinObject.total_supply,
//             "percent_change_1h": coinObject.percent_change_1h,
//             "percent_change_24h": coinObject.percent_change_24h,
//             "percent_change_7d": coinObject.percent_change_7d,
//             "last_updated": coinObject.last_updated
//         },
//         { upsert: true },
//         function(err, res) {
//             if (err)
//             console.log(err)
//             else {
//                 console.log(res)
//             }
//         }
//     );
// };
