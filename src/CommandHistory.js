import util from 'util';

class CommandHistory {
    constructor() {
        this.commands = []
    }

    addCommand(commandDetail) {
        
        var commandString = util.format('%s: %s', new Date().toISOString(), commandDetail);
        this.commands.push(commandString)
    }
}

export default CommandHistory