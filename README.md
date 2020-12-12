# NodeJS Network Scanner
NodeJS library that performs basic network diagnostics such as latency ping tests, IP address scanning and subnet calculating

## Installation
```bash
npm install network-scanjs
```
or
```bash
yarn install network-scanjs
```

## Usage

### Initialize a new Class
```javascript
const {NetworkScan} = require('network-scanjs')
const netScan = new NetworkScan()
```

### Ping Address
```javascript
const config = {
  repeat:4, //Specifies how many pings to send to the host, if null default is 1
  size:56, //Size of bytes in each packet sent, if null default is 32
  timeout:1 //Specifies the timeout of each ping in seconds, if null default is 1
}

async function ping(){
  const poll = await netScan.poll('google.com',config)
  console.log(poll)
}

netScan.poll('google.com',config).then((res)=>{
  console.log(res);
})
```
Expected output
```javascript
{
  host: 'google.com',
  ip_address: '172.217.167.78',
  status: 'online',
  res_avg: '35.000ms',
  times: [ 36, 35, 35, 36 ],
  packetLoss: '0.000'
}
```

### IP Scan
```javascript
netScan.ipScan('192.168.1.0-24').then((hosts)=>{
  console.log(hosts)
})

async function runScan(){
  const scan = await netScan.ipScan('192.168.1.0-24')
  console.log(scan)
}
```
This will return an array of all the online hosts between the range (192.168.1.0 to 192.168.1.24)

### Subnet Calculator
```javascript
netScan.getSubnet('192.168.1.0/24').then((net)=>{
    console.log(net)
})

async function getSubnet(){
    const subnet = await netScan.getSubnet('192.168.1.0/24')
    console.log(subnet)
}
```
Expected output
```bash
{
  subnet: '192.168.1.0/24',
  subnet_bits: 24,
  subnet_mask: '255.255.255.0',
  network_address: '192.168.1.0',
  broadcast_address: '192.168.1.255',
  first_host: '192.168.1.1',
  last_host: '192.168.1.254',
  available_hosts: 254,
  host_range: '192.168.1.1-254'
}
```

Use different functions together
```javascript
async function ipScanSubnet(){
    const subnet = await netScan.getSubnet('192.168.1.0/24')
    netScan.ipScan(subnet.host_range).then((hosts)=>{
      console.log(hosts)
    })
}
```

## Contributing
NodeJS Network Scanner is an open source project and the repository can be cloned from [github](https://github.com/hugopage17/network-scan)
