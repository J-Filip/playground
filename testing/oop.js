
// desc OOP in JS - MOSH // 

// ! value & reference types //
// ! primitives
/* 
var y gets the value of var x
*/ 
// let x = 190;
// let y = x;

// x = 50;
// y = x;

// ! objects
// let x = {value: 190};
// let y = x;

// x.value = 50;

// // increasing an object's value
// let objNumber = {value:3};

// function increase(number){
//     number.value++;
// }

// increase(objNumber);
//console.log(objNumber);

//  ! OBJECT LITERAL
// // we've literally written out the object contents as we've come to create it

// // let circle = {
// //     radius: 1,
// //     location: {
// //         x:1,
// //         y:2
// //     },
// // };

// ! factory function
// function createCircle(radius){
//     return {
//         radius: radius, // može i bez radius (radius,)
//         draw: function(){
//             console.log('draw');
//         }
//     };
// };

// let circle = createCircle(3);

//  ! constructor function
// /* 
// u JS ne postoje klase(kao u npr. java, c#) nego se koriste constructor functions 
// */

// function Circle(radius){
//     this.radius = radius
//     this.draw = function(){
//         console.log('draw');
//     }
// };

// const something = new Circle(3); // new operator kreira prazni object stavit ce da this vodi do tog objekta. This po deafukltu vodi na globalni object a to je Window
// //console.log(something)

//  ! adding properties //

// something.location = {x:1} 
// // or with brackets -> ako ne znamo unaprijed ime propertya
// let property = 'location' ;
// something[property]= {x:1} ;

//  ! removing properties //

// delete something.location;
// // or 
// delete something[property];

//  ! iterating properties
// // keys and values
// for(key in something){
//     console.log(key, something[key]);
// };
// // or as an array 
// let keys = Object.keys(something);
// console.log(keys);

// // check if object has some property or method
// if('draw' in something){
//     console.log('Something ima method draw');
// }

// ! ABSTRACTION //
// we added another property - defaultLocation 
// and another method - computeOptimumLocation
// todo : learn closures and scope

function Circle(radius){
    this.radius = radius;

    let defaultLocation = { x:0, y:0};
    let computeOptimumLocation = function(factor){
        //...
    }

    this.draw = function(){
        console.log('draw');
        // ? function inside a function -> works because of the closure. Unutarnja function 'draw' ima dopuštenje koristiti i varijable u njegovoj parent function
        computeOptimumLocation(0.1);
        //defaultLocation
        this.radius
    }
    // ! getter and setter
    Object.defineProperty(this, 'defaultLocation', {
        get:function(){
            return defaultLocation;
      },
          set:function(value){
            if(!value.x || !value.y){
                throw new Error('invalid location')
            }    
            defaultLocation = value;
      }
    })
};

const something = new Circle(5);
something.defaultLocation = 0, 2 // error



