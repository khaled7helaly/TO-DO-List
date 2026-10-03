//             ---------  dom elements  ---------- 

// Input & Add Button

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');


// Task List

const taskList = document.getElementById("list");
const emptyMsg = document.getElementById("emptyMsg");


//Statistics

const statTotal = document.getElementById("statTotal");
const statDone = document.getElementById("statDone");
const statPending = document.getElementById("statPending");
const statPct = document.getElementById("statPct");


//Date Navigation

const prevDayBtn = document.getElementById("prevDay");
const nextDayBtn = document.getElementById("nextDay");
const todayJumpBtn = document.getElementById("todayJump");
const viewDate = document.getElementById("viewDate");


// Language & Theme

const langToggle = document.getElementById("langToggle");
const themeToggle = document.getElementById("themeToggle");


// Monthly Chart

const monthLabel = document.getElementById("monthLabel");
const bars = document.getElementsByClassName("bars");



// Tabs
const tabs = document.querySelectorAll(".tab");

// Headline
const headline = document.getElementById("headline");




// App State


let tasks = [];
let currentViewDate = null;
let currentFilter = "all";
let currentLanguage = "ar";
let currentTheme = "dark";


// Helper Functions

function getTodayKey() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}
 currentViewDate = getTodayKey();


 function formatDisplayDate(dateKey, lang = "ar") {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day); 
  const locale = lang === "ar" ? "ar-EG" : "en-US";
  
  return date.toLocaleDateString(locale, {
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric"
  });
}
/////////////////////////////////////////////////////


//  Local Storage (tasks set & get)

const STORAGE_KEY = "my_todo_app_tasks";

function saveTasksToStorage(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasksFromStorage() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  return savedData
    ? JSON.parse(savedData)
    : [];
}


/////////////////////////////////////////////////////////////////////

// Task Operations  



// add task
addBtn.addEventListener("click", () => {

    const text = taskInput.value.trim();

    if (!text) return;

    const newTask = {
        id: Date.now().toString(),
        text: text,
        done: false,
        date: currentViewDate
    };

    tasks.push(newTask);
    saveTasksToStorage();
    taskInput.value = "";

    // console.log("Task added:", newTask);

     render();
})

// delete task
function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasksToStorage();
    render();
}

// toggle task done status

function toggleTaskDone(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.done = !task.done;
    }

     saveTasksToStorage();
     render();
}

//////////////////////////////////////////////////

function render() {
    renderTasks();
    renderEmptyMessage()
    updateStatistics();

}

////////////////////////////

function getVisibleTasks() {
    return tasks.filter( task => task.date === currentViewDate );
}

/////////////////////////////////

// Render tasks for the current view date ---------
function renderTasks() {
    taskList.innerHTML = "";

    const visibleTasks = getVisibleTasks();

     visibleTasks.forEach(task => {
            const li = document.createElement("li");

            li.dataset.id = task.id;

           

            // Task text
            const taskText = document.createElement("span");
            taskText.textContent = task.text;

             // Complete button
            const completeBtn = document.createElement("button");
            completeBtn.textContent = task.done ? "Undo" : "Complete";

             completeBtn.addEventListener("click", () => {
            toggleTaskDone(task.id);
             });


             // Delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";

            deleteBtn.addEventListener("click", () => {
                deleteTask(task.id);
            });


             
             li.appendChild(taskText);
             li.appendChild(completeBtn);
             li.appendChild(deleteBtn);

             taskList.appendChild(li);

        });

}

// Render empty message if no tasks for the current view date ---------
function renderEmptyMessage() {

     const visibleTasks = getVisibleTasks();

     if (visibleTasks.length === 0) {
        emptyMsg.hidden = false;
        return;
     }

      emptyMsg.hidden = true;
    //   render();
}
///////////////////////////////

//Task Actions

//// Statistics


function updateStatistics() {
    const visibleTasks = getVisibleTasks();

    const total = visibleTasks.length;
    statTotal.textContent = total;

    const done = visibleTasks.filter(t => t.done).length;
    statDone.textContent = done;

    const pending = total - done;
    statPending.textContent = pending;


    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    statPct.textContent = `${pct}%`;



  
}







