import ping from 'ping'
import fetch from 'node-fetch'
import sslCertificate from 'get-ssl-certificate'
import extractDomain from 'extract-domain'
import io from 'socket.io-client'

class NetworkScanner{
  async poll(host, config){
    if(!config){
      config = {
        repeat:1,
        size:32,
        timeout:1
      }
    }
    if(!config.repeat){
      config.repeat = 1
    }
    if(!config.size){
      config.size = 32
    }
    if(!config.timeout){
      config.timeout = 1
    }
    if(!host){
      return new Error('Host cannot be null')
    }
    try{
      let p = await ping.promise.probe(host, {min_reply:config.repeat, packetSize:config.size, timeout:config.timeout}).then((res)=>{
        const status = res.alive == true ? ('online'):('offline')
        return {
          host:host,
          ip_address:res.numeric_host,
          status:status,
          res_avg:`${res.avg}ms`,
          times:res.times,
          packet_loss:res.packetLoss
        }
      })
      return p
    }catch(err){
      return new Error(err)
    }
  }

  getSubnet(subnet){
    if(!subnet.split('/')[1]){
      return new Error(`${subnet} is an invalid subnet`)
    }
    return fetch(`https://networkcalc.com/api/ip/${subnet}?binary=1`)
      .then((res) => {
        return res.json()
      })
      .then((data)=>{
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
      })
  }

  getRange(range){
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

  async ipScan(range, cb){
    const arr = this.getRange(range)
    var new_arr = []
    await Promise.all(arr.map(async (a) => {
      try{
        const each_node = await this.poll(a)
        if(each_node.status === 'online') cb(each_node)
      }catch(err){
        throw new Error(err)
      }
    }))
  }

  async macLookup(mac){
    let res = await fetch(`https://api.macvendors.com/${mac}`)
    let data = await res.text()
    return data
  }

  async getSsl(url){
    const domain = extractDomain(url)
    let ssl = await sslCertificate.get('nodejs.org')
    return ssl
  }

  async clusterPing(array, cb){
    var new_arr = []
    await Promise.all(array.map(async (a) => {
      try{
        const each_node = await this.poll(a)
        new_arr.push(each_node)
      }catch(err){
        throw new Error(err)
      }
    }))
    cb(new_arr)
  }
}

module.exports = NetworkScanner
