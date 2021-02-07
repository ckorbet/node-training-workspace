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
fetch(`http://localhost:3000/weather?address=${theAddress}`).then((response) => {
    console.log('Response completed !!');
    response.json().then((data) => {
        console.log(data)
    });    
});