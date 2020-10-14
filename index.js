const ping = require('ping')
const _ = require('underscore')
traceroute = require('traceroute');
var myArgs = process.argv.slice(2);

class NodeScan{
  constructor(){

  }

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

  ping_subnet(subnet){
    try{
      const subnet_mask = subnet.split('/')
      if(!subnet.includes('/')) return new Error('Invalid Subnet Mask')
    }catch(err){
      return err
    }
  }

  get_range(range){
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

  async ip_scan(range){
    const arr = this.get_range(range)
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

  trace(dest){
    traceroute.trace(dest, function (err,hops) {
      if (!err) console.log(hops)
    })
  }
}

const node = new NodeScan()

async function runScan(){
  const range = myArgs[0]
  const scan = await node.ip_scan(range)
  console.log(scan)
}

runScan()
