// ! chapter 2 - program structure
// triangle
function triangle() {
  x = 0;
  y = '#';
  while (x < 7) {
    console.log(y);
    x += 1;
    y += '#';
  }
}

// fizzbuzz
function fizzbuzz(n) {
  x = 0;
  while (x < n) {
    if (x % 5 == 0 && x % 3 == 0) {
      console.log('FizzBuzz');
    } else if (x % 5 == 0) {
      console.log('buzz');
    } else if (x % 3 == 0) {
      console.log('fizz');
    } else {
      console.log(x);
    }
    x += 1;
  }
}

// chessboard
function chessboard(size) {
  x = 0;
  y = 0;
  z = 0;
  even = '';
  odd = '';
  while (x < size) {
    if (x % 2 == 0) {
      while (y < size / 2) {
        even += ' #';
        y += 1;
      }
      console.log(even);
    } else {
      while (z < size / 2) {
        odd += '# ';
        z += 1;
      }
      console.log(odd);
    }
    x += 1;
  }
}
//chessboard(64);

// ! chapter 3 - functions
// smaller argument
const min = (a, b) => {
  if (a < b) {
    return a;
  }
  return b;
};
//console.log(min(22,-9));

// recursion
const isEven = (a) => {
  if (a - 2 == 0) {
    return true;
  } else if (a < 0) {
    return isEven(-a);
  } else {
    a = a - 2;
    if (a == 1) {
      return false;
    }

    // must be return because otherwise it calls another function and we dont get the retrun value
    return isEven(a);
  }
};
// console.log(isEven(17));

// bean counting
// my solution - prefered for loop used
// const countBs = (string) => {
//     let counter = 0;
//     for(e of string){
//         if(e === 'B'){
//             counter++;
//         }
//     }
//     return counter;
// };
function countChar (string, char)  {
  let counter = 0;
  for (let index = 0; index < string.length; index++) {
    const e = string[index];
    if (e === char) {
      counter++;
    }
  }
  return counter;
};
//console.log(countChar('kukuriku', 'k'));

//  closure
function countBs(string){
    return countChar (string, 'b')
};
//console.log(countBs('BBBBBBC'));

// ! chapter 4 - data strucutres: Objects and Arrays

// define new object prototype
let agent = {
  student: true,
  sayHi: function ()  {
    console.log(`hi ${this.name}`);
  }
};

// own pop() method
let myArray = {
  popaj: function() {
    let index = 0
    let array = this.elements;
    let arrayPoped = []
    while (arrayPoped < array.length-1 ) {
      const e = array[index];
      arrayPoped+=e
    }
    return arrayPoped
  }
};
// create new object 
let me = Object.create(agent);
me.name = 'bBabura';
me.sayHi();

let fruits = Object.create(myArray) 
myArray.elements = ['banana', 'apple']
console.log( myArray.popaj());

// console.log(fruits[1]);
// console.log(fruits[1].toUpperCase);
// console.log(countBs(fruits[0]));
// console.log(fruits[0].length);

// Arrays, then, are just a kind of object specialized for storing sequences of things. If you evaluate typeof [], it produces "object".


