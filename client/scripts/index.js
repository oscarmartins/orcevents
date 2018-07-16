var connection

function nodejsWebsocket () {
	var nickname = prompt("Choose a nickname")
	if (nickname) {
		connection = new WebSocket("ws://"+window.location.hostname+":8070")
		connection.onopen = function () {
			console.log("Connection opened")
			connection.send(nickname)
			document.getElementById("form").onsubmit = function (event) {
				var msg = document.getElementById("msg")
				if (msg.value)
					connection.send(msg.value)
				msg.value = ""
				event.preventDefault()
			}	
		}
		connection.onclose = function () {
            console.log("Connection closed")
            window.location.reload(true)
		}
		connection.onerror = function () {
			console.error("Connection error")
		}
		connection.onmessage = function (event) {
			var div = document.createElement("div")
			div.textContent = event.data
			document.body.appendChild(div)
		}
	}
}
var pushNotify = null
window.addEventListener("load", function () {
	//nodejsWebsocket();
	var eventList = document.querySelector('ul');
    var eventSourceInitDict = {withCredentials: true, headers: {'Cookie': 'test=test', 'Oscar': '123'}};
	pushNotify = new EventSource("//localhost:8070", eventSourceInitDict);
	pushNotify.withCredentials = true;

	pushNotify.addEventListener('oscar-event', function (e) {
		console.log(e.data)
	  })
	/**
    pushNotify.onmessage = function (e) {
		var newElement = document.createElement("li");
		newElement.textContent = "message: " + e.data;
		eventList.appendChild(newElement);
	}
	 */
})