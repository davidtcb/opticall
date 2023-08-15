import express from 'express';
import fs from 'fs';

class TcpListener {
    constructor(tcpPort, commandHistory, targetConfig, targetConfigPath) {
        this.tcpPort = tcpPort
        this.commandHistory = commandHistory
        this.targetConfig = targetConfig
        this.targetConfigPath = targetConfigPath
    }

    start(processMessage) {
        if (this.tcpPort) {

            console.log("Starting TCP server");
            this.app = express();
       
            this.app.use(express.json());
        
            this.app.post("/message", (req, res, next) => {
                    
                console.log(req.body);
                
                if (processMessage("HTTP", req.body)) {
                    return res.sendStatus(200);
                } else {
                    return res.sendStatus(400);
                }
            })

            this.app.get("/history", (req, res) => {
                res.json(this.commandHistory.commands);
            })

            this.app.get("/config", (req, res) => {
                
                var changed = false;

                if(req.query.name) {
                    changed = true;
                    this.targetConfig.name = req.query.name
                }

                if(req.query.colour) {
                    changed = true;
                    this.targetConfig.colour = req.query.colour
                }

                if(req.query.group) {
                    changed = true;
                    this.targetConfig.group = req.query.group
                }

                if(req.query.groupColour) {
                    changed = true;
                    this.targetConfig.groupColour = req.query.groupColour
                }

                if(changed) {
                    console.log("Writing out config");
                    fs.writeFileSync(this.targetConfigPath, JSON.stringify(this.targetConfig));
                }

                res.json(this.targetConfig);
            })

            /*
            this.app.get("/devices", (req, res) => {
                res.json(this.deviceRepository.paths)
            })

            this.app.post("/devices", (req, res) => {
                this.deviceRepository.locate(this.targetRepository)
                return res.sendStatus(200);
            })

            this.app.get("/targets", (req, res) => {
                res.json(this.targetRepository.targets)
            })

            this.app.get("/targets/:id", (req, res) => {
                
                var id = req.params.id
                
                if(id === 'sample') {
                    res.json({ "id": "<enter the path that HID reports for the USB light", "name": "<Identifying Name>", "colour": "<Solo colour>", "group": "<Group Name>", "groupColour": "<Group Colour>"})
                }
                else {
                    this.targetRepository.targets.forEach(target => {
        
                        if(target.name === id) {
                            res.json(target)
                        }
                    });
                }
            })

            this.app.post("/targets", (req, res) => {
                this.targetRepository.add(req.body)
                this.deviceRepository.locate(this.targetRepository)
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
        */
            this.app.listen(this.tcpPort, () => {
                console.log("REST Server running on port 3000");
            });
        }
    }    
}

export default TcpListener
//module.exports = TcpListener