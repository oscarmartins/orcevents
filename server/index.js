/**
const serve = require('./nodejs-websocket')
serve.init();
 */
var SSE = require('sse'), http = require('http')
 
var server = http.createServer(function(req, res) {
  console.log(req)
  if (req.headers.accept && req.headers.accept == 'text/event-stream') {
    sendSSE(req, res);
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    //res.write(fs.readFileSync(__dirname + '/sse-node.html'));
    res.end();
  }


}).listen(8070)


function sendSSE(req, res) {
	res.writeHead(200, {
	  'Content-Type': 'text/event-stream',
	  'Cache-Control': 'no-cache',
	  'Connection': 'keep-alive',
	  'Access-Control-Allow-Origin': '*'
	});
  
	var id = (new Date()).toLocaleTimeString();
  
	// Sends a SSE every 5 seconds on a single connection.
	setInterval(function() {
	  constructSSE(res, id, (new Date()).toLocaleTimeString());
	}, 5000);
  
	//constructSSE(res, id, (new Date()).toLocaleTimeString());
  }
  
  function constructSSE(res, id, data) {
	res.write('id: ' + id + '\n');
	res.write("data: " + data + '\n\n');
  }