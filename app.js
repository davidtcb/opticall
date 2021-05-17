const { device, devices } = require('luxafor-api')
const yargs = require('yargs');
const config = require('config')
const chalk = require('chalk');
const boxen = require('boxen');
var express = require('express');
var udp = require('dgram');

const { option } = require('yargs');

const args = yargs
    .usage("Usage: -u <udp> -t <tcp>")
    .option("u", {alias: "udpPort", describe: "UDP port to listen on", type: "number", demandOption: false, nArgs: 1})
    .option("t", {alias: "tcpPort", describe: "TCP port to listen on", type: "number", demandOption: false, nArgs: 1})
    .option("b", {alias: "bindingIP", describe: "IP of the adapter to bind to", type: "string", demandOption: false})
    .argv

var { udpPort, tcpPort, bindingIP } = args

if(!udpPort) {
    udpPort = config.get('UDP.port')
}

if(!bindingIP) {
    bindingIP = config.get('UDP.bindingAddress')
}

if(!tcpPort) {
    tcpPort = config.get('TCP.port')
}

var channel = config.get('Intercom.channel')
var solo = config.get('Intercom.solo')

var tcpEnabled = config.get('TCP.enabled')
var udpEnabled = config.get('UDP.enabled')

const luxafor = device();

if(!luxafor) {
    console.log(chalk.bgRed("Cannot find Luxafor device ... you can test stuff but don't expect anything to happen!"))
}


var processMessage = function(src, msg) {

    if (msg.target == solo) {
        var color = msg.solo

    } else if (msg.target == channel) {
        var color = msg.channel
    }

    switch(msg.command) {
        case 'flash':
            
            if(!color) {
                return true;
            }

            console.log(boxen(chalk.hex(color).inverse(src), {borderColor: color, borderStyle: 'classic'}))

            try {
                if(luxafor) {
                    luxafor.flash(color, 10, 255)
                }
        
                return true;
            } catch(e) {
                
                console.log(chalk.red(src + " - Cannot run FLASH command"))
                console.log(chalk.grey(e))
                return false;
            } 
        
        break

        case 'on':

            if(!color) {
                return true;
            }
        
            console.log(boxen(chalk.hex(color).inverse(src), {borderColor: color, borderStyle: 'double'}))

            try {
                if(luxafor) {
                    luxafor.color(color)
                }
        
                return true;
            } catch(e) {
                
                console.log(chalk.red(src + " - Cannot run ON command"))
                console.log(chalk.grey(e))
                return false;
            } 


        case 'stop':
            console.log(boxen(src))

            if(luxafor) {
                luxafor.off()
            }
            return true;
        break;


        default:
            console.log(chalk.bgRed("Unrecognised command"))
    }
  
};

if (tcpPort && tcpEnabled) {

    var app = express();

    app.use(express.json())

    app.post("/message", (req, res, next) => {
            
        if (processMessage("HTTP", req.body)) {
            return res.sendStatus(200)
        } else {
            return res.sendStatus(400)
        }
    })

    app.listen(tcpPort, () => {
        console.log("REST Server running on port 3000")
    });
}

if (udpPort && udpEnabled) {

    var client = udp.createSocket('udp4')

    if (bindingIP) {
        client.bind({
            address: bindingIP,
            port: udpPort,
            exclusive: true
        })
    } else {
        client.bind({
            address: '127.0.0.1',
            port: udpPort,
            exclusive: true
        })
    }   

    client.on('listening', function() {
        var address = client.address()
        console.log("UDP listening on " + address.address + ":" + address.port)
    })

    client.on('message', function (message, remote) {

        try {
            var msg = JSON.parse(message)
        } catch(e) {
            return console.error(e)
        }
        
        processMessage("UDP", msg)
    });
}



