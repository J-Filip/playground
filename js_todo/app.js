// Selectors
const todoInput=document.querySelector('.todo-input');
const todoButton=document.querySelector('.todo-button');
const todoList=document.querySelector('.todo-list');
const filterTodo = document.querySelector('.filter-todo')

/// Event listeners
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterTodo.addEventListener("click",filterOptions);

/// Functions
// when todo button clicked
function addTodo(event) {
  // prevent form from submitting
  event.preventDefault();
  //create todo div
  const todoDiv = document.createElement('div');
  // add class
  todoDiv.classList.add("todo");
  //create li, add text from input and add class
  const newTodo = document.createElement('li');
  newTodo.innerText = todoInput.value;
  newTodo.classList.add('todo-item')  //for css
  // append li to div
  todoDiv.appendChild(newTodo);
  // add todo to local storage so it can be retrived after refresh
  saveLocalTodos(todoInput.value);
  // create complete button, add icon, add class and append to div
  const completedButton = document.createElement('button');
  completedButton.innerHTML = '<i class="far fa-check-square"></i>';
  completedButton.classList.add('complete-button');
  todoDiv.appendChild(completedButton);
  // // create trash button, add icon, add class and append to div
  const trashButton = document.createElement('button');
  trashButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
  trashButton.classList.add('trash-button');
  todoDiv.appendChild(trashButton);
  //append todo div to todo list
  todoList.appendChild(todoDiv);
  // clear input value
  todoInput.value=""
}
  // when todo list clicked
  function deleteCheck(event) {
    const clickedItem = event.target
    // if clicked button first class is trash button, get its parent eleemnt
    if(clickedItem.classList[0] === "trash-button"){
      const todo = clickedItem.parentElement;
      // add class to that element for animation
      todo.classList.add('fall')    // add another class when clicked so that we can add new css
      // remove todos from local storage so they dont display after refresh
      removeLocaltodos(todo);
      // when transition finished, remove todo
      todo.addEventListener('transitionend', function(){       // Do something with element when a CSS transition has ended:
        todo.remove();
      })
    }
    // if clicked button first class is complete button, get its parent eleemnt
    if(clickedItem.classList[0] === "complete-button"){
      const todo = clickedItem.parentElement;
      // add class to that element
      todo.classList.toggle('completed');     // toggle to another class when clicked so that we can add new css
    }
}
// we are going through child nodes in select and when option is clicked, it matches expression to case. So if all is clicked - display all todo. If completed - check for todo items with class completed and so on.
function filterOptions(event) {
  const todos = todoList.childNodes;
  //for each execute function switch
  todos.forEach(function(todo){
    //if all clicked, execute code in case all and break out
    switch (event.target.value) {
      case "all":
      //display all todos
        todo.style.display = "flex";
        break;
      case "completed":
      // if todo has class completed, display else dont
        if(todo.classList.contains("completed")){
          todo.style.display = "flex";
        } else{
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if(!todo.classList.contains("completed")){
          todo.style.display = "flex";
       }else{
         todo.style.display = "none";
        }
        break;
    }
  });
}
// when li appended to div
function saveLocalTodos(todo) {
  // check if alreday have todos in local storage
  let todos;
  // if no todos, create empty array
  if(localStorage.getItem("todos") === null){
    todos = [];
    // if not null, get todos from localStorage
  }else{
    //parse json string caled todos
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  // push new todo to array
  todos.push(todo);
  // set todos to local storage. storage.setItem(keyName, keyValue). json stringify method converts todos array to a JSON string
  localStorage.setItem("todos", JSON.stringify(todos));
}
// when page loads html (NOT whole page?)
function getTodos() {
  //console.log('DOM fully loaded and parsed');
  let todos;
  // check if alreday have todos in local
  if(localStorage.getItem("todos") === null){
    // if no todos, create empty array
    todos = [];
    //if not null, get todos from localStorage
  }else{
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  // for each todo, create that todo div. Code almost same as above addTodo()
  todos.forEach(function(todo){
    //console.log(todo);
    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo");
    //create li
    const newTodo = document.createElement('li');
    // add todo from local storage INSTEAD of input value
    newTodo.innerText = todo;
    newTodo.classList.add('todo-item')  //for css
    todoDiv.appendChild(newTodo)
    // check button
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="far fa-check-square"></i>';
    completedButton.classList.add('complete-button');
    todoDiv.appendChild(completedButton);
    // trashc button
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    trashButton.classList.add('trash-button');
    todoDiv.appendChild(trashButton);
    //append to div todo-container
    todoList.appendChild(todoDiv);
  });
}
// just before todo is removed
function removeLocaltodos(todo) {
  let todos;
  if(localStorage.getItem("todos") === null){
    // if no todos, create empty array
    todos = [];
  }else{
    // if todos, get todos from localStorage
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  // get todo text
  const todoText = todo.children[0].innerText;
  // get index of todotext in todos and start splice from that index - delete count 1 - one element is removed | splice(start, deleteCount)
  todos.splice(todos.indexOf(todoText), 1);
  // set todos to local storage. storage.setItem(keyName, keyValue). json stringify method converts todos array to a JSON string
  localStorage.setItem("todos", JSON.stringify(todos));
}
