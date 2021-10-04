const udp = require('dgram');
var buffer = require('buffer');
const { showCompletionScript } = require('yargs');

class UdpListener {
    constructor(udpPort, bindingAddress) {
        this.udpPort = udpPort
        this.bindingAddress = bindingAddress
    }

    start(processMessage) {
        if (this.udpPort) {

            var client = udp.createSocket('udp4');
            var udpPort = this.udpPort
            var bindingAddress = this.bindingAddress

            client.bind({
                address: bindingAddress,
                port: udpPort,
                exclusive: false
            });
        
            client.on('listening', function() {
                console.log("UDP listening") // on " + address.address + ":" + address.port);
            })
            
            client.on('message', function (message, remote) {
        
                try {
                    var msg = JSON.parse(message);
                } catch(e) {
                    console.log(message.toString())
                    return console.error(e);
                }
                
                processMessage("UDP", msg, (data) => {
                    
                    /*var buff = Buffer.from(JSON.stringify(data))
                    
                    client.send(buff, 0, buff.length, udpPort, localIp, (err) => {
                        
                        if(err) {
                            console.log("ERROR: " + err)
                        }
                    })*/
                })
            });

            this.client = client
        }
    }
}

module.exports = UdpListener