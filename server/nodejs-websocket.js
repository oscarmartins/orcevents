var ws = require("nodejs-websocket")

function initServer() {
    // Scream server example: "hi" -> "HI!!!"
    var server = ws.createServer(function (connection) {
        console.log("New connection")
        connection.nickname = null
        connection.on("text", function (str) {
            if (connection.nickname === null) {
                connection.nickname = str
                broadcast(str + " entered")
            } else
                broadcast("[" + connection.nickname + "] " + str)
        })
        connection.on("close", function (code, reason) {
            console.log("Connection closed")
        })
    }).listen(8070)

    function broadcast(msg) {
        server.connections.forEach(function (connection) {
            connection.sendText(msg)
        })
    }

    setInterval(function () {
        if (server.connections.length) {
            server.connections.forEach(function (connection) {
                connection.sendText(JSON.stringify({ notification: 'Tem uma nova mensagem!' }))
            })
        }
    }, 10000)
}

const instance = {
    init: initServer
}

module.exports = instance;
