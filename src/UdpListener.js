const udp = require('dgram');

class UdpListener {
    constructor(udpPort, udpEnabled, bindingIP = '0.0.0.0') {
        this.udpPort = udpPort
        this.udpEnabled = udpEnabled,
        this.bindingIP = bindingIP
    }

    start(processMessage) {
        if (this.udpPort && this.udpEnabled) {

            this.client = udp.createSocket('udp4');
        
            this.client.bind({
                address: this.bindingIP,
                port: this.udpPort,
                exclusive: true
            });
        
            this.client.on('listening', function() {
                console.log("UDP listening") // on " + address.address + ":" + address.port);
            })
            
        
            this.client.on('message', function (message, remote) {
        
                try {
                    var msg = JSON.parse(message);
                } catch(e) {
                    return console.error(e);
                }
                
                processMessage("UDP", msg)
            });
        }
    }
}

module.exports = UdpListener