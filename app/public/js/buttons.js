/* Construct a buy button (used to buy a coin). */
let newBuyButton = function(coinID) {
    return $("<button>", { "type": "button", "class": "btn btn-success",
                "data-toggle": "modal", "data-target": "#transactionModal",
                "id": coinID + "-buy"})
            .text("+")
            .css({
                "margin": "2px",
                "width": "35px"
            })
}

/* Construct a sell button (used to sell a coin). */
let newSellButton = function(coinID) {
    return $("<button>", { "type": "button", "class": "btn btn-danger",
                    "data-toggle": "modal", "data-target": "#transactionModal",
                    "id": coinID + "-sell"})
            .text("-")
            .css({
                "margin": "2px",
                "width": "35px"
            })
}
