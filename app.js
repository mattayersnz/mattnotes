const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/') {

    // Figure this out to get index.html
    res.writeHead(200, 'Content-Type': 'text/plain');
    res.end();
  }
});

server.listen(3000);

console.log('Listening on port 3000')
