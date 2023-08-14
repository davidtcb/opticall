//const { constants } = require('luxafor-api')
import yargs from 'yargs';
import chalk from 'chalk';
import fs from 'fs';
import DeviceRepository from './src/DeviceRepository.js'
import ServerConfig from './src/ServerConfig.js'
import TcpListener from './src/TcpListener.js';
import UdpListener from './src/UdpListener.js';
import OutputFormatter from './src/OutputFormatter.js';
import TcpDiscovery from './src/TcpDiscovery.js';

const args = yargs(process.argv.slice())
    .usage("Usage: -u <udp> -t <tcp>")
    .default("m", 'signal')
    .option("m", {alias: "mode", describe: "Which mode to run it in.", demandOption: true, nArgs: 1, choices: [ 'signal', 'config', 'discover']})
    .option("u", {alias: "udpPort", describe: "UDP port to listen on", type: "number", demandOption: false, nArgs: 1})
    .option("t", {alias: "tcpPort", describe: "TCP port to listen on", type: "number", demandOption: false, nArgs: 1})
    .option("d", {alias: "debug", describe: "Run in debug mode", type: "boolean", demandOption: false})
    .argv

var { udpPort, tcpPort, mode, debug } = args

switch(mode) {
    case 'signal':

    break;

    case 'config':

    break;

    case 'discover':


    break;

    default:

    console.log("Unrecognised mode.")

    break;
}

console.log(udpPort);
console.log(tcpPort);

//console.log(process.versions);

const serverConfig = new ServerConfig(udpPort, tcpPort)

console.log(serverConfig)

//var targetRepository = new TargetRepository()
//targetRepository.reload()
var deviceRepository = new DeviceRepository()

deviceRepository.locate()

var outputFormatter = new OutputFormatter()

var discovery = new TcpDiscovery(serverConfig.tcpPort, serverConfig.broadcastAddress);


console.log(serverConfig.Target);

var targetConfig = JSON.parse(fs.readFileSync(serverConfig.target));

//discovery.start()

var processMessage = function(src, msg, callback) {
       
    if(msg.cmd === 'ping') {
        callback({ "cmd": "echo", "host": "http://" + serverConfig.localIp + ":" + serverConfig.tcpPort + "/"})
        return;

    } else if (msg.cmd === 'echo') {
        console.log(msg.endpoint)
        return;
    }

    var handler = serverConfig.handlers.get(msg.cmd)

    if(!handler) {

        return false;
    }

    deviceRepository.devices.forEach(device => {
    
/*       
        if(!device.config) {
            console.log("No config exists for " + device.path)
            return;
        }
*/
        if(targetConfig.name === msg.target) {
            var color = msg.colour ?? targetConfig.colour;
        } else if (targetConfig.group === msg.target) {
            var color = msg.colour ?? targetConfig.groupColour;
        } else {
            return;
        }

        var resolvedColor = outputFormatter.output(targetConfig, msg, color, handler)

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
var udpServer = new UdpListener(serverConfig.udpPort, serverConfig.udpEnabled, "0.0.0.0");

tcpServer.start(processMessage)
udpServer.start(processMessage)