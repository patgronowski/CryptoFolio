/* Functions and objects for the user profile. */

// Keep track of the user's coins.
let wallet;
let walletValue = 0;
// Keep track of the market statistics.
let marketStats = {};

// Populates the wallet with user's coins.
$.ajax({
    url: "/api/wallet",
    type: "GET",
    contentType: "application/json; charset=utf-8",
    success: function (data) {
        if (data) {
            wallet = JSON.parse(data);    
        } else {
            wallet = {};
        }
        getCoinStats();
    },
    error: function (error) {
        console.log("Failed to GET wallet API:", error);
    }
});

/* Convert "-" delimited id into a readable name. */

let idToName = function (id) {
    words = id.split("-");
    name = "";
    for (let i in words) {
        name += words[i].charAt(0).toUpperCase() + words[i].slice(1) + " ";
    }
    return name.trim();
}

/* Click listener for a cryptocurrency wallet button. It updates "Coin Statistics".*/

let coinInfoListener = function () {
    stats = $("#statistics")
    stats.empty()
    // Extract the id.
    coinID = $(this).attr("id").replace("-btn", "")
    coin = marketStats[coinID]

    // Update the "Coin Statistics" section.
    let appendStrongElement = function (key, value) {
        $("<strong>").append(key + ": ").appendTo(stats).after(value)
        stats.append("<br>")
    }

    let totalValue = (coin.price_usd * wallet[coinID]).toFixed(2)
    appendStrongElement("Your Total Value", totalValue)
    stats.append("<br>")
    // The following is repetitive but each stat is formatted differently.
    appendStrongElement("Name", coin.name)
    appendStrongElement("Symbol", coin.symbol)
    appendStrongElement("Rank", coin.rank)
    appendStrongElement("Price (USD)", coin.price_usd)
    appendStrongElement("Price (BTC)", coin.price_btc)
    appendStrongElement("24h Volume (USD)", coin["24h_volume_usd"])
    appendStrongElement("Market Cap (USD)", coin.market_cap_usd)
    appendStrongElement("Percent Change (1h)", coin.percent_change_1h)
    appendStrongElement("Percent Change (24h)", coin.percent_change_24h)
    appendStrongElement("Percent Change (7d)", coin.percent_change_7d)
}

/* Construct a coin layout (used to display coin statistics). */

let newCoinLayout = function (coinID, quantity) {
    // Get coin name for the button.
    // $.ajax({
    //     url: "/api/wallet/coin",
    //     type: "GET",
    //     contentType: "application/json; charset=utf-8",
    //     data: JSON.stringify({"coinID": coinID}),
    //     success: function (data) {
    //         console.log(data);
    //     },
    //     error: function (resp) {
    //         return alert("Failed to buy the coin.");
    //     }
    // });


    coinName = idToName(coinID)
    // Build the unique wallet coin button.
    let coinLayout = $('<button>', {"id": coinID + "-btn", 'type': 'button', 'class': 'list-group-item btn text-left'})
        .css({"margin": "2px"})

    let coinNameDiv = $("<div>").append(coinName).css({"float": "left"}).appendTo(coinLayout)
    let quantityDiv = $("<div>").appendTo(coinNameDiv)
    let coinQuantity = $("<span>", {"class": coinID + "-qty"}).append(quantity).appendTo(quantityDiv)

    let coinSymbol = $("<span>", {"class": coinID + "-symbol"})
        .append(" " + marketStats[coinID].symbol)
        .appendTo(quantityDiv)

    let buttonDiv = $("<div>").css({"float": "right"}).appendTo(coinLayout)
    let buyButton = newBuyButton(coinID).appendTo(buttonDiv)
    let sellButton = newSellButton(coinID).appendTo(buttonDiv)

    // Add click listeners to all of the buttons.
    buyButton.click(buyClickListener)
    sellButton.click(sellClickListener)

    return coinLayout.click(coinInfoListener)
}

/* Update the coin list with user's current coins. Used for a persistent user. */

let updateCoinList = function () {
    $.each(wallet, function (coin, quantity) {
        newCoinLayout(coin, quantity).appendTo(".coin-list");
    })
}

/* Call the API and save all cryptocurrencys in wallet.
 If user is persistent, update the coin list. */
let getCoinStats = function () {
    $.ajax({
        type: "GET",
        url: '/api/coin-data',
        success: function (data) {
            for (let i in data) {
                marketStats[data[i].id] = data[i]
            }
            updatePage();
            updateCoinList()
        },
        statusCode: {
            404: function () {
                alert("Coin not found")
            }
        }
    })
}

/* Set up the session. */


// Increment a coin in the wallet by quantity.
let buyCoin = function (coinID, quantity) {
    if (!wallet[coinID]) {
        wallet[coinID] = 0;
    }
    wallet[coinID] += quantity;
    updatePage();
}

// Decrement a coin in wallet by quantity.
let sellCoin = function (coinID, quantity) {
    if (wallet[coinID] && quantity <= wallet[coinID]) {
        wallet[coinID] -= quantity;
    }
    if (wallet[coinID] == 0) {
        delete wallet[coinID];
    }
    updatePage();
}

let getTotal = function () {
    walletValue = 0;
    for (let coin in wallet) {
        let quantity = wallet[coin];
        let value = marketStats[coin].price_usd;
        walletValue += quantity * value;
    }
    walletValue = walletValue.toFixed(2);
}
// Update the page with new coin statistics.
let updatePage = function () {
    getTotal();
    // Update DOM elements.
    $("#wallet-value").text(walletValue);

    if (walletValue == 0) {
        $("#empty").text("No coins currently.");
        emptyChart();
    } else {
        $("#empty").empty();
        generateChart(wallet, marketStats);
    }
}

/* Click listener for the add button. */

let buyClickListener = function () {
    // Extract the id.
    let coinID = $(this).attr("id").replace("-buy", "")
    // Add unique wallet coin button if it doesn't exist.
    if (!wallet[coinID]) {
        newCoinLayout(coinID, 0).appendTo(".coin-list")
    }
    buyCoin(coinID, 1)

    $.ajax({
        url: "/api/wallet/increment",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({"coinID": coinID}),
        success: function (resp) {
        },
        error: function (resp) {
            return alert("Failed to buy the coin.");
        }
    });
    // Update visual quantity.
    $("." + coinID + "-qty").text(wallet[coinID])
}

/* Click listener for the sell button. */

let sellClickListener = function () {
    // Extract the id.
    let coinID = $(this).attr("id").replace("-sell", "")
    sellCoin(coinID, 1)
    let quantity = wallet[coinID]
    // Update visual quantity.
    $("." + coinID + "-qty").text(wallet[coinID])
    // Remove the unique wallet coin button if there's none left.
    if (!quantity) {
        $("#" + coinID + "-btn").remove()
        $("#statistics").empty()
    }
    $.ajax({
        url: "/api/wallet/decrement",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({"coinID": coinID}),
        success: function (resp) {
        },
        error: function (resp) {
            return alert("Failed to buy the coin.");
        }
    });
}
