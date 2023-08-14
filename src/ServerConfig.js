import config from 'config';
import chalk from 'chalk';
import os from  'os' ;
import broadcastAddress from'broadcast-address';

class ServerConfig {
    constructor(udpPort, tcpPort) {
        this.udpPort = udpPort ?? this._safeGetConfig('Network.UDP.port')
        this.discoveryPort = this._safeGetConfig('Network.UDP.discovery')
        this.networkPrefix = this._safeGetConfig('Network.networkPrefix')
        this.tcpPort = tcpPort ?? this._safeGetConfig('Network.TCP.port')

        //this.targetMap = new Map()
        this.targets = this._safeGetConfig("Targets")

        //targets.forEach(t => {
        //    this.targetMap.set(t.id, t)
        //})

        this.handlers = new Map()

        var handlerList = this._safeGetConfig("Handlers")

        handlerList.forEach(h => {
            this.handlers.set(h.cmd, h)
        })

        var networkInterfaces = os.networkInterfaces();

        for(var key in networkInterfaces) {
        
            var networkInterface = networkInterfaces[key]

            networkInterface.forEach(ni => {
                if(ni.address.startsWith(this.networkPrefix)) {
                    this.localIp = ni.address
                    this.broadcastAddress =  broadcastAddress(key)
                }
            })
        }
    }

    _safeGetConfig = (configEntry) => {
    
        if(config.has(configEntry)) {
            var configValue = config.get(configEntry)
            return configValue
        }
        else {
            console.log(chalk.red("Cannot read config entry: " + configEntry))
        }
    }
}

export default ServerConfig
//module.exports = ServerConfig