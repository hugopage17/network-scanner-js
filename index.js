const ping = require('ping')
const fetch = require('node-fetch')

class NetworkScan{
  async poll(host){
    if(!host){
      return new Error('Host cannot be null')
    }
    try{
      let p = await ping.promise.probe(host).then((res)=>{
        if(res.alive){
          return {
            status:'online',
            time:`${res.min}ms`
          }
        }else{
          return {
            status:'offline',
            time:'unreachable'
          }
        }
      })
      return p
    }catch(err){
      return new Error(err)
    }
  }

  getSubnet(subnet){
    return fetch(`https://networkcalc.com/api/ip/${subnet}?binary=1`)
      .then((res) => {
        return res.json()
      })
      .then((data)=>{
        return data
      })
  }

  getRange(range){
    if(range.includes('-') === false)
      throw new Error('Invalid IP Range, e.g(192.168.1.1-254)')
    if(!range)
      throw new Error('IP Range cannot be null, e.g(192.168.1.1-254)')
    var array = []
    let leftSide = range.split('-')[0]
    var max = range.split('-')[1]
    if(max > 255)
      throw new Error('Invalid IP Range, e.g(192.168.1.1-254)')
    const min = leftSide.split('.')[3]
    leftSide = leftSide.replace(min, '')
    for (var i = min; i <= max; i++) {
      const node = leftSide.concat(i)
      array.push(node)
    }
    return array
  }

  async ipScan(range){
    const arr = this.getRange(range)
    var new_arr = []
    await Promise.all(arr.map(async (a) => {
      try{
        const index = arr.indexOf(a)
        const each_node = await this.poll(a)
        if(each_node.status === 'online') new_arr.push(a)
      }catch(err){
        throw new Error(err)
      }
    }))
    return new_arr
  }
}

module.exports.NetworkScan = NetworkScan
