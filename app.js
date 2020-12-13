const {NetworkScan} = require('./index.js')

const netScan = new NetworkScan()

async function getMac(){
  let mac = await netScan.macLookup('FC-A1-3E-2A-1C-33')
  console.log(mac)
}
netScan.getSubnet('10.167.4.44/29').then((subnet)=>{
  console.log(subnet)
})
