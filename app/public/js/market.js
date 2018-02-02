document.getElementById("table").style.height =
	((window.innerHeight - 100 - document.getElementById("tableSearch").offsetHeight)) + "px";


// Search algorithm for the search bar.
$("#tableSearch").keyup(function myFunction() {
	// Declare variables
	var input, filter, table, tr, td, i;
	input = document.getElementById("tableSearch");
	filter = input.value.toUpperCase();
	table = document.getElementById("actualTable");
	tr = table.getElementsByTagName("tr");

	// Loop through all table rows, and hide those who don't match the search query
	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[1];
		if (td) {
			if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
				tr[i].style.display = "";
			} else {
				tr[i].style.display = "none";
				tr[0].style.display = "";
			}
		}
	}
});


// Populate the table using data taken from our API.
$(function() {
	$.ajax({
    	type: 'GET',
    	url: '/api/coin-data', // limit to 10 for now
    	success: function(data) {
			data.sort(function(a, b) {
    			return parseFloat(a.rank) - parseFloat(b.rank);
			});

    		$.each(data, function(index, item) {

				let tableRow = $("<tr>")
				let rank = $("<td>").append(item.rank)

				let nameDiv = $("<div>").css({ "float": "left" }).append(item.name)
				let button = newBuyButton(item.id).click(buyClickListener)

				let buttonDiv = $("<div>").css({ "float": "right" }).append(button)

				let nameAndButton = $("<td>").append(nameDiv).append(buttonDiv)

				let symbol = $("<td>").append(item.symbol)
				let price = $("<td>").append(item.price_usd)
				let marketCap = $("<td>").append(item.market_cap_usd)

				tableRow.append(rank).append(nameAndButton)
						.append(symbol).append(price)
						.append(marketCap).appendTo(".table-body")
    		})

    	},
   	 	error: function(xhr, error) {
        	console.log("Something went wrong: ", error)
    	}
	})
})
