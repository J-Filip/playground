console.log('I am first');

let fetchWP = async () => {
  let response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  let data = await response.json();
  console.log('Then data is third:');
  console.log(data);
  console.log('Fourth and last!');
  return data;
};
console.log('This is second. Strange but true!');

// fetchWP()
// .then((res) => console.log(res));


const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
const text = await response.json();
console.log(text);