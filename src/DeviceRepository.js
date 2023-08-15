import HID from 'node-hid';
import Device from './Device.js';
import chalk from 'chalk';


class DeviceRepository {
    constructor() {
    }

    locate() {
        
        this.devices = [];
        var luxafors = HID.devices();
        
        luxafors.forEach(l => {
        
            if(l.product == 'LUXAFOR FLAG') {
                console.log(chalk.blueBright("Located Luxafor device: " + l.path))
                var hid = new HID.HID(l.path)
                var device = new Device(hid)
                this.devices.push(device)
            }
        })
    }
}

export default DeviceRepository
//module.exports = DeviceRepository


