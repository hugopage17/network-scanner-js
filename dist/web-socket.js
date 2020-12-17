'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _socket3 = require('socket.io-client');

var _socket4 = _interopRequireDefault(_socket3);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var server = _http2.default.createServer();

var WebSocket = function WebSocket() {
  _classCallCheck(this, WebSocket);
};

WebSocket.Server = function () {
  function _class(port) {
    _classCallCheck(this, _class);

    var io = (0, _socket2.default)(server);
    server.listen(port);
    return io;
  }

  return _class;
}();

WebSocket.Client = function () {
  function _class2(host) {
    _classCallCheck(this, _class2);

    var client = (0, _socket4.default)(host);
    return client;
  }

  return _class2;
}();

exports.default = WebSocket;