const udp = require('dgram');
var buffer = require('buffer');

class TcpDiscovery {
    constructor(udpPort, broadcastAddress) {
        this.udpPort = udpPort
        this.broadcastAddress = broadcastAddress
    }

    start() {
        if (this.udpPort) {

            var server = udp.createSocket('udp4');
            var udpPort = this.udpPort
            var broadcastAddress = this.broadcastAddress
            
            var msg = "{ \"cmd\": \"echo\", \"endpoint\": \"\" }"
            var message = Buffer.from(msg)

            server.bind(function() {
                server.setBroadcast(true)
                setInterval(() => {
                    server.send(message, 0, message.length, udpPort, broadcastAddress, () => {
                            console.log("Sent " + msg)
                    })
                }, 5000)
            });

            this.server = server
        }
    }
}

module.exports = TcpDiscovery