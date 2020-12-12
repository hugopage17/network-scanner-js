const {NetworkScan} = require('./index.js')

const netScan = new NetworkScan()


const config = {
  repeat:4, //Specifies how many pings to send to the host, if null default is 1
  size:56, //Size of bytes in each packet sent, if null default is 32
  timeout:1 //Specifies the timeout of each ping in seconds, if null default is 1
}

async function runPing(){
  let ping = await netScan.poll('10.167.4.44')
  console.log(ping)
}

async function getSubnet(){
  const subnet = await netScan.getSubnet('10.167.4.44/29')
  console.log(subnet)
}

getSubnet()
