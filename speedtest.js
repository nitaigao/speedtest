exports.getConfig = function(callback) {
  var parseString = require('xml2js').parseString;
  var request = require('request');

  var options = { };
  options.url = "http://www.speedtest.net/speedtest-config.php";
  options.headers = { 'User-Agent': 'Mozilla' } // SpeedTest.net wont respond with a body unless we have a known UserAgent

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function (err, result) {
        var client = result.settings.client[0].$
        // var client = {ip:"172.10.1.10", lat:"31.63672", lon:"-7.99272"}
        var settings = {}
        settings.clientip = client.ip;
        settings.coords = {latitude:parseFloat(client.lat), longitude:parseFloat(client.lon)}
        callback(settings)
      });
    }
  })
}

exports.getServers = function(callback) {
  var parseString = require('xml2js').parseString;
  var request = require('request');
  var _ = require('underscore');
  var serverData = require('./serverdata')
  var url = require('url');

  var options = { };
  options.url = "http://www.speedtest.net/speedtest-servers.php";
  options.headers = { 'User-Agent': 'Mozilla' }

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function (err, result) {;
        var servers = _.map(result.settings.servers[0].server, function(obj) {
          // var servers = _.map(serverData.data/*result.settings.servers[0].server*/, function(obj) {
          var server = {}
          var serverURL = url.parse(obj.$.url);
          server.url = serverURL.protocol + '//' + serverURL.hostname;
          server.coords = {latitude:parseFloat(obj.$.lat), longitude:parseFloat(obj.$.lon)}
          return server;
        });
        callback(servers);
      });
    }
  })
}

exports.testServer = function(url, callback) {
  var request = require('request');
  var async = require('async');
  var randomstring = require('randomstring');

  var result = {upload:0, download:0, timestamp:0};

  async.series({
    download: function(cb) {
      var startTime = Date.now();

      var options = { };
      options.url = url + "/speedtest/random750x750.jpg"
      options.headers = { 'User-Agent': 'Mozilla' }

      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var endTime = Date.now();
          var duration = (endTime - startTime) / 1000;

          var bitsLoaded = body.length * 8;
          var speedBps = (bitsLoaded / duration).toFixed(2);
          var speedKbps = (speedBps / 1024).toFixed(2);
          var speedMbps = (speedKbps / 1024).toFixed(2);

          cb(null, speedMbps);
        }
      });
    },
    upload: function(cb) {
      var startTime = Date.now();

      var options = { };
      options.url = url + "/speedtest/upload.php"
      options.headers = { 'User-Agent': 'Mozilla' }

      var randomData = randomstring.generate(19719);

      var r = request.post(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var endTime = Date.now();
          var duration = (endTime - startTime) / 1000;

          var bitsLoaded = randomData.length * 8;
          var speedBps = (bitsLoaded / duration).toFixed(2);
          var speedKbps = (speedBps / 1024).toFixed(2);
          var speedMbps = (speedKbps / 1024).toFixed(2);

          cb(null, speedMbps);
        }
      });

      var form = r.form();
      form.append('content0', randomData);
    }
  },
  function(err, results) {
    var result = {}
    result.timestamp = Date.now();
    result.upload = results.upload;
    result.download = results.download;
    callback(result);
  });
};
