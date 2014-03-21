exports.getConfig = function(callback) {
  var parseString = require('xml2js').parseString;
  var request = require('request');

  var options = { };
  options.url = "http://www.speedtest.net/speedtest-config.php";
  options.headers = { 'User-Agent': 'Mozilla' }

  // request(options, function (error, response, body) {
    // if (!error && response.statusCode == 200) {
      // parseString(body, function (err, result) {
        //var client = result.settings.client[0].$
        var client = {ip:"172.10.1.10", lat:"31.63672", lon:"-7.99272"}
        var settings = {}
        settings.clientip = client.ip;
        settings.coords = {latitude:parseFloat(client.lat), longitude:parseFloat(client.lon)}
        callback(settings)
      // });
    // }
  // })
}

exports.getServers = function(callback) {
  var parseString = require('xml2js').parseString;
  var request = require('request');
  var _ = require('underscore');
  var serverData = require('./serverdata')

  var options = { };
  options.url = "http://www.speedtest.net/speedtest-servers.php";
  options.headers = { 'User-Agent': 'Mozilla' }

  // request(options, function (error, response, body) {
    // if (!error && response.statusCode == 200) {
      // parseString(body, function (err, result) {
        var servers = _.map(serverData.data/*result.settings.servers[0].server*/, function(obj) {
          var server = {}
          server.url = obj/*.$*/.url;
          server.coords = {latitude:parseFloat(obj/*.$*/.lat), longitude:parseFloat(obj/*.$*/.lon)}
          return server;
        });
        callback(servers);
      // });
    // }
  // })
}

exports.testServer = function(url, callback) {
  var result = {url:url, download:123, upload:123, timestamp:1230}
  callback(result);
};
