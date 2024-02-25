let inputTask = document.querySelector('#inputTask');
let inputTaskDec = document.querySelector('#inputTaskDec');
let addBtn = document.querySelector('#add-task');
let deleteAllBtn = document.querySelector('#deleteAll-task');
let tasksList = document.querySelector('#tasksList');
let taskSearch = document.querySelector('#taskSearch');

// Empty Array To Store The Tasks
let arrayOfTasks = [];

// Check if Theres Tasks In Local Storage
if (localStorage.getItem('tasks')) {
  arrayOfTasks = JSON.parse(localStorage.getItem('tasks'));
}

// Define progressMessages as an empty array instead of null
let progressMessages = [];

async function loadProgressMessages() {
  try {
    const response = await fetch('progress_messages.json');
    const data = await response.json();
    progressMessages = data;
    // Once progressMessages is loaded, call displayProgressMessage
    displayProgressMessage();
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

// completedTasks / totalTasks
function displayProgressMessage() {
  const totalTasks = arrayOfTasks.filter((task) => task).length;
  const completedTasks = arrayOfTasks.filter((task) => task.completed).length;
  const progressPercentage = (completedTasks / totalTasks) * 100 || 0;
  const progressMessage = getProgressMessage(progressPercentage);

  const messageContainer = document.getElementById('quote');
  messageContainer.textContent = progressMessage;
}

// get progress messages --------------------
function getProgressMessage(percentage) {
  if (!progressMessages) return 'Step by step'; // if messages not loaded yet

  for (const messageData of progressMessages) {
    if (percentage >= messageData.min && percentage <= messageData.max) {
      return messageData.message;
    }
  }
  return 'Step by step';
}

// Trigger Get Data From Local Storage Function
getDataFromLocalStorage();

// Add Task
addBtn.onclick = function () {
  if (inputTask.value) {
    console.log(inputTask.value.length);
    if (inputTask.value.length <= 30) {
      addTaskToArray(inputTask.value, inputTaskDec.value); // Add Task To Array Of Tasks
      inputTask.value = ''; // Empty inputTask Field
      inputTaskDec.value = '';
    } else {
      alert('It is ToDo List NOT Journal 😒');
    }
  } else {
    alert('Please Enter a Task');
  }
};

deleteAllBtn.onclick = function () {
  arrayOfTasks = [];
  addDataToLocalStorageFrom(arrayOfTasks);
  renderTasks(arrayOfTasks);
};

function addTaskToArray(taskTitle, taskDec) {
  // Task Data
  const task = {
    id: Date.now(),
    title: taskTitle,
    description: taskDec,
    completed: false,
  };

  // Push Task To Array Of Tasks
  arrayOfTasks.push(task);

  // Add Tasks To Page
  renderTasks(arrayOfTasks);
  // Add Tasks To Local Storage
  addDataToLocalStorageFrom(arrayOfTasks);
}

function renderTasks(arrayOfTasks) {
  // Empty Tasks taskLi
  tasksList.innerHTML = '';
  calculateProgress();
  loadProgressMessages();

  if (arrayOfTasks.length === 0) {
    // Create a paragraph tag
    const noTaskMessage = document.createElement('p');
    noTaskMessage.textContent =
      "No tasks? Let's change that! 🚀 Add a new task above and get things done!";
    // Append the paragraph tag to the tasksList container
    tasksList.appendChild(noTaskMessage);
    // Exit the function early since there are no tasks to render
    return;
  }
  arrayOfTasks.sort((a, b) => (a.completed ? 1 : 0) - (b.completed ? 1 : 0));

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
    let taskTitle = document.createElement('span');
    taskTitle.textContent = task.title;
    taskTitle.classList.add('taskTitle');
    taskTitle.setAttribute('contenteditable', 'false');

    let taskDec = document.createElement('span');
    taskDec.textContent = task.description;
    taskDec.classList.add('taskDec');
    taskDec.setAttribute('contenteditable', 'false');

    let divTask = document.createElement('div');
    divTask.classList.add('divTask');

    divTask.appendChild(taskTitle);
    divTask.appendChild(taskDec);

    taskLi.appendChild(divTask);

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
        let filterArray = arrayOfTasks.filter((task) => {
          return task.title.includes(searchText);
        });
        renderTasks(filterArray);
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
        editButton.innerHTML = `<i class="fa-regular fa-square-check"></i>`;
        taskTitle.contentEditable = true;
        taskDec.contentEditable = true;
        taskTitle.focus();
      } else {
        editButton.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>`;
        // taskTitle.setAttribute('readonly', 'readonly');
        taskTitle.contentEditable = false;
        taskDec.contentEditable = false;
        editTaskTitle(
          target.getAttribute('data-id'),
          taskTitle.textContent,
          taskDec.textContent
        );
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
    renderTasks(tasks);
  }
}

function deleteTaskWith(taskId) {
  arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId);
  calculateProgress();
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
  renderTasks(arrayOfTasks);
}

function editTaskTitle(taskId, taskTitle, taskDec) {
  for (let i = 0; i < arrayOfTasks.length; i++) {
    if (arrayOfTasks[i].id == taskId) {
      arrayOfTasks[i].title = taskTitle;
      arrayOfTasks[i].description = taskDec;
    }
  }
  addDataToLocalStorageFrom(arrayOfTasks);
}

// toggle task status ------------------------------------------
function calculateProgress() {
  const totalTasks = arrayOfTasks.filter((task) => task).length; // exclude deleted tasks
  const completedTasks = arrayOfTasks.filter((task) => task.completed).length; // only not-deleted, completed tasks
  // const deletedTasks = tasks.filter((task) => task.isRemoved).length;

  const progressPercentage = (completedTasks / totalTasks) * 100 || 0;

  // update progress bar
  const progressBar = document.getElementById('progressBar');
  progressBar.style.width = `${progressPercentage}%`;
  console.log(progressPercentage);

  // update progress text
  const progressText = document.getElementById('progressText');
  progressText.textContent = `${completedTasks} / ${totalTasks} Completed`; // exclude deleted from total
}
