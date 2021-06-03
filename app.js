const http = require('http');
const port = process.env.PORT || 3000;
const fs = require('fs');

const server = http.createServer((req, res) => {
    fs.readFile(__dirname + "/index.html")
    .then(contents => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(contents);
    })
});

server.listen(port,() => {
  console.log(`Server running at port `+port);
});