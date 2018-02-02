// The latest message received and its id
var newestMessage = "";
var newId = -1;

// Global counter for closing message popup
var counter = 0;

function ajaxMessage() {
	$.ajax({
		// Make the request to get the latest message from our local message db
		type: 'GET',
		url: '/api/messages/latest',
		success: function(data) {
			var modal = document.getElementById("messageModal");
			var modalText = document.getElementById("messageSpan");
			var data = JSON.parse(data);
			// If the message received is different from current latest
			if (data.id != newId && data.message) {
				newestMessage = data.message;
				newId = data.id
				modalText.innerHTML = newestMessage;
				counter = 0;
                $("#messageModal").fadeIn(1000);
			}
			// If its not a new message then increment the counter on each loop of this
			else{
				counter++;
				if (counter == 10) {
                	$("#messageModal").fadeOut(1000);
                	counter = 0;
                }
			}
		},
		error: function(xhr, error) {
			console.log("Something went wrong: ", error);
		}
	})
};

// Run the above function on a loop with a 1 second timeout
setInterval(ajaxMessage, 1000);