/**
const serve = require('./nodejs-websocket')
serve.init();
 */
var SSE = require('sse');
var http = require('http');
var sys = require('sys');

const connections = [];
const timers = [];
const users = [];

var server = http.createServer(function(req, res) {

	const readCookie = get_cookies(req)['username'];
	console.log('Read User: ', readCookie);
	users.push(readCookie);

// debugHeaders(req);
	if (req && res) {
		res.on('close', () => {
			console.log(this);
  	})

		const httpObj = {user:readCookie, req: req, res: res};
		connections.push(httpObj);
	
//	if (connections.length >= 3) {
		for (var _c = 0; _c < connections.length; _c++) {
			var jj = connections[_c]
			if (jj.req.headers.accept && jj.req.headers.accept == 'text/event-stream') {
				sendSSE(jj.req, jj.res, jj.user);
			} else {
				jj.res.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': 'http://localhost:8000'});
				//res.write(fs.readFileSync(__dirname + '/sse-node.html'));
				jj.res.end();
			}
		}
//	}
}

}).listen(8070)


function sendSSE(req, res, user) {
	res.writeHead(200, {
	  'Content-Type': 'text/event-stream',
	  'Cache-Control': 'no-cache',
	  'Connection': 'keep-alive',
		'Access-Control-Allow-Origin': 'http://localhost:8000',
		'Access-Control-Allow-Credentials': true,
		'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
	});
  
	var id = (new Date()).toLocaleTimeString();
	const base64 = user; // Buffer.from("oscar").toString('base64');		
	
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
			//console.log("getConnections count: ", count);
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


	function debugHeaders(req) {
		sys.puts('URL: ' + req.url);
		for (var key in req.headers) {
			sys.puts(key + ': ' + req.headers[key]);
		}
		sys.puts('\n\n');
	}

	var get_cookies = function(request) {
		var cookies = {};
		try {
			request.headers && request.headers.cookie.split(';').forEach(function(cookie) {
				var parts = cookie.match(/(.*?)=(.*)$/)
				cookies[ parts[1].trim() ] = (parts[2] || '').trim();
			});
		} catch (error) {
			
		}
		
		return cookies;
	}