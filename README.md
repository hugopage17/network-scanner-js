# NodeJS Network Scanner
A NodeJS library that can perform network diagnostic tests such as latency ping tests, IP address scanning, subnet calculating and SSL certifications and Vendor lookups

## Installation
```bash
npm install --save network-scanner-js
```

## Usage

### Initialize a new Class
```javascript
const NetworkScanner = require('network-scanner-js')
///Using ES6
import NetworkScanner from 'network-scanner-js'

const netScan = new NetworkScanner()
```

### Ping Address
```javascript
const config = {
  repeat:4, //Specifies how many pings to send to the host, if null default is 1
  size:56, //Size of bytes in each packet sent, if null default is 32
  timeout:1 //Specifies the timeout of each ping in seconds, if null default is 1
}

netScan.poll('google.com',config).then((res)=>{
  console.log(res)
})

async function ping(){
  const poll = await netScan.poll('google.com',config)
  console.log(poll)
}
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

### Cluster Ping
```javascript
var array = ['google.com', 'vevadev.co.nz', 'youtube.com', 'wandelapp.com']
netScan.clusterPing(array, nodes => {
  console.log(nodes)
})
```
Expected output
```javascript
[
  {
    host: 'google.com',
    ip_address: '172.217.25.174',
    status: 'online',
    res_avg: '36.000ms',
    times: [ 36 ],
    packet_loss: '0.000'
  },
  {
    host: 'youtube.com',
    ip_address: '142.250.67.14',
    status: 'online',
    res_avg: '37.000ms',
    times: [ 37 ],
    packet_loss: '0.000'
  },
  {
    host: 'vevadev.co.nz',
    ip_address: '65.9.134.126',
    status: 'online',
    res_avg: '14.000ms',
    times: [ 14 ],
    packet_loss: '0.000'
  },
  {
    host: 'wandelapp.com',
    ip_address: '65.9.134.81',
    status: 'online',
    res_avg: '15.000ms',
    times: [ 15 ],
    packet_loss: '0.000'
  }
]
```

### IP Scan
```javascript
netScan.ipScan('192.168.1.0-254', host => {
  console.log(host)
})
```
This will return each online host between the range (192.168.1.0 to 192.168.1.254) one by one

### Traceroute
```javascript
netScan.traceroute('google.com',(hop)=>{
  console.log(hop)
})
```
Expected output
```javascript
{
  hop: 1,
  rtt1: '2 ms',
  rtt2: '2 ms',
  rtt3: '1 ms',
  ip: '192.168.1.254'
}
{
  hop: 2,
  rtt1: '7 ms',
  rtt2: '3 ms',
  rtt3: '3 ms',
  ip: '219.88.156.1'
}
{ hop: 3, rtt1: '*', rtt2: '*', rtt3: '*', ip: 'Request timed out.' }
{
  hop: 4,
  rtt1: '17 ms',
  rtt2: '15 ms',
  rtt3: '15 ms',
  ip: '122.56.113.4'
}
{
  hop: 5,
  rtt1: '15 ms',
  rtt2: '15 ms',
  rtt3: '16 ms',
  ip: '122.56.119.53'
}
{
  hop: 6,
  rtt1: '38 ms',
  rtt2: '39 ms',
  rtt3: '39 ms',
  ip: '202.50.232.110'
}
{
  hop: 7,
  rtt1: '49 ms',
  rtt2: '38 ms',
  rtt3: '39 ms',
  ip: '202.50.232.246'
}
{
  hop: 8,
  rtt1: '40 ms',
  rtt2: '39 ms',
  rtt3: '39 ms',
  ip: '72.14.217.100'
}
{
  hop: 9,
  rtt1: '42 ms',
  rtt2: '39 ms',
  rtt3: '38 ms',
  ip: '108.170.247.33'
}
{
  hop: 10,
  rtt1: '39 ms',
  rtt2: '39 ms',
  rtt3: '39 ms',
  ip: '209.85.243.145'
}
{
  hop: 11,
  rtt1: '40 ms',
  rtt2: '39 ms',
  rtt3: '38 ms',
  ip: '216.58.199.46'
}

```

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
```javascript
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
netScan.getSubnet('192.168.1.0/24').then((net)=>{
  netScan.ipScan(net.host_range, host => {
    console.log(host)
  })
})

async function ipScanSubnet(){
    const subnet = await netScan.getSubnet('192.168.1.0/24')
    netScan.ipScan(subnet.host_range, host => {
      console.log(host)
    })
}
```

### Web Socket Connections
Create a socket server
```javascript
const server = netScan.netServer(PORT)
server.on('connection', socket => {
  socket.emit('request', /*message*/) // emit an event to the socket
  server.emit('broadcast', /*message to all connected sockets*/) // emit an event to all connected sockets
  socket.on('reply', (msg) => {/*recieve message sent from socket*/}) // listen to the event
})
```
Create a socket client
```javascript
const client = netScan.netClient(ServerAddress)
client.emit('reply','message') //send message to the server
client.on('broadcast', (msg)=>{}) //Listen to incoming messages from server over the broadcast path
```

### MAC Address Lookup
Get the vendor of a custom MAC address
```javascript
netScan.macLookup('FC-A1-3E-2A-1C-33').then((vendor)=>{
  console.log(vendor)
})

async function macLook(){
  const vendor = await netScan.macLookup('FC-A1-3E-2A-1C-33')
  console.log(vendor)
}
```

Expected output
```javascript
Samsung Electronics Co.,Ltd
```

### SSL Lookup
Get a websites ssl certificate
```javascript
netScan.getSsl('https://jsonplaceholder.typicode.com/users').then((cert)=>{
  console.log(cert)
})

async function getCert(){
  let ssl = await netScan.getSsl('https://jsonplaceholder.typicode.com/users')
  console.log(ssl)
}
```
Expected output
```javascript
{
  subject: [Object: null prototype] {
    OU: [ 'Domain Control Validated', 'PositiveSSL Wildcard' ],
    CN: '*.nodejs.org'
  },
  issuer: [Object: null prototype] {
    C: 'GB',
    ST: 'Greater Manchester',
    L: 'Salford',
    O: 'Sectigo Limited',
    CN: 'Sectigo RSA Domain Validation Secure Server CA'
  },
  subjectaltname: 'DNS:*.nodejs.org, DNS:nodejs.org',
  infoAccess: [Object: null prototype] {
    'CA Issuers - URI': [
      'http://crt.sectigo.com/SectigoRSADomainValidationSecureServerCA.crt'
    ],
    'OCSP - URI': [ 'http://ocsp.sectigo.com' ]
  },
  modulus: 'B56CE45CB740B09A13F64AC543B712FF9EE8E4C284B542A1708A27E82A8D151CA178153E12E6DDA15BF70FFD96CB8A88618641BDFCCA03527E665B70D779C8A349A6F88FD4EF6557180BD4C98192872BCFE3AF56E863C09DDD8BC1EC58DF9D94F914F0369102B2870BECFA1348A0838C9C49BD1C20124B442477572347047506B1FCD658A80D0C44BCC16BC5C5496CFE6E4A8428EF654CD3D8972BF6E5BFAD59C93006830B5EB1056BBB38B53D1464FA6E02BFDF2FF66CD949486F0775EC43034EC2602AEFBF1703AD221DAA2A88353C3B6A688EFE8387811F645CEED7B3FE46E1F8B9F59FAD028F349B9BC14211D5830994D055EEA3D547911E07A0ADDEB8A82B9188E58720D95CD478EEC9AF1F17BE8141BE80906F1A339445A7EB5B285F68039B0F294598A7D1C0005FC22B5271B0752F58CCDEF8C8FD856FB7AE21C80B8A2CE983AE94046E53EDE4CB89F42502D31B5360771C01C80155918637490550E3F555E2EE75CC8C636DDE3633CFEDD62E91BF0F7688273694EEEBA20C2FC9F14A2A435517BC1D7373922463409AB603295CEB0BB53787A334C9CA3CA8B30005C5A62FC0715083462E00719A8FA3ED0A9828C3871360A73F8B04A4FC1E71302844E9BB9940B77E745C9D91F226D71AFCAD4B113AAF68D92B24DDB4A2136B55A1CD1ADF39605B63CB639038ED0F4C987689866743A68769CC55847E4A06D6E2E3F1',
  bits: 4096,
  exponent: '0x10001',
  pubkey: <Buffer 30 82 02 22 30 0d 06 09 2a 86 48 86 f7 0d 01 01 01 05 00 03 82 02 0f 00 30 82 02 0a 02 82 02 01 00 b5 6c e4 5c b7 40 b0 9a 13 f6 4a c5 43 b7 12 ff 9e ... 500 more bytes>,
  valid_from: 'Oct 21 00:00:00 2019 GMT',
  valid_to: 'Jan 18 23:59:59 2022 GMT',
  fingerprint: '04:03:3E:4A:27:E0:F8:C4:5B:F0:67:AC:59:E5:44:3A:83:42:7A:F5',
  fingerprint256: 'D6:5F:FB:A8:A5:73:B9:A8:B9:6C:10:79:21:51:08:A4:7A:13:F5:E1:24:15:39:4F:C6:D0:6F:16:44:CC:1C:42',
  ext_key_usage: [ '1.3.6.1.5.5.7.3.1', '1.3.6.1.5.5.7.3.2' ],
  serialNumber: 'C2A4BC8EC1EF093589F3863B9EB4581F',
  raw: <Buffer 30 82 07 71 30 82 06 59 a0 03 02 01 02 02 11 00 c2 a4 bc 8e c1 ef 09 35 89 f3 86 3b 9e b4 58 1f 30 0d 06 09 2a 86 48 86 f7 0d 01 01 0b 05 00 30 81 8f ... 1859 more bytes>,
  pemEncoded: '-----BEGIN CERTIFICATE-----\n' +
    'MIIHcTCCBlmgAwIBAgIRAMKkvI7B7wk1ifOGO560WB8wDQYJKoZIhvcNAQELBQAw\n' +
    'gY8xCzAJBgNVBAYTAkdCMRswGQYDVQQIExJHcmVhdGVyIE1hbmNoZXN0ZXIxEDAO\n' +
    'BgNVBAcTB1NhbGZvcmQxGDAWBgNVBAoTD1NlY3RpZ28gTGltaXRlZDE3MDUGA1UE\n' +
    'AxMuU2VjdGlnbyBSU0EgRG9tYWluIFZhbGlkYXRpb24gU2VjdXJlIFNlcnZlciBD\n' +
    'QTAeFw0xOTEwMjEwMDAwMDBaFw0yMjAxMTgyMzU5NTlaMFkxITAfBgNVBAsTGERv\n' +
    'bWFpbiBDb250cm9sIFZhbGlkYXRlZDEdMBsGA1UECxMUUG9zaXRpdmVTU0wgV2ls\n' +
    'ZGNhcmQxFTATBgNVBAMMDCoubm9kZWpzLm9yZzCCAiIwDQYJKoZIhvcNAQEBBQAD\n' +
    'ggIPADCCAgoCggIBALVs5Fy3QLCaE/ZKxUO3Ev+e6OTChLVCoXCKJ+gqjRUcoXgV\n' +
    'PhLm3aFb9w/9lsuKiGGGQb38ygNSfmZbcNd5yKNJpviP1O9lVxgL1MmBkocrz+Ov\n' +
    'VuhjwJ3di8HsWN+dlPkU8DaRArKHC+z6E0igg4ycSb0cIBJLRCR3VyNHBHUGsfzW\n' +
    'WKgNDES8wWvFxUls/m5KhCjvZUzT2Jcr9uW/rVnJMAaDC16xBWu7OLU9FGT6bgK/\n' +
    '3y/2bNlJSG8HdexDA07CYCrvvxcDrSIdqiqINTw7amiO/oOHgR9kXO7Xs/5G4fi5\n' +
    '9Z+tAo80m5vBQhHVgwmU0FXuo9VHkR4HoK3euKgrkYjlhyDZXNR47smvHxe+gUG+\n' +
    'gJBvGjOURafrWyhfaAObDylFmKfRwABfwitScbB1L1jM3vjI/YVvt64hyAuKLOmD\n' +
    'rpQEblPt5MuJ9CUC0xtTYHccAcgBVZGGN0kFUOP1VeLudcyMY23eNjPP7dYukb8P\n' +
    'dognNpTu66IML8nxSipDVRe8HXNzkiRjQJq2Aylc6wu1N4ejNMnKPKizAAXFpi/A\n' +
    'cVCDRi4AcZqPo+0KmCjDhxNgpz+LBKT8HnEwKETpu5lAt350XJ2R8ibXGvytSxE6\n' +
    'r2jZKyTdtKITa1WhzRrfOWBbY8tjkDjtD0yYdomGZ0Omh2nMVYR+SgbW4uPxAgMB\n' +
    'AAGjggL7MIIC9zAfBgNVHSMEGDAWgBSNjF7EVK2K4Xfpm/mbBeG4AY1h4TAdBgNV\n' +
    'HQ4EFgQUcMdzKdAgAd58S29IuEIabcmg6jcwDgYDVR0PAQH/BAQDAgWgMAwGA1Ud\n' +
    'EwEB/wQCMAAwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMEkGA1UdIARC\n' +
    'MEAwNAYLKwYBBAGyMQECAgcwJTAjBggrBgEFBQcCARYXaHR0cHM6Ly9zZWN0aWdv\n' +
    'LmNvbS9DUFMwCAYGZ4EMAQIBMIGEBggrBgEFBQcBAQR4MHYwTwYIKwYBBQUHMAKG\n' +
    'Q2h0dHA6Ly9jcnQuc2VjdGlnby5jb20vU2VjdGlnb1JTQURvbWFpblZhbGlkYXRp\n' +
    'b25TZWN1cmVTZXJ2ZXJDQS5jcnQwIwYIKwYBBQUHMAGGF2h0dHA6Ly9vY3NwLnNl\n' +
    'Y3RpZ28uY29tMCMGA1UdEQQcMBqCDCoubm9kZWpzLm9yZ4IKbm9kZWpzLm9yZzCC\n' +
    'AX8GCisGAQQB1nkCBAIEggFvBIIBawFpAHYARqVV63X6kSAwtaKJafTzfREsQXS+\n' +
    '/Um4havy/HD+bUcAAAFt7HZX/QAABAMARzBFAiEA/JfRdgojVXOzY1DqmquU+JZH\n' +
    'v3Ba4BQ9/pKOkQglexQCIC00R9cVU8gSAcQR9YiYH4vkUDvlV99JwC6lvsBZhlBV\n' +
    'AHcAVYHUwhaQNgFK6gubVzxT8MDkOHhwJQgXL6OqHQcT0wwAAAFt7HZXvQAABAMA\n' +
    'SDBGAiEA2sos0RKERlwYFqVzk1DHz0W53s6BMfbfL8QTWRxMap4CIQCbdZAxS6iQ\n' +
    'oU2fkUODIcp6xh4vqAy09PZUHcb4sgb96AB2ACJFRQdZVSRWlj+hL/H3bYbgIyZj\n' +
    'rcBLf13Gg1xu4g8CAAABbex2WPoAAAQDAEcwRQIhAKbVltxU+9mSqLsWmX/BGxQg\n' +
    '4iPTPTkXx/EXIXvkpsBBAiBT8gPtJJbBa3fvH3U7VK7IkdbIqjIHU98ZzJ40s7nx\n' +
    '4DANBgkqhkiG9w0BAQsFAAOCAQEAoE9eN9FNI5aBig17+dTPHawCV/rPiFcEAVbd\n' +
    'TeNnUj+fZVurs2N4oaslxa05mfukp4kUdJoGo7lokoTgwThqwJi65cqdTzKv2s5v\n' +
    'DmKP8L7RLlsLcLeiPlS5ubrhEe7tqk69vlg1mHcHcMKZZQG5n5T5f/crPesXjXl2\n' +
    'IqvfwJqF0EYYeE32RGX5RV7TfSFiaGx1Up5b189qY8+OlJSQOj7YKzQee1hVcv3S\n' +
    '7rTROCbK4x0DAdh5xRVWNFKae/Kok5dDNqHV39eT6YqO4GJwWscW70X/Vyp026P7\n' +
    'I7IcTYEe5ZxyFk8t5aowJIVo5KcCHpfXOlkjXluQYfNSIkZNyA==\n' +
    '-----END CERTIFICATE-----'
}
```

## Contributing
NodeJS Network Scanner is an open source project and the repository can be cloned from [github](https://github.com/hugopage17/network-scan)
