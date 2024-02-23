let inputTask = document.querySelector('#inputTask');
let addBtn = document.querySelector('#add-task');
let tasksList = document.querySelector('#tasksList');

// Empty Array To Store The Tasks
let arrayOfTasks = [];

// Check if Theres Tasks In Local Storage
if (localStorage.getItem('tasks')) {
  arrayOfTasks = JSON.parse(localStorage.getItem('tasks'));
}

// Trigger Get Data From Local Storage Function
getDataFromLocalStorage();

// Add Task
addBtn.onclick = function () {
  if (inputTask.value !== '') {
    addTaskToArray(inputTask.value); // Add Task To Array Of Tasks
    inputTask.value = ''; // Empty inputTask Field
  } else {
    alert('Please Enter a Task');
  }
};

function addTaskToArray(taskText) {
  // Task Data
  const task = {
    id: Date.now(),
    title: taskText,
    completed: false,
  };
  // Push Task To Array Of Tasks
  arrayOfTasks.push(task);
  // Add Tasks To Page
  addElementsToPageFrom(arrayOfTasks);
  // Add Tasks To Local Storage
  addDataToLocalStorageFrom(arrayOfTasks);
}

function addElementsToPageFrom(arrayOfTasks) {
  // Empty Tasks taskLi
  tasksList.innerHTML = '';
  // Looping On Array Of Tasks
  arrayOfTasks.forEach((task) => {
    // Create Main taskLi
    let taskLi = document.createElement('li');
    taskLi.className = 'task';

    // CheckBox
    let checkButton = document.createElement('input');
    checkButton.type = `checkbox`;
    checkButton.classList.add('checkTask');
    taskLi.appendChild(checkButton);

    // Check If Task is Done
    if (task.completed) {
      taskLi.className = 'task done';
      checkButton.checked = true;
    }

    let taskTitle = document.createElement('span');
    taskTitle.textContent = task.title;
    taskLi.setAttribute('data-id', task.id);
    taskLi.appendChild(taskTitle);
    // Create Delete Button
    let deleteButton = document.createElement('button');
    deleteButton.innerHTML = `<i class="glyphicon glyphicon-remove"></i>`;
    deleteButton.classList.add('deleteTask');

    checkButton.addEventListener('click', function (e) {
      toggleStatusTaskWith(e.target.parentElement.getAttribute('data-id'));
      // Toggle Done Class
      e.target.parentElement.classList.toggle('done');
    });

    deleteButton.addEventListener('click', function (e) {
      let target = e.target.parentElement.parentElement;
      target.remove();
      deleteTaskWith(target.getAttribute('data-id'));
    });

    // Append Button To Main taskLi
    taskLi.appendChild(deleteButton);
    // Add Task taskLi To Tasks Container
    tasksList.appendChild(taskLi);
  });
}

function addDataToLocalStorageFrom(arrayOfTasks) {
  window.localStorage.setItem('tasks', JSON.stringify(arrayOfTasks));
}

function getDataFromLocalStorage() {
  let data = window.localStorage.getItem('tasks');
  if (data) {
    let tasks = JSON.parse(data);
    addElementsToPageFrom(tasks);
  }
}

function deleteTaskWith(taskId) {
  arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId);
  addDataToLocalStorageFrom(arrayOfTasks);
}

function toggleStatusTaskWith(taskId) {
  for (let i = 0; i < arrayOfTasks.length; i++) {
    if (arrayOfTasks[i].id == taskId) {
      arrayOfTasks[i].completed == false
        ? (arrayOfTasks[i].completed = true)
        : (arrayOfTasks[i].completed = false);
    }
  }
  addDataToLocalStorageFrom(arrayOfTasks);
}
