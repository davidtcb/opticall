const fs = require('fs');

class TargetRepository {
    constructor(targetDir) {
        this.targetDir = targetDir
        this.targetMap = new Map()
    }

    reload() {

        this.targetMap.clear()
        this.targets = []

        var files = fs.readdirSync(this.targetDir);

        files.forEach(file => {

            var obj = JSON.parse(fs.readFileSync(this.targetDir + '/' + file))
            this.targets.push(obj)
            this.targetMap.set(obj.id, obj)
        });
    }

    delete(name) {
        
        var path = this.targetDir + '/' + name + '.json'

        if(!fs.existsSync(path))
        {
            return false;
        }

        fs.rmSync(path)

        this.reload()
        return true;
    }

    add(obj) {
        try {
            
            var path = this.targetDir + '/' + obj.name + '.json'
             
            fs.writeFileSync(path, JSON.stringify(obj, null, 4))
        } catch (err) {
            console.error(err)
        }

        this.reload()
    }

}

module.exports = TargetRepository