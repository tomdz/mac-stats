var restify = require('restify'),
    filed   = require('filed'),
    sigar   = require('sigar');

var server = restify.createServer({name: 'mac-stats'});

function sendStats(req, res, next) {
  result = { cpus: sigar().cpuList(), time: new Date().getTime() };
  res.send(result);
}

function sendStatic(req, res, next) {
  var path = req.params[0];
  if (path === undefined || path === '/') {
    path = 'index.html';
  }
  filed('static/' + path.replace(/\.\.\//g, '')).pipe(res);
  next();
}

server.get('/stats', sendStats);
server.get(/^(.*)/, sendStatic);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});