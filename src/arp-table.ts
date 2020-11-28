const {execFile} = require('child_process');

export interface IArpTableClient {
    ip: string,
    mac: string,
}

export class ArpTable {
    readonly GET_IP = /\((.*?)\)/;
    readonly GET_MAC = /at (.*?) /;

    readonly VALID_IP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    readonly VALID_MAC = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

    constructor(private readonly inf: string) {}

    /**
     * Get a list of clients on the arp table
     */
    public getClients = async (): Promise<IArpTableClient[]> => {
        const rawContents = await this.getArpTableContents();
        return rawContents.split('\n')
            .filter(line => line !== '')
            .map(line => {
                // Ensures macs don't start with a one char octet
                let mac = this.GET_MAC.exec(line)?.[1] || '';
                if (mac !== '') mac = mac
                    .split(':')
                    .map(split => (split.length === 1) ? `0${ split.toLowerCase() }` : split.toLowerCase())
                    .join(':');
                if (!this.VALID_MAC.test(mac)) mac = ''; // Validate MAC

                let ip = this.GET_IP.exec(line)?.[1] || '';
                if (!this.VALID_IP.test(ip)) ip = ''; // Validate IP

                return { ip, mac };
            });
    }

    private getArpTableContents = async (): Promise<string> => new Promise((resolve, reject) => {
        const args = ['-a', `-i${this.inf}`];
        execFile('/usr/sbin/arp', args, (err, output) => err ? reject(err) : resolve(output));
    })
}
