/**
const serve = require('./nodejs-websocket')
serve.init();
 */
var SSE = require('sse'), http = require('http')

const connections = [];
const timers = [];
var server = http.createServer(function(req, res) {

	/**
	 if (req.headers.accept && req.headers.accept == 'text/event-stream') {
			sendSSE(req, res);
		} else {
			res.writeHead(200, {'Content-Type': 'text/html'});
			//res.write(fs.readFileSync(__dirname + '/sse-node.html'));
			res.end();
		}
	 */



	res.on('close', () => {
		server.getConnections(function(error, count) {
			if (error)
				throw error
			console.log("close getConnections count: ", count);
		}) 
  })

	const httpObj = {req: req, res: res}
	connections.push(httpObj)
	
	if (connections.length >= 3) {
		for (var _c = 0; _c < connections.length; _c++) {
			var jj = connections[_c]
			if (jj.req.headers.accept && jj.req.headers.accept == 'text/event-stream') {
				sendSSE(jj.req, jj.res);
			} else {
				jj.res.writeHead(200, {'Content-Type': 'text/html'});
				//res.write(fs.readFileSync(__dirname + '/sse-node.html'));
				jj.res.end();
			}
		}
	}

  


}).listen(8070)


function sendSSE(req, res) {
	res.writeHead(200, {
	  'Content-Type': 'text/event-stream',
	  'Cache-Control': 'no-cache',
	  'Connection': 'keep-alive',
		'Access-Control-Allow-Origin': 'http://localhost:8000',
		'Access-Control-Allow-Credentials': true,
		'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Oscar'
	});
  
	var id = (new Date()).toLocaleTimeString();
  const base64 = Buffer.from("oscar").toString('base64');		
	// Sends a SSE every 5 seconds on a single connection.
	
	const obj = {
		rs: res,
		rq: req,
		tr: -1
	};

	obj.tr = setInterval(function() {
		//constructSSE(res, id, (new Date()).toLocaleTimeString());
		server.getConnections(function(error, count) {
			if (error)
				throw error
			console.log("getConnections count: ", count);
		}) 
		constructSSE(res, id, base64);

	}, 5000);


	timers.push(obj);
  
	//constructSSE(res, id, (new Date()).toLocaleTimeString());
  }
  
  function constructSSE(res, id, data) {
	res.write('event: oscar-event\n');
	res.write('id: ' + id + '\n');
	res.write("data: " + data + '\n\n');
	}
