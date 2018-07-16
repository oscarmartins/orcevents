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


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

var pushNotify = null
window.addEventListener("load", function () {
	//nodejsWebsocket();

	var nickname = prompt("Choose a nickname")
	if (nickname) {
		setCookie('username', nickname, 1);
	}

	var eventList = document.querySelector('ul');
    var eventSourceInitDict = {withCredentials: true, headers: {'Cookie': 'test=test', 'Oscar': '123'}};
	pushNotify = new EventSource("//localhost:8070", eventSourceInitDict);
	pushNotify.withCredentials = true;

	pushNotify.addEventListener('error', function (e) {
		console.log(e);
		//pushNotify.close();
	 });

	pushNotify.addEventListener('oscar-event', function (e) {
		console.log(e.data);
		var newElement = document.createElement("li");
		newElement.textContent = "message: " + e.data;
		eventList.appendChild(newElement);
	  })
	/**
    pushNotify.onmessage = function (e) {
		var newElement = document.createElement("li");
		newElement.textContent = "message: " + e.data;
		eventList.appendChild(newElement);
	}
	 */
})