import chalk from 'chalk';
import boxen from 'boxen';
import hex2rgb from 'hex-rgb';
import rgb2hex from 'rgb2hex';
import colors from "color-name";

class OutputFormatter {


    output(config, msg, color, handler) {

        if(handler.consoleColour) {
            var color = handler.consoleColour
        }

        var resolvedColor = this._resolveColor(color)

        var outputText = "Group: " + config.group + "\nTarget: " + config.name

        if(msg.from) {
            outputText = outputText + "\nFrom: " + msg.from
        }
        
        var borderColor = rgb2hex('rgb(' + resolvedColor.red + ',' + resolvedColor.green + ',' + resolvedColor.blue + ')');

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

export default OutputFormatter
//module.exports = OutputFormatter