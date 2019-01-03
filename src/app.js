const http = require('http');
const conf = require('./config/defaultConfig');
const path = require('path');
const fs = require('fs');
const server = http.createServer((req, res) => {
  const filePath = path.join(conf.root, req.url);
  fs.stat(filePath, (err, stats) => {
    if(err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain'); 
      res.end(`${filePath} is not a directory or file`);     
    }
    if(stats.isFile()) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      // 将文本以流的形式  返回
      fs.createReadStream(filePath).pipe(res); 
    } else if (stats.isDirectory()) {
      fs.readdir(filePath, (err, files) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(files.join(','));
      });
    }
  });
});
server.listen(conf.port, conf.hostname, () => {
  const addr = `http://${conf.hostname}:${conf.port}`;
  console.info(`Server started at ${addr}`)
})