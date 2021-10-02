const express = require('express');

class TcpListener {
    constructor(tcpPort, tcpEnabled, targetRepository, deviceRepository) {
        this.tcpPort = tcpPort
        this.tcpEnabled = tcpEnabled
        this.targetRepository = targetRepository
        this.deviceRepository = deviceRepository
    }

    start(processMessage) {
        if (this.tcpPort && this.tcpEnabled) {

            this.app = express();
       
            this.app.use(express.json());
        
            this.app.post("/message", (req, res, next) => {
                    
                if (processMessage("HTTP", req.body)) {
                    return res.sendStatus(200);
                } else {
                    return res.sendStatus(400);
                }
            })

            this.app.get("/devices", (req, res) => {
                res.json(this.deviceRepository.paths)
            })

            this.app.get("/targets", (req, res) => {
                res.json(this.targetRepository.targets)
            })

            this.app.get("/targets/:id", (req, res) => {
                
                this.targetRepository.targets.forEach(target => {
    
                    if(target.name === id) {
                        res.json(target)
                    }
                });
            })

            this.app.post("/targets", (req, res) => {
                this.targetRepository.add(req.body)
                return res.sendStatus(200);
            })

            this.app.delete("/targets/:id", (req, res) => {
                
                try {
                    if(this.targetRepository.delete(req.params.id)){
                        res.sendStatus(200); 
                    }
                    else {
                        res.sendStatus(404)
                    }
                } catch (err) {
                    res.sendStatus(500);
                }
            })
        
            this.app.listen(this.tcpPort, () => {
                console.log("REST Server running on port 3000");
            });
        }
    }    
}

module.exports = TcpListener