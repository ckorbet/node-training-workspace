const fs = require('fs');

fs.appendFileSync('notes.txt', 'This file was created by Node.js !!');
fs.appendFileSync('notes.txt', '\nMy name is Carlos Torres');