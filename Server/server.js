var http = require("http");
var requestHandler = require('./request-handler');
var port = 8080;
var ip = "127.0.0.1";


var server = http.createServer(requestHandler.handleRequest);
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);