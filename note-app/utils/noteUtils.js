const chalk = require('chalk');
const fs = require('fs');

const saveNote = (tittle, body) => {
    const notes = loadNotes();
    if(checkNoteExists(notes, tittle)) {
        console.log(chalk.red.bold('  Note already exists. Nothing to be saved'));
    } else {
        notes.push({
            tittle: tittle,
            body: body
        });
        console.log(chalk.magenta('  Note pushed'));
        saveNotes(notes);
        console.log(chalk.magenta('  Note saved'));
    }
}

const removeNote = (tittle) => {
    const notes = loadNotes();
    if(checkNoteExists(notes, tittle)) {
        let filteredOut = notes.filter(note => note.tittle !== tittle);
        console.log(chalk.magenta('  Notes filtered out'));
        saveNotes(filteredOut);
        console.log(chalk.magenta('  Note removed'));
    } else {
        console.log(chalk.red.bold('  Note does not exist. Nothing to be removed'));        
    }
}

const listNotes = () => {
    const notes = loadNotes();
    if(notes.length > 0) {
        notes.forEach(note => console.log(note));
        console.log(chalk.magenta('  Notes listed'));
    } else {
        console.log(chalk.red.bold('  There are no notes'));        
    }
}

const readNote = (tittle) => {
    const notes = loadNotes();
    if(checkNoteExists(notes, tittle)) {
        let filteredOut = notes.filter(note => note.tittle === tittle);
        console.log(chalk.magenta('  Notes filtered out'));
        console.log(filteredOut);
        console.log(chalk.magenta('  Note read'));
    } else {
        console.log(chalk.red.bold('  Note does not exist. Nothing to be read'));        
    }
}

const checkNoteExists = (notes, tittle) => {
    return findDuplicatedNotes(notes, tittle) !== null && findDuplicatedNotes(notes, tittle) !== undefined;
}

const loadNotes = () => {
    let result = []
    try {
        result = JSON.parse(fs.readFileSync('./theNotes.json'));
    } catch (e) {
        // nothing to be done
    }
    return result;
}

const saveNotes = (notes) => {
    fs.writeFileSync('./theNotes.json', JSON.stringify(notes, null, 4));
}

const findDuplicatedNotes = (notes, tittle) => {
    return notes.find(note => note.tittle === tittle);
}

module.exports = {
    saveNote: saveNote,
    loadNotes: loadNotes,
    saveNotes: saveNotes,
    findDuplicatedNotes: findDuplicatedNotes,
    removeNote: removeNote,
    listNotes: listNotes,
    readNote: readNote
}