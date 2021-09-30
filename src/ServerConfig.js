const config = require('config')

class ServerConfig {
    constructor(udpPort, bindingIP, tcpPort) {
        this.flashSpeed = this._safeGetConfig("Light.Flash.speed");
        this.flashRepeat = this._safeGetConfig("Light.Flash.repeat");
        this.waveSpeed = this._safeGetConfig("Light.Wave.speed");
        this.waveRepeat = this._safeGetConfig("Light.Wave.repeat");
        this.udpPort = udpPort ?? this._safeGetConfig('Network.UDP.port')
        this.bindingIP = bindingIP ?? this._safeGetConfig('Network.UDP.bindingAddress')
        this.tcpPort = tcpPort ?? this._safeGetConfig('Network.TCP.port')
        this.tcpEnabled = this._safeGetConfig('Network.TCP.enabled')
        this.udpEnabled = this._safeGetConfig('Network.UDP.enabled')

        this.targetMap = new Map()
        var targets = this._safeGetConfig("Targets")

        targets.forEach(t => {
            this.targetMap.set(t.id, t)
        })

        this.handlers = new Map()

        var handlerList = this._safeGetConfig("Handlers")

        handlerList.forEach(h => {
            this.handlers.set(h.cmd, h)
        })
    }

    _safeGetConfig = (configEntry) => {
    
        if(config.has(configEntry)) {
            var configValue = config.get(configEntry)
            return configValue
        }
        else {
            console.log(chalk.yellow("Cannot read config entry: " + configEntry))
        }
    }
}

module.exports = ServerConfig