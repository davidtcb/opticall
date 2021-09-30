const HID = require('node-hid');
const Device = require('./Device.js')

class DeviceLocator {
    constructor(serverConfig) {

        this.devices = [];
        const luxafors = HID.devices();
        
        luxafors.forEach(l => {
        
            if(l.product == 'LUXAFOR FLAG') {
                console.log(l.path)
                var hid = new HID.HID(l.path)
                var targetConfig = serverConfig.targetMap.get(l.path)
        
                if (!targetConfig) {
                    console.log(chalk.redBright("Cannot find device with config path: " + l.path))
                }
        
                var device = new Device(hid, targetConfig)
                this.devices.push(device)
            }
        })
    }
}

module.exports = DeviceLocator