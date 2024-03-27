interface IHasLength {
  length: number;
}

// Add up `length` properties of all input array elements.
function totalLength(xs: IHasLength[]) {
  // We only know one thing about `x`: it has a numeric `length` property.
  // That's all we need!
  return xs.reduce((total, x) => total + x.length, 0);
}

// It works on arrays of strings because strings have a `length` property.
totalLength(["foo", "bar"]);

// It works on arrays of arrays because arrays have a `length` property.
totalLength([
  [1, 2],
  [3, 4],
]);

// It works on arrays with a mixture of strings and arrays.
console.log(totalLength(["foo", "bar", [1, 2], [3, 4]]));

// console.log(totalLength([4,42])); // error
