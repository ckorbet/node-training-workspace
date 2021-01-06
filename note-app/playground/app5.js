const fs = require('fs');
const validator = require('validator');
const chalk = require('chalk');

const sourceJsonData = fs.readFileSync('./sourceJsonData.json');
const parsedJsonData = JSON.parse(sourceJsonData);
console.log(chalk.yellow('Source json data retrieved and parsed'));
console.log(parsedJsonData[0]);
console.log(chalk.yellow('Applying changes...'));
parsedJsonData[0].first_name = 'Carlos';
parsedJsonData[0].last_name = 'Torres Gonzalez';
console.log(chalk.yellow('First name and last name changed'));
console.log(parsedJsonData[0]);
console.log(chalk.yellow('Saving changes...'));
fs.writeFileSync('./sourceJsonData.json', JSON.stringify(parsedJsonData, null, 4));
console.log(chalk.yellow('Changes saved'));