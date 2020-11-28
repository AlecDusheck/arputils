const { get_active_interface, get_interfaces_list, gateway_ip_for } = require('network');

export interface IInterface {
    name: string,
    type: string,
    ip_address: string,
    mac_address: string,
    gateway_ip: string,
    netmask: string
}

export class NetworkUtils {
    /**
     * Get the devices default interface
     */
    public static getDefaultInterface = async (): Promise<IInterface> =>
        await NetworkUtils.promisefy(get_active_interface) as unknown as IInterface;

    /**
     * Get details about an interface
     * @param inf interface name
     */
    public static getInterface = async (inf: string): Promise<IInterface | undefined> => {
        const interfaces = await NetworkUtils.promisefy(get_interfaces_list) as unknown as IInterface[];
        return interfaces.find(x => x.name === inf);
    }

    /**
     * Get gateway ip for an interface
     * @param inf interface name
     */
    public static getGatewayIp = async (inf: string): Promise<string> => await NetworkUtils.promisefy(gateway_ip_for, inf) as unknown as string

    private static promisefy = (func: Function, ...args: any) => {
        return  new Promise((resolve, reject) => func(...args, (err, res) => err ? reject(err) : resolve(res)))
    }
}
