const http = require('http');
const handleServer = require('../app');

http.createServer(handleServer).listen(8802);

  