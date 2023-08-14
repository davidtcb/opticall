import fs from 'fs';

class TargetRepository {
    constructor(targetDir) {
        this.targetDir = targetDir
        this.targetMap = new Map()
    }

    reload() {

        if(!fs.existsSync(this.targetDir)) {
            fs.mkdirSync(this.targetDir)
        }
       
        this.targetMap.clear()
        this.targets = []

        var files = fs.readdirSync(this.targetDir);

        files.forEach(file => {

            var obj = JSON.parse(fs.readFileSync(this.targetDir + '/' + file))
            this.targets.push(obj)
            this.targetMap.set(obj.id, obj)
            console.log("Found device :" + obj.id + " in file " + file );
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

export default TargetRepository
//module.exports = TargetRepository