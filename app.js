const { constants } = require('luxafor-api')
const yargs = require('yargs');
const chalk = require('chalk');
const { option, config } = require('yargs');
const { Console } = require('console');
const DeviceLocator = require('./src/DeviceLocator.js')
const ServerConfig = require('./src/ServerConfig.js')
const TcpListener = require('./src/TcpListener.js');
const UdpListener = require('./src/UdpListener.js');
const OutputFormatter = require('./src/OutputFormatter.js');

const args = yargs
    .usage("Usage: -u <udp> -t <tcp>")
    .option("u", {alias: "udpPort", describe: "UDP port to listen on", type: "number", demandOption: false, nArgs: 1})
    .option("t", {alias: "tcpPort", describe: "TCP port to listen on", type: "number", demandOption: false, nArgs: 1})
    .option("b", {alias: "bindingIP", describe: "IP of the adapter to bind to", type: "string", demandOption: false})
    .option("d", {alias: "debug", describe: "Run in debug mode", type: "boolean", demandOption: false})
    .argv

var { udpPort, tcpPort, bindingIP, debug } = args

const serverConfig = new ServerConfig(udpPort, bindingIP, tcpPort)

var deviceLocator = new DeviceLocator(serverConfig)
var outputFormatter = new OutputFormatter()

var processMessage = function(src, msg) {
    
    var handler = serverConfig.handlers.get(msg.cmd)

    if(!handler) {
        return false;
    }

    deviceLocator.devices.forEach(device => {
    
        if(device.config.name === msg.target) {
            var color = msg.colour ?? device.config.colour;
        } else if (device.config.group === msg.target) {
            var color = msg.colour ?? device.config.groupColour;
        } else {
            return;
        }

        var resolvedColor = outputFormatter.output(device.config, msg, color, handler)

        var speed = msg.speed ?? handler.speed
        var repeat = msg.repeat ?? handler.repeat

        try {
            switch(msg.cmd) {
                case 'flash':
                    device.flash(resolvedColor, speed, repeat);
                    break;

                case 'wave':
                    device.wave(resolvedColor, constants.WAVE_SHORT, speed, repeat);
                    break;
                
                case 'on':
                    device.color(resolvedColor);
                    break;

                case 'off':
                    device.off();
                    break;

                default:
                    console.log(chalk.bgRed("Unrecognised command"));
            }
        } catch(e) {
            console.log(chalk.red(src + " - Cannot run " + msg.cmd + " command"));
            console.log(chalk.grey(e));
        }
    });

    return true;
}

var tcpServer = new TcpListener(serverConfig.tcpPort, serverConfig.tcpEnabled);
var udpServer = new UdpListener(serverConfig.udpPort, serverConfig.udpEnabled, serverConfig.bindingIP);

tcpServer.start(processMessage)
udpServer.start(processMessage)