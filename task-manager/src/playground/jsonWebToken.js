const jwt = require('jsonwebtoken');

const theString = 'BadMotherFucker';
const theSecret = 'SecretMotherFucker';

const jwtSignerFunc = (theString, theSecret) => {
    return jwt.sign({ _id: theString }, theSecret);
};

const jwtVerifierFunc = (theToken, theSecret) => {
    return jwt.verify(theToken, theSecret);
}

const myToken = jwtSignerFunc(theString, theSecret);
console.log(`${theString} jwt-signed with ${theSecret}: ${myToken}`);
const theData = jwtVerifierFunc(myToken, theSecret);
console.log(`Token jwt-verified with ${theSecret}: ${JSON.stringify(theData)}`);