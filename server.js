const WebSocket = require('ws');
const wss = new WebSocket.Server({host: '0.0.0.0',  port: 8888 });

var i = 1;

var chat = {
	run: function() {
		wss.on('listening', function() {
			let remote = this.address();
			console.log(`Server running at ${remote.address}:${remote.port}`);
		});
		
		wss.on('connection', function(ws, req) {
			ws.isAlive = true;
			ws.ip = req.connection.remoteAddress.replace(/^.*:/, '');
			let info = `new client: ${ws.ip}`;
			i = 1;
			console.log(info);
			
			ws.on('message', (message) => chat.print(message, ws) );
			
			ws.on('close', () => {
				let info = `client ${ws.ip} disconnected`;
				console.log(info);
				
				wss.clients.forEach((ws) => {
					ws.send(info);
				});
			});
		});
	},
	
	print: function(message, sender) {
		var sz = message.toString().length;
		let payload = `[${sender.ip}] > ` + i.toString() + `- pck_lenght: ` + sz;
		i = i+1;
		console.log(payload);
	}
};

chat.run();