// for example, to check whether an optional package is installed or not and only use it when it’s available.let newModule = require.resolve('./module') // If you want to only resolve the module and not execute it - for example, to check whether an optional package is installed or not and only use it when it’s available.

let myModule = require('./module') 
// or 
let { x : name, y} = require('./module')

console.log(myModule.x);
console.log(myModule.y);
console.log(name, y);

const OS = require('os')
console.log(OS.platform());


// read files
const fs = require('fs')

fs.readFile('./note.txt', (err, data) => {
      if (err) {
            console.log(err);
      }
      console.log(data.toString());
})
console.log('zadnja');

