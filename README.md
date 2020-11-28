# arputils

## Send/read ARP network data with Node.JS!
This package gives several utilities to send special ARP packets and read the ARP tables on the local network.

#### Why?
arputils makes it easy to read system arp tables for a wide-use case. In particular, it supports mitm-arp spoofing, which is useful for research.

This package uses completely modern javascript. It makes full use of async/await and all es6 syntax. This makes the code very clean.

In addition, everything is written in TypeScript. Types are all available which makes documentation very strong.

There is a package on npm called
#### ARP Spoofing
It's easy to launch an ARP spoofing attack.
```
const arpSpoof = new ArpSpoof('en0');

    setInterval(async () => {
        await arpSpoof.poison('10.0.0.1', '10.0.0.7');
        await arpSpoof.poison('10.0.0.7', '10.0.0.1');
    }, 2 * 1000);
```

There are also network utils to make this easier, for example, you can automatically get the gateway ip or default interface:

```
const interface = await NetworkUtils.getDefaultInterface();

const gatewayIp = await NetworkUtils.getGatewayIp(interface.name);
```

#### Reading ARP Tables
Once again, this is very easy.
```
const arpTables = new ArpTable('en0');
const clients = arpTables.getClients();
clients.forEach(client => console.log(client.ip);
```

#### Sending raw data
Yes, it's possible.

```
const arpSpoof = new ArpSpoof('en0');
await arpSpoof.sendRawPacket({
    'op': 'reply',
    'src_ip': srcIp,
    'dst_ip': dstIp,
    'dst_mac': 'ff:ff:ff:ff:ff:ff'
});
```

#### Credit
This package is based off the arpjs package, written by skepticfx.

This package was made due to the fact it was based on callbacks and had rather poor code quality.
