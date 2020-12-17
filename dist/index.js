'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ping = require('ping');

var _ping2 = _interopRequireDefault(_ping);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _getSslCertificate = require('get-ssl-certificate');

var _getSslCertificate2 = _interopRequireDefault(_getSslCertificate);

var _extractDomain = require('extract-domain');

var _extractDomain2 = _interopRequireDefault(_extractDomain);

var _webSocket = require('./web-socket.js');

var _webSocket2 = _interopRequireDefault(_webSocket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NetworkScanner = function () {
  function NetworkScanner() {
    _classCallCheck(this, NetworkScanner);
  }

  _createClass(NetworkScanner, [{
    key: 'poll',
    value: async function poll(host, config) {
      if (!config) {
        config = {
          repeat: 1,
          size: 32,
          timeout: 1
        };
      }
      if (!config.repeat) {
        config.repeat = 1;
      }
      if (!config.size) {
        config.size = 32;
      }
      if (!config.timeout) {
        config.timeout = 1;
      }
      if (!host) {
        return new Error('Host cannot be null');
      }
      try {
        var p = await _ping2.default.promise.probe(host, { min_reply: config.repeat, packetSize: config.size, timeout: config.timeout }).then(function (res) {
          var status = res.alive == true ? 'online' : 'offline';
          return {
            host: host,
            ip_address: res.numeric_host,
            status: status,
            res_avg: res.avg + 'ms',
            times: res.times,
            packet_loss: res.packetLoss
          };
        });
        return p;
      } catch (err) {
        return new Error(err);
      }
    }
  }, {
    key: 'getSubnet',
    value: function getSubnet(subnet) {
      if (!subnet.split('/')[1]) {
        return new Error(subnet + ' is an invalid subnet');
      }
      return (0, _nodeFetch2.default)('https://networkcalc.com/api/ip/' + subnet + '?binary=1').then(function (res) {
        return res.json();
      }).then(function (data) {
        var addr = data.address;
        var obj = {
          subnet: addr.cidr_notation,
          subnet_bits: addr.subnet_bits,
          subnet_mask: addr.subnet_mask,
          network_address: addr.network_address,
          broadcast_address: addr.broadcast_address,
          first_host: addr.first_assignable_host,
          last_host: addr.last_assignable_host,
          available_hosts: addr.assignable_hosts,
          host_range: addr.first_assignable_host + '-' + addr.last_assignable_host.split('.')[3]
        };
        return obj;
      });
    }
  }, {
    key: 'getRange',
    value: function getRange(range) {
      if (range.includes('-') === false) throw new Error('Invalid IP Range, e.g(192.168.1.1-254)');
      if (!range) throw new Error('IP Range cannot be null, e.g(192.168.1.1-254)');
      var array = [];
      var network = range.split('-')[0];
      var max = range.split('-')[1];
      if (max > 255) throw new Error('Invalid IP Range, e.g(192.168.1.1-254)');
      var min = network.split('.')[3];
      network = network.replace(min, '');
      for (var i = min; i <= max; i++) {
        var node = network.concat(i);
        array.push(node);
      }
      return array;
    }
  }, {
    key: 'ipScan',
    value: async function ipScan(range, cb) {
      var _this = this;

      var arr = this.getRange(range);
      var new_arr = [];
      await Promise.all(arr.map(async function (a) {
        try {
          var each_node = await _this.poll(a);
          if (each_node.status === 'online') cb(each_node);
        } catch (err) {
          throw new Error(err);
        }
      }));
    }
  }, {
    key: 'macLookup',
    value: async function macLookup(mac) {
      var res = await (0, _nodeFetch2.default)('https://api.macvendors.com/' + mac);
      var data = await res.text();
      return data;
    }
  }, {
    key: 'getSsl',
    value: async function getSsl(url) {
      var domain = (0, _extractDomain2.default)(url);
      var ssl = await _getSslCertificate2.default.get('nodejs.org');
      return ssl;
    }
  }, {
    key: 'clusterPing',
    value: async function clusterPing(array, cb) {
      var _this2 = this;

      var new_arr = [];
      await Promise.all(array.map(async function (a) {
        try {
          var each_node = await _this2.poll(a);
          new_arr.push(each_node);
        } catch (err) {
          throw new Error(err);
        }
      }));
      cb(new_arr);
    }
  }, {
    key: 'netServer',
    value: function netServer(port) {
      var server = new _webSocket2.default.Server(port);
      return server;
    }
  }, {
    key: 'netClient',
    value: function netClient(host) {
      var client = new _webSocket2.default.Client(host);
      return client;
    }
  }]);

  return NetworkScanner;
}();

module.exports = NetworkScanner;