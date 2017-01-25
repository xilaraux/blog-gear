var http = require('http');
var static = require('node-static');
var file = new static.Server('.');
var currentPort = 8080;

http.createServer(function(req, res) {
    // file.serveFile('/index.html', 200, {}, req, res);
    file.serve(req, res);
}).listen(currentPort);

console.log('Server running on port ' + currentPort);