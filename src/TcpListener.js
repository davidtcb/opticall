const express = require('express');

class TcpListener {
    constructor(tcpPort, tcpEnabled) {
        this.tcpPort = tcpPort
        this.tcpEnabled = tcpEnabled
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
        
            this.app.listen(this.tcpPort, () => {
                console.log("REST Server running on port 3000");
            });
        }
    }
}

module.exports = TcpListener