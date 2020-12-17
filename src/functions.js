export const getRange = (range) => {
  if(range.includes('-') === false)
    throw new Error('Invalid IP Range, e.g(192.168.1.1-254)')
  if(!range)
    throw new Error('IP Range cannot be null, e.g(192.168.1.1-254)')
  var array = []
  let network = range.split('-')[0]
  var max = range.split('-')[1]
  if(max > 255)
    throw new Error('Invalid IP Range, e.g(192.168.1.1-254)')
  const min = network.split('.')[3]
  network = network.replace(min, '')
  for (var i = min; i <= max; i++) {
    const node = network.concat(i)
    array.push(node)
  }
  return array
}

export const subnetData = (data) => {
  var addr = data.address
  var obj = {
    subnet:addr.cidr_notation,
    subnet_bits:addr.subnet_bits,
    subnet_mask:addr.subnet_mask,
    network_address:addr.network_address,
    broadcast_address:addr.broadcast_address,
    first_host:addr.first_assignable_host,
    last_host:addr.last_assignable_host,
    available_hosts:addr.assignable_hosts,
    host_range:`${addr.first_assignable_host}-${addr.last_assignable_host.split('.')[3]}`
  }
  return obj
}
