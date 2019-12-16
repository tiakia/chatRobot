const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-type": "text/html" });
  const data = fs.readFileSync(path.resolve(__dirname, "./b.html"));
  res.end(data);
});

server.listen(8000, "127.0.0.1", () => {
  console.log("pageB listening at port 127.0.0.1:8000");
});
