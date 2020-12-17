'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getRange = exports.getRange = function getRange(range) {
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
};

var subnetData = exports.subnetData = function subnetData(data) {
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
};