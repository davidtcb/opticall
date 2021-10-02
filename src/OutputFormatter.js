const chalk = require('chalk');
const boxen = require('boxen');
const hex2rgb = require("hex-rgb");
var rgb2hex = require('rgb2hex');
const colors = require("color-name");

class OutputFormatter {


    output(deviceConfig, msg, color, handler) {

        if(handler.consoleColour) {
            var color = handler.consoleColour
        }

        var resolvedColor = this._resolveColor(color)

        var outputText = "Group: " + deviceConfig.group + "\nTarget: " + deviceConfig.name

        if(msg.from) {
            outputText = outputText + "\nFrom: " + msg.from
        }
        
        var borderColor = rgb2hex('rgb(' + resolvedColor.red + ',' + resolvedColor.green + ',' + resolvedColor.blue + ')');

        console.log(borderColor.hex)

        var coloredText = chalk.rgb(resolvedColor.red, resolvedColor.green, resolvedColor.blue).inverse(outputText)
        var options = {title: msg.cmd, borderColor: borderColor.hex, padding:1, margin:1, float: 'center'}
        console.log(boxen(coloredText, options));

        return resolvedColor
    }

    _resolveColor = function(color) {
        if (color && color.startsWith("#")) {
          return hex2rgb(color);
        }
    
        if (color && colors[color]) {
          return {
            red: colors[color][0],
            green: colors[color][1],
            blue: colors[color][2],
          };
        }
    
        return { red: 0x00, green: 0x00, blue: 0x00 };
      }
}

module.exports = OutputFormatter