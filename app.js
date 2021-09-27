const HID = require('node-hid');
const { constants } = require('luxafor-api')
const yargs = require('yargs');
const config = require('config')
const chalk = require('chalk');
const boxen = require('boxen');
const express = require('express');
const udp = require('dgram');
const Device = require('./Device.js')

const { option } = require('yargs');
const { Console } = require('console');

const args = yargs
    .usage("Usage: -u <udp> -t <tcp>")
    .option("u", {alias: "udpPort", describe: "UDP port to listen on", type: "number", demandOption: false, nArgs: 1})
    .option("t", {alias: "tcpPort", describe: "TCP port to listen on", type: "number", demandOption: false, nArgs: 1})
    .option("b", {alias: "bindingIP", describe: "IP of the adapter to bind to", type: "string", demandOption: false})
    .argv

var { udpPort, tcpPort, bindingIP } = args

var safeGetConfig = (configEntry) => {
    
    if(config.has(configEntry)) {
        configValue = config.get(configEntry)
        return configValue
    }
    else {
        console.log(chalk.yellow("Cannot read config entry: " + configEntry))
    }
}

var flashSpeed = safeGetConfig("Flash.speed");
var flashRepeat = safeGetConfig("Flash.repeat");
var waveSpeed = safeGetConfig("Wave.speed");
var waveRepeat = safeGetConfig("Wave.repeat");

if(!udpPort) {
    udpPort = safeGetConfig('UDP.port')

    if(!bindingIP) {
        bindingIP = safeGetConfig('UDP.bindingAddress')
    }
}

if(!tcpPort) {
    tcpPort = safeGetConfig('TCP.port')
}

var tcpEnabled = safeGetConfig('TCP.enabled')
var udpEnabled = safeGetConfig('UDP.enabled')

//const luxafor = device();

//if(!luxafor) {
//    console.log(chalk.bgRed("Cannot find Luxafor device ... you can test stuff but don't expect anything to happen!"));
//}

const targetMap = new Map()
var targets = safeGetConfig("Targets")

targets.forEach(t => {
    targetMap.set(t.id, t)
})

var devices = [];
const luxafors = HID.devices();

luxafors.forEach(l => {

    if(l.product == 'LUXAFOR FLAG') {
        console.log(l.path)
        var hid = new HID.HID(l.path)
        var targetConfig = targetMap.get(l.path)
        var device = new Device(hid, targetConfig)
        devices.push(device)
    }
})

var processMessage = function(src, msg) {
    
    devices.forEach(device => {
    
        if(device.config.name === msg.target) {
            var color = msg.colour ?? device.config.colour;
        } else if (device.config.group === msg.target) {
            var color = msg.colour ?? device.config.groupColour;
        } else {
            return;
        }
        
        var fs = flashSpeed
        var fr = flashRepeat
        var ws = waveSpeed
        var wr = waveRepeat

        if(msg.speed) {
            fs = msg.speed
            ws = msg.speed
        }

        if(msg.repeat) {
            fr = msg.repeat
            wr = msg.repeat
        }

        switch(msg.cmd) {
            case 'flash':
                
                if(!color) {
                    return true;
                }

                console.log(boxen(chalk.hex(color).inverse(src), {borderColor: color, borderStyle: 'classic', padding:1, margin:1}));

                try {
                    if(device) {
                        device.flash(color, fs, fr, 0xFF);
                    }
            
                    return true;
                } catch(e) {
                    
                    console.log(chalk.red(src + " - Cannot run FLASH command"));
                    console.log(chalk.grey(e));
                    return false;
                } 

            case 'wave':

                if(!color) {
                    return true;
                }

                console.log(boxen(chalk.hex(color).inverse(src), {borderColor: color, borderStyle: 'doubleSingle', padding:1, margin:1}));

                try {
                    if(device) {
                        device.wave(color, constants.WAVE_SHORT_OVERLAPPING, ws, wr);
                    }
            
                    return true;
                } catch(e) {
                    
                    console.log(chalk.red(src + " - Cannot run WAVE command"));
                    console.log(chalk.grey(e));
                    return false;
                } 
            
            case 'on':

                if(!color) {
                    return true;
                }
            
                console.log(boxen(chalk.hex(color).inverse(src), {borderColor: color, borderStyle: 'double'}));

                try {
                    if(device) {
                        device.color(color, 0xFF);
                    }
            
                    return true;
                } catch(e) {
                    
                    console.log(chalk.red(src + " - Cannot run ON command"));
                    console.log(chalk.grey(e));
                    return false;
                } 

            case 'off':
                console.log(boxen(src));

                if(device) {
                    device.off();
                }
                return true;

            default:
                console.log(chalk.bgRed("Unrecognised command"));
        }
    });

    return true;
}

if (tcpPort && tcpEnabled) {

    var app = express();

    app.use(express.json());

    app.post("/message", (req, res, next) => {
            
        if (processMessage("HTTP", req.body)) {
            return res.sendStatus(200);
        } else {
            return res.sendStatus(400);
        }
    })

    app.listen(tcpPort, () => {
        console.log("REST Server running on port 3000");
    });
}

if (udpPort && udpEnabled) {

    var client = udp.createSocket('udp4');

    if (bindingIP) {
        client.bind({
            address: bindingIP,
            port: udpPort,
            exclusive: true
        });
    } else {
        client.bind({
            address: '0.0.0.0',
            port: udpPort,
            exclusive: true
        });
    }   

    client.on('listening', function() {
        var address = client.address();
        console.log("UDP listening on " + address.address + ":" + address.port);
    })

    client.on('message', function (message, remote) {

        try {
            var msg = JSON.parse(message);
        } catch(e) {
            return console.error(e);
        }
        
        processMessage("UDP", msg)
    });
}