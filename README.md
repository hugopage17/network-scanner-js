# NodeJS Network Scanner

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
async function ping(){
  const poll = await netScan.poll('192.168.1.254')
  console.log(poll)
}

netScan.poll('192.168.1.254').then((res)=>{
  console.log(res);
})
```
Expected output
```javascript
 { status: 'online', time: '0.1ms' }
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
    console.log(net);
})

async function getSubnet(){
    const subnet = await netScan.getSubnet('192.168.1.0/24')
    console.log(subnet);
}
```
Expected output
```bash
{
  status: 'OK',
  meta: {
    permalink: 'https://networkcalc.com/subnet-calculator/192.168.1.0/24',
    next_address: 'https://networkcalc.com/api/ip/192.168.1.1/24?binary=1'
  },
  address: {
    cidr_notation: '192.168.1.0/24',
    subnet_bits: 24,
    subnet_mask: '255.255.255.0',
    wildcard_mask: '0.0.0.255',
    network_address: '192.168.1.0',
    broadcast_address: '192.168.1.255',
    assignable_hosts: 254,
    first_assignable_host: '192.168.1.1',
    last_assignable_host: '192.168.1.254',
    binary: {
      octet_1: '00000001',
      octet_2: '00000001',
      octet_3: '00000001',
      octet_4: '00000000',
      address: '11000000 10101000 00000001 00000000',
      subnet_mask: '11111111 11111111 11111111 00000000',
      wildcard_mask: '00000000 00000000 00000000 11111111',
      network_address: '11000000 10101000 00000001 00000000',
      broadcast_address: '11000000 10101000 00000001 11111111',
      first_assignable_host: '11000000 10101000 00000001 00000001',
      last_assignable_host: '11000000 10101000 00000001 11111110'
    }
  }
}
```
