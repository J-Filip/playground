'use strict';

/**
 * @
 */
// ! chapter 2 - program structure

const { reduce, filter, map, some, forEach } = require('async');

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
function countChar(string, char) {
  let counter = 0;
  for (let index = 0; index < string.length; index++) {
    const e = string[index];
    if (e === char) {
      counter++;
    }
  }
  return counter;
}
//console.log(countChar('kukuriku', 'k'));

//  closure
function countBs(string) {
  return countChar(string, 'b');
}
//console.log(countBs('BBBBBBC'));

// ! chapter 4 - data strucutres: Objects and Arrays

// define new object prototype
let agent = {
  student: true,
  sayHi: function () {
    console.log(`hi ${this.name}`);
  },
};

// own pop() method.
// Methods are functions that live in properties and (usually) act on the value they are a property of.
let myArray = {
  popaj: function () {
    let index = 0;
    let array = this.elements;
    let arrayPoped = [];
    while (arrayPoped < array.length - 1) {
      const e = array[index];
      arrayPoped += e;
    }
    return arrayPoped;
  },
};
// create new object
let me = Object.create(agent);
me.name = 'bBabura';
//me.sayHi();

let fruits = Object.create(myArray);
myArray.elements = ['banana', 'apple'];
//console.log( myArray.popaj());

let colors = ['red', 'blue', 'green'];
// console.log( colors.indexOf('redblue'));
// console.log( colors.slice(1,2));

// console.log(fruits[1]);
// console.log(fruits[1].toUpperCase);
// console.log(countBs(fruits[0]));
// console.log(fruits[0].length);

// Arrays, then, are just a kind of object specialized for storing sequences of things. If you evaluate typeof [], it produces "object".

let pet = '  mojojojo     ';
// TODO: cn helper => use index of before slicing to find important (and predictable) parts of string
// console.log(pet.indexOf('joj'));
let petTrim = pet.trim();
// .trim() doesnt change string, we have to assign it to new variable
// console.log(pet.trim());
let short = petTrim.slice(0, 4);
// console.log(short);
// TODO: in raspored use join for agents array instead of using for each
// split and join
let sentence = 'Secretarybirds specialize in stomping';
let words = sentence.split(' ');
// console.log(words);
// → ["Secretarybirds", "specialize", "in", "stomping"]
// console.log(words.join('-\n'));
// → Secretarybirds. specialize. in. stomping

// rest operator
// all numbers after x are bound to numbers array
function max(x, ...numbers) {
  console.log(x);
  let result = -Infinity;
  for (let number of numbers) {
    if (number > result) result = number;
  }
  return result;
}
//console.log(max(9, 1, 4, -2));

//1. The sum of a range
function range(start, end) {
  let numRange = [start];
  while (start < end) {
    start = start + 1;
    numRange.push(start);
  }
  while (start > end) {
    start = start - 1;
    numRange.push(start);
  }
  return numRange;
}
// console.log(range(1, 10));
// console.log(range(7, 2));

//sum
let luckyNumbers = [10, 9, 8, 7];
function sum(numbers) {
  let result = 0;
  for (let num of numbers) {
    result += num;
  }
  return result;
}
// console.log(sum(luckyNumbers));
// console.log(sum(range(1, 10)));
// console.log(luckyNumbers.reverse());

// 2. Reversing an array

function reverseArray(array) {
  let lockArray = array.length;
  let reversedArray = [];
  for (let i = 0; i < lockArray; i++) {
    let last = array.pop();
    reversedArray.push(last);
  }
  return reversedArray;
}

function reverseArrayInPlace(array) {
  // original solution seems overengineered
}

//console.log(reverseArray(luckyNumbers));
//console.log(reverseArrayInPlace(luckyNumbers));

// ? 4. Deep comparison

// let obj = {
//   here: {
//     is: 'an'
//   }
// }

// function deepEqual(x, y) {
//   if (typeof(x) == 'object' && typeof(y) == 'object'){
//     console.log('objects');
//     deepEqual((Object.keys(x) == Object.keys(y)));
//   } else{
//     if (x === y) {
//       return true;
//     }
//     return false;
//   }
//   return 'nis'
// }

//console.log(deepEqual(obj, obj));

// ! chapter 5 - higher order functions
//Functions that operate on other functions, either by taking them as arguments or by returning them, are called higher-order functions.
// forEach(); - loop over elements in array
// filter(); - returns a new array containing only the elements that pass the predicate (given?) function
// reduce(); - combine all the elements in an array into a single value
// map(); - transform an array by putting each element through a function
// some(); - tests whether any element matches a given predicate (given?) function.
// every(); - returns true when the given function returns true for every element in the array.
// findIndex(); - finds the position of the first element that matches a predicate.

// ? exercises
// 1. flattening

// let nums = [1,3,5]
// console.log(arrays.reduce((a,b) => a+b));
let arrays = [[1, 2, 3], [4, 5], [6]];
function flat(array) {
  let newArray = array.reduce((a, b) => a.concat(b));
  console.log(newArray);
}
// flat(arrays);

// !xx 2. your own loop -

// function loop(value) {
//   let array = []

//   for (let i = 0; i < value; i++) {
//     const n = i;
//     array.push(n)
//     let filtered = array.filter(n => n > 1)
//     console.log(filtered);
//     if (filtered.every(n => n > 1)){
//        console.log(n);
//     }
//     // console.log(array);
//   }

// }

// loop(5)

// 3. everything
function every(array, test) {
  for (let n of array) {
    if (!test(n)) {
      //  console.log(n);
      return false;
    }
  }
  return true;
}

// console.log(every([1, 3, 5], n => n < 10));
// console.log(every([2, 4, 16], n => n < 10));
// console.log(every([], n => n < 10));

// ! skipped chapter 6, 7 - return when you start learning OOP for real

// ! chapter 8 - Bugs and errors

// use strict at top of file or function

function canYouSpotTheProblem() {
  for (let counter = 0; counter < 10; counter++) {
    console.log('Happy happy');
  }
}

// canYouSpotTheProblem();

// testing
// is even

function test(body, label) {
  if (!body()) {
    console.log(`Failed test: ${label}`);
  }
}

// test(() =>{return 5%2 == 0}, 'number is even')

// error propagation

let nums = [0, 6, 745, 2];

function lastElement(array) {
  if (array.length == 0) {
    return { failed: true };
  } else {
    return { element: array[array.length - 1] };
  }
}

//  console.log(lastElement(nums));

// exceptions

// if try is oke, catch does not execute
// function look() doesnt even know about error

function promptDirection(question) {
  let result = prompt(question);
  if (result.toLowerCase() == 'left') return 'L';
  if (result.toLowerCase() == 'right') return 'R';
  throw new Error('Invalid direction: ' + result);
}

function look() {
  if (promptDirection('Which way?') == 'L') {
    return 'a house';
  } else {
    return 'two angry bears';
  }
}

// try {
//   console.log("You see", look());
// } catch (error) {
//   console.log("Something went wrong: " + error);
// }

// try, finally

const accounts = {
  a: 100,
  b: 0,
  c: 20,
};

function getAccount() {
  let accountName = prompt('Enter an account name');
  if (!accounts.hasOwnProperty(accountName)) {
    throw new Error(`No such account: ${accountName}`);
  }
  return accountName;
}

// function transfer(from, amount) {
//   if (accounts[from] < amount) return;
//   let progress = 0;
//   try {
//     accounts[from] -= amount;
//     progress = 1;
//     accounts[getAccount()] += amount;
//     progress = 2;
//   } finally {
//     if (progress == 1) {
//       accounts[from] += amount;
//     }
//   }
// }

// selective catching
// prompt not possible in node.js by default

class InputError extends Error {}

function promptDirection(question) {
  let result = prompt(question);
  if (result.toLowerCase() == 'left') return 'L';
  if (result.toLowerCase() == 'right') return 'R';
  throw new InputError('Invalid direction: ' + result);
}

// for (;;) {
//   try {
//     let dir = promptDirection("Where?");
//     console.log("You chose ", dir);
//     break;
//   } catch (e) {
//     if (e instanceof InputError) {
//       console.log("Not a valid direction. Try again.");
//     } else {
//       throw e;
//     }
//   }
// }

// assertions
// checks inside a program intended for developer - used for common or often made mistakes

// ? excercises
// RETRY

class MultiplicatorUnitFailure extends Error {}

function primitiveMultiply(a, b) {
  if (Math.random() < 0.2) {
    return a * b;
  } else {
    throw new MultiplicatorUnitFailure('Klunk');
  }
}

function reliableMultiply(a, b) {
  for (;;) {
    try {
      return primitiveMultiply(a, b);
    } catch (e) {
      if (!(e instanceof MultiplicatorUnitFailure)) {
        console.log('stupid function');
      }
      //reliableMultiply(a, b);
    }
  }
}
// console.log(reliableMultiply(7, 4));

// the locked BOX

const box = {
  locked: true,
  unlock() {
    this.locked = false;
  },
  lock() {
    this.locked = true;
  },
  _content: [],
  get content() {
    if (this.locked) throw new Error('Locked!');
    return this._content;
  },
};

function withBoxUnlocked(body) {
  if (box.locked) {
    box.unlock();
  }
  try {
    body();
  } finally {
    box.lock();
  }
}

withBoxUnlocked(function () {
  box.content.push('gold piece');
});

try {
  withBoxUnlocked(function () {
    // throw new Error("Pirates on the horizon! Abort!");
  });
} catch (e) {
  console.log('Error raised: ' + e);
}
// console.log(box.locked);
// console.log(box._content);

//!  chapter 9 - regular expressions

// regular expression is a type of object
// 2 ways of defining
let re1 = new RegExp('abcd');
let re2 = /abc/;

// some cahrachters must be escaped

let eighteenPlus = /eighteen\+/;

// test if 'abc' in next strings
// console.log(/abc/.test('barca')); // false
// console.log(/abc/.test('kabca')); // true

// square brackets and '-'

// console.log(/[0-9]/.test('2312'));
// console.log(/[0-5]/.test('98'));

// some of the shortcuts
// console.log(/\d/.test('dfgnjdfg'));
// console.log(/[\d.]/.test('dfgnjdfg')); // just diffrent syntax

// console.log(/\w/.test('dfgnjdfg'));
// console.log(/./.test('dfgnjdfg'));

// console.log(/ZAHTJEV:/.test('RE:[ZAHTJEV:505791] Prijava'));
// console.log(/^skole.hr/.test('test@gmail.com')); // not skole.hr
// console.log(/.+@+.+skole.hr/.test('ime.prezime@ss-srednja-skola-zg.skole.hr'));

// caret for finding NOT matches
// ^ = alt+94 (on numpad)
let fiveOrLess = /[0-5]/;
let fiveOrMore = /[^0-5]/;
// console.log(fiveOrMore.test('9876'));
// console.log(fiveOrMore.test('1321'));

let len1 = 'R90VYBV4'; // v330
let len2 = 'LR0EFBD7'; // 15-IIl
let sn1 = '5CD938KB54'; // 455 G6
let sn2 = '5CD041FG66'; // 455 G7

// {5} means must repeat pattern 5 times...we can user {5-} for 5 or more or {5-7} for range

// console.log(/R90V+\w{4}/.test(len1));
// console.log(/LR0EF+\w{3}/.test(len2));
// console.log(/5CD+\w{7}/.test(sn1));
// console.log(/5CD0+\w{6}/.test(sn2));

// let match = /5CD0+\w{6}/.exec(sn2);
let match = sn2.match(/5CD0+\w{6}/);
// console.log(match);

// the date class
// days form index 1, months from index 0

// console.log(new Date());
// console.log(new Date(2020,11,25)); // christmas

// the pipe charachter |
let animalCount = /\b\d+ (pig|cow|chicken)s?\b/;
// console.log(animalCount.test("15 pigs")); // true
// console.log(animalCount.test("15 pigschicken")); // false

// the replace method
// useful for cn helper 2
let regex1 = /\[VAR1\]/g;

let lorem =
  'It would have[VAR1] sensible if the choice between [VAR1] replacing one match or all matches was made through an additional argument [VAR2] replace or by providing a different method, replaceAll. But for some unfortunate reason, the choice relies on a property of the regular expression instead.';

// console.log(lorem.replace(regex1, 'lala'));

// remember to add unicode option when working with non-english aplhabet

// ? exercises
// 1. Regexp golf

function verify(regexp, yes, no) {
  // Ignore unfinished exercises
  if (regexp.source == '...') {
    console.log('nis');
    return;
  }
  for (let str of yes)
    if (!regexp.test(str)) {
      console.log(`Failure to match '${str}'`);
    }
  for (let str of no)
    if (regexp.test(str)) {
      console.log(`Unexpected match for '${str}'`);
    }
  console.log('all good');
}

verify(/ca[rt]/, ['my car', 'bad cats'], ['camper', 'high art']);

verify(/pr?op/, ['pop culture', 'mad props'], ['plop', 'prrrop']);

verify(
  /ferr[y|et|ari]/,
  ['ferret', 'ferry', 'ferrari'],
  ['ferrum', 'transfer A']
);

verify(
  /ious$|ious\s/,
  ['how delicious', 'spacious room'],
  ['ruinous', 'consciousness']
);
verify(/\s[,\.:;]/, ['bad punctuation .'], ['escape the period']);

verify(
  /\w{7,}/,
  ['Siebentausenddreihundertzweiundzwanzig'],
  ['no', 'three small words']
);

verify(
  /\b[^\We]+\b/i,
  ['red platypus', 'wobbling nest'],
  ['earth bed', 'learning ape', 'BEET']
);

// 2.exercise

// 3. exercise

// ! Chapter 10 - Modules

// modules are attempt to avoid ""ball of mud code
// A module is a piece of program that specifies which other pieces it relies on and which functionality it provides for other modules to use (its interface).
// a lot in common with object interfaces
// more like LEGO blocks

// A package is a chunk of code that can be distributed (copied and installed). It may contain one or more modules and has information about which other packages it depends on. A package also usually comes with documentation explaining what it does so that people who didn’t write it might still be able to use it.

// NPM is two things: an online service where one can download (and upload) packages and a program (bundled with Node.js) that helps you install and manage them.

<<<<<<< HEAD
// CHapter 11
=======
// chapter 5 - higher order functions

>>>>>>> fdbad740067f3ad34e5ae3931646fb4e6cad45bb
