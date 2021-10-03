const udp = require('dgram');
var buffer = require('buffer');

class UdpListener {
    constructor(udpPort, udpEnabled, bindingIP = '0.0.0.0') {
        this.udpPort = udpPort
        this.udpEnabled = udpEnabled,
        this.bindingIP = bindingIP
    }

    start(processMessage) {
        if (this.udpPort && this.udpEnabled) {

            var client = udp.createSocket('udp4');
            var udpPort = this.udpPort
            var bindingIP = this.bindingIP + "255"

            client.bind({
                address: "0.0.0.0",
                port: this.udpPort,
                exclusive: false
            });
        
            client.on('listening', function() {
                console.log("UDP listening") // on " + address.address + ":" + address.port);
            })
            
            client.on('message', function (message, remote) {
        
                try {
                    var msg = JSON.parse(message);
                } catch(e) {
                    return console.error(e);
                }
                
                processMessage("UDP", msg, (data) => {
                    
                    var buff = Buffer.from(JSON.stringify(data))
                    
                    client.send(buff, 0, buff.length, udpPort, bindingIP, (err) => {
                        
                        if(err) {
                            console.log("ERROR: " + err)
                        }
                    })
                })
            });

            this.client = client
        }
    }
}

module.exports = UdpListener