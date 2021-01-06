const fs = require('fs');
const validator = require('validator');
const chalk = require('chalk');
const printToFile = require('./utils/myFileUtils.js');

console.log('Writing to fie...');
printToFile('secondNotes.txt', 'Carlos writing in seconNotes.txt file\n');
console.log(chalk.bgGreen.white.bold(' Writing complete '));
console.log('Text:');
try {
    console.log(fs.readFileSync('./secondNotes.txt', 'UTF8'));
} catch (err) {
    console.error(chalk.red.bold(err));
}

debugger

let validation = validator.isEmail('this.ismyemail.com');
if(validation) {
    console.log('Introduced text email validation: ' + chalk.green.bold(validation));
} else {
    console.log('Introduced text email validation: ' + chalk.red.bold(validation));
}

