// Notice that this js is going to be execute in client side
console.log('Client js file loaded  !!');

// Notice below URL is particular fromm the course
// fetch('http://puzzle.mead.io/puzzle').then((response) => {
//     console.log('Response completed !!');
//     response.json().then((data) => {
//         console.log(data);
//     });
// });

const theAddress = 'Austin';
/*
 * In order for this URL to work propertly in Heroku,
 * the URL must be relative to the Heroku's machine
 */
fetch(`/weather?address=${theAddress}`).then((response) => {
    console.log('Response completed !!');
    response.json().then((data) => {
        console.log(data)
    });    
});

/* 
    Please notice that:
    - This is not the best implementation
    - In order for the below function to work, the script must be loaded at the botton of the html file
*/
const myForm = document.getElementById('idForm');
myForm.addEventListener('submit', (event) => {
    event.preventDefault();
    document.getElementById('idJsonOutput').textContent = '';
    console.log('Button clicked !!');
    fetch(`http://localhost:3000/weather?address=${document.getElementById('idLocation').value}`).then((response) => {
    console.log('Response completed !!');
    response.json().then((data) => {
        document.getElementById('idJsonOutput').textContent = JSON.stringify(data, null, 2);
        console.log(data)
    });    
});
});