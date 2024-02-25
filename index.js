let inputTask = document.querySelector('#inputTask');
let addBtn = document.querySelector('#add-task');
let tasksList = document.querySelector('#tasksList');
let taskSearch = document.querySelector('#taskSearch');

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
  console.log(arrayOfTasks);
  arrayOfTasks.sort((a, b) => (a.completed ? 1 : 0) - (b.completed ? 1 : 0));
  console.log(arrayOfTasks);
  // Looping On Array Of Tasks
  arrayOfTasks.forEach((task) => {
    // Create Main taskLi
    let taskLi = document.createElement('li');
    taskLi.className = 'task';

    // Create div for color task
    let colorDiv = document.createElement('div');
    colorDiv.className = 'colorDiv';
    taskLi.appendChild(colorDiv);
    
    // Create CheckBox
    let checkButton = document.createElement('input');
    checkButton.type = `checkbox`;
    checkButton.classList.add('checkTask');
    taskLi.appendChild(checkButton);

    // Check If Task is Done
    if (task.completed) {
      taskLi.className = 'task done';
      checkButton.checked = true;
    }

    taskLi.setAttribute('data-id', task.id);

    // Create Task
    let taskTitle = document.createElement('input');
    taskTitle.type = 'text';
    taskTitle.value = task.title;
    taskTitle.classList.add('taskTitle');
    taskTitle.setAttribute('readonly', 'readonly');
    taskLi.appendChild(taskTitle);

    // Create Container button
    let taskBtns = document.createElement('div');
    taskBtns.className = 'btnContainer';

    // Create Delete Button
    let deleteButton = document.createElement('button');
    deleteButton.innerHTML = `<i class="fa-regular fa-rectangle-xmark"></i>`;
    deleteButton.classList.add('deleteTask');

    // Create Edit Button
    let editButton = document.createElement('button');
    editButton.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>`;
    editButton.classList.add('editTask');

    // Append Button To Main taskLi
    taskBtns.appendChild(deleteButton);
    taskBtns.appendChild(editButton);
    taskLi.appendChild(taskBtns);

    // Add taskLi To Tasks Container
    tasksList.appendChild(taskLi);
    arrayOfTasks.sort((a, b) => (a.completed ? 1 : 0) - (b.completed ? 1 : 0));

    //? SEARCH
    taskSearch.addEventListener('keyup', function searchTodo(e) {
      const searchText = e.target.value.toLowerCase();

      if (searchText !== '') {
        for (let index = 0; index < arrayOfTasks.length; index++) {
          if (task.title.includes(searchText)) {
            taskLi.style.display = 'flex';
          } else {
            taskLi.style.display = 'none';
          }
        }
      } else {
        getDataFromLocalStorage();
      }
    });

    checkButton.addEventListener('click', function (e) {
      toggleStatusTaskWith(e.target.parentElement.getAttribute('data-id'));
      // Toggle Done Class
      e.target.parentElement.classList.toggle('done');
    });

    editButton.addEventListener('click', function (e) {
      let target = e.target.parentElement.parentElement.parentElement;
      if (
        editButton.innerHTML == `<i class="fa-regular fa-pen-to-square"></i>`
      ) {
        // editButton.innerHTML = ""
        editButton.innerHTML = `<i class="fa-regular fa-square-check"></i>`;
        taskTitle.removeAttribute('readonly');
        taskTitle.focus();
      } else {
        editButton.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>`;
        taskTitle.setAttribute('readonly', 'readonly');
        editTaskTitle(target.getAttribute('data-id'), taskTitle.value);
      }
    });

    deleteButton.addEventListener('click', function (e) {
      let target = e.target.parentElement.parentElement.parentElement;
      target.remove();
      deleteTaskWith(target.getAttribute('data-id'));
    });
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
  arrayOfTasks.sort((a, b) => (a.completed ? 1 : 0) - (b.completed ? 1 : 0));
  addDataToLocalStorageFrom(arrayOfTasks);
  addElementsToPageFrom(arrayOfTasks);
}

function editTaskTitle(taskId, taskTitle) {
  for (let i = 0; i < arrayOfTasks.length; i++) {
    if (arrayOfTasks[i].id == taskId) {
      arrayOfTasks[i].title = taskTitle;
    }
  }
  addDataToLocalStorageFrom(arrayOfTasks);
}
