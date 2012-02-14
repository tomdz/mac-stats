var restify = require('restify'),
    filed   = require('filed'),
    xml2js  = require('xml2js'),
    spawn   = require('child_process').spawn;

var server = restify.createServer({name: 'mac-stats'});
var parser = new xml2js.Parser();

function sendStats(req, res, next) {
  parser.addListener('end', function(result) {
    res.send(result);
  });

  system_profiler = spawn('system_profiler', ['-xml', '-detailLevel', 'full']);

  system_profiler.stdout.on('data', function (data) {
    parser.parseString(data);
  });
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