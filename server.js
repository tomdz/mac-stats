var restify = require('restify'),
    xml2js  = require('xml2js'),
    spawn   = require('child_process').spawn;

function respond(req, res, next) {
  var parser = new xml2js.Parser();

  parser.addListener('end', function(result) {
    res.send(result);
  });

  system_profiler = spawn('system_profiler', ['-xml', '-detailLevel', 'full']);

  system_profiler.stdout.on('data', function (data) {
    parser.parseString(data);
  });
}

var server = restify.createServer({name: 'mac-stats'});
server.get('/', respond);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});