const fs = require('fs');

const printToFile = function(fileName, text) {
    fs.appendFileSync(fileName, text);
}

module.exports = printToFile;