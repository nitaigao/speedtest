var speedtest = require('./speedtest')
var math      = require('./math');
var _         = require('underscore');

speedtest.getConfig(function(config) {
  speedtest.getServers(function(servers) {
    var serversByDistance = _.sortBy(servers, function(server) {
      var distance = math.distance(server.coords, config.coords);
      server.distance = distance;
      return distance;
    });

    var closestServer = _.first(serversByDistance);
    speedtest.testServer(closestServer.url, function(result) {
      console.log(result);
    })
  });
});
