const HID = require('node-hid');
const Device = require('./Device.js')
const chalk = require('chalk');

class DeviceRepository {
    constructor() {
    }

    locate(targetRepository) {
        
        this.devices = [];
        this.paths = []
        var luxafors = HID.devices();
        
        luxafors.forEach(l => {
        
            if(l.product == 'LUXAFOR FLAG') {
                console.log(l.path)
                var hid = new HID.HID(l.path)

                this.paths.push(l.path)
                
                var targetConfig = targetRepository.targetMap.get(l.path)
        
                if (!targetConfig) {
                    console.log(chalk.redBright("Cannot find device with config path: " + l.path))
                }
        
                var device = new Device(hid, targetConfig, l.path)
                this.devices.push(device)
            }
        })
    }
}

module.exports = DeviceRepository