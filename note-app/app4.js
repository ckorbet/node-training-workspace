
const chalk = require('chalk');
const yargs = require('yargs');
const noteUtils = require('./utils/noteUtils.js');

yargs
.command({
    command: 'add',
    describe: 'Adds a new note',
    builder: {
        tittle: {
            describe: 'Tittle of the new note',
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: 'Body of the new note',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function(argv) {
        console.log(chalk.yellow('Adding a new note:'));
        console.log(chalk.green('  Tittle: ') + argv.tittle);
        console.log(chalk.green('  Body: ') + argv.body);
        noteUtils.saveNote(argv.tittle, argv.body);
    }
})
.command({
    command: 'remove',
    describe: 'Removes an existing note',
    builder: {
        tittle: {
            describe: 'Tittle of the existing note to remove',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function(argv) {
        console.log(chalk.yellow('Removing note:'));
        console.log(chalk.green('  Tittle: ') + argv.tittle);
        noteUtils.removeNote(argv.tittle);
    }
})
.command({
    command: 'list',
    describe: 'Lists all notes',
    handler: function(argv) {
        console.log(chalk.yellow('Listing notes'));
        noteUtils.listNotes();
    }
})
.command({
    command: 'read',
    describe: 'Reads an existing note',
    builder: {
        tittle: {
            describe: 'Tittle of the existing note to read',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function(argv) {
        console.log(chalk.yellow('Reading note:'));
        noteUtils.readNote(argv.tittle);
    }
})
.demandCommand(1)
;

yargs.parse();