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




// Tabs
const tabs = document.querySelectorAll(".tab");

// Headline
const headline = document.getElementById("headline");




// App State


let tasks = [];
let currentViewDate = null;
let currentFilter = "all";
let currentLanguage = "ar";



// Theme Toggle
let currentTheme = localStorage.getItem("theme") || "dark";

document.documentElement.setAttribute(
    "data-theme",
    currentTheme
);


themeToggle.innerHTML = `
    <span class="material-symbols-outlined">
        ${currentTheme === "dark" ? "light_mode" : "dark_mode"}
    </span>
`;

themeToggle.addEventListener("click", () => {
    currentTheme = currentTheme === "light" ? "dark" : "light";

     localStorage.setItem("theme", currentTheme);

    document.documentElement.setAttribute(
        "data-theme",
        currentTheme
    );

    themeToggle.innerHTML = `
    <span class="material-symbols-outlined">
        ${currentTheme === "dark" ? "light_mode" : "dark_mode"}
    </span>
`;
});



// Language Toggle
const translations = {
    ar: {
        headline: "مهامي",
        prevDay: "السابق",
        nextDay: "التالي",
        todayJump: "ارجع للنهاردة",

        placeholder: "أضف مهمة جديدة…",
        inputAria: "مهمة جديدة",
        addLabel: "إضافة المهمة",

        statAll: "الكل",
        statDone: "منجزة",
        statPending: "متبقية",
        statPct: "نسبة الإنجاز",

        tabAll: "الكل",
        tabActive: "نشطة",
        tabDone: "منجزة",

        empty: "لسه مفيش مهام هنا، ابدأ بإضافة مهمة",

        complete: "إنجاز",
        undo: "تراجع",
        delete: "حذف"
    },

    en: {
        headline: "My Tasks",
        prevDay: "Previous",
        nextDay: "Next",
        todayJump: "Back to Today",

        placeholder: "Add a new task…",
        inputAria: "New task",
        addLabel: "Add task",

        statAll: "All",
        statDone: "Completed",
        statPending: "Remaining",
        statPct: "Completion",

        tabAll: "All",
        tabActive: "Active",
        tabDone: "Completed",

        empty: "No tasks here yet. Start by adding a task",

        complete: "Complete",
        undo: "Undo",
        delete: "Delete"
    }
};


function updateLanguage() {

    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach(element => {
        const key = element.dataset.i18n;

        element.textContent = translations[currentLanguage][key];
    });


    const placeholders = document.querySelectorAll("[data-i18n-placeholder]");

    placeholders.forEach(element => {
        const key = element.dataset.i18nPlaceholder;

        element.placeholder = translations[currentLanguage][key];
    });


    const ariaElements = document.querySelectorAll("[data-i18n-aria]");

    ariaElements.forEach(element => {
        const key = element.dataset.i18nAria;

        element.setAttribute(
            "aria-label",
            translations[currentLanguage][key]
        );
    });


    langToggle.textContent =
        currentLanguage === "ar" ? "English" : "العربية";

    document.documentElement.lang =
        currentLanguage === "ar" ? "ar" : "en";

    document.documentElement.dir =
        currentLanguage === "ar" ? "rtl" : "ltr";
}

langToggle.addEventListener("click", () => {
    currentLanguage = currentLanguage === "ar" ? "en" : "ar";

    render();
});

// /////////////////////////////////////////

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


//getToday

function getTodayKey( date = new Date()) {
    // const today = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}



  // Format date for display

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
 
// Render the current view date in the UI

function renderDate() {
    viewDate.textContent = formatDisplayDate(currentViewDate, currentLanguage);
    
}
  currentViewDate = getTodayKey();
  renderDate();


////////////////////////////////////////////////////
//prev day btn
prevDayBtn.addEventListener("click", () => {
    const date = new Date(currentViewDate);
    date.setDate(date.getDate() - 1);
    currentViewDate =  getTodayKey(date);
    render()
});
//next day btn
nextDayBtn.addEventListener("click", () => {
    const date = new Date(currentViewDate);
    date.setDate(date.getDate() + 1);
    currentViewDate =  getTodayKey(date);
    render()
});
//current day 
todayJumpBtn.addEventListener("click", () => {
    currentViewDate = getTodayKey();

    render();
});

// function updateTodayJump() {
//    const today = getTodayKey();

//    todayJumpBtn.style.visibility = currentViewDate === today ? "hidden" : "visible";
// }

function updateTodayJump() {
    const today = getTodayKey();

    todayJumpBtn.hidden = currentViewDate === today;
}

/////////////////////////////////////////////////////


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


//////////////////////////////////////////////////

// Get tasks for the current view date ---------

// function getVisibleTasks() {
//     return tasks.filter( task => task.date === currentViewDate );
// }

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

            taskText.className = `
                flex-1
                min-w-0
                text-sm
                text-[var(--text)]
                font-tajawal
                break-words
                ${task.done ? "line-through opacity-50" : ""}
            `;

             // Complete button
            const completeBtn = document.createElement("button");
            completeBtn.textContent = task.done ? "Undo" : "Complete";

            completeBtn.className = `
                px-3
                py-1.5
                rounded-lg
                text-xs
                font-tajawal
                transition
                ${task.done
                    ? "bg-[var(--undo-soft)] text-[var(--undo)] hover:opacity-80"
                    : "bg-[var(--success-soft)] text-[var(--success)] hover:opacity-80"
                }
            `;

            completeBtn.addEventListener("click", () => {
            toggleTaskDone(task.id);
             });


             // Delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
                deleteBtn.className = `
                px-3
                py-1.5
                rounded-lg
                text-xs
                font-tajawal
                text-red-400
                bg-red-500/10
                hover:bg-red-500/20
                transition
                `;

            deleteBtn.addEventListener("click", () => {
                deleteTask(task.id);
            });


             
             li.appendChild(taskText);
             li.appendChild(completeBtn);
             li.appendChild(deleteBtn);

             taskList.appendChild(li);

          // li styling
            li.className = `
                flex
                items-center
                gap-3
                p-4
                mb-3
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--bg2)]
                shadow-[inset_40px_0_60px_-55px_rgba(0,0,0,0.18)]
            `;
                        

        });

}


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

////////////////////////////////////////////

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
// getVisibleTasks

// Filter tasks based on the current view date and filter
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        currentFilter = tab.dataset.filter;

        tabs.forEach(t => {
            t.classList.remove("active");
        });

        tab.classList.add("active");

        render();
    });
});

// Get tasks for the current view date and filter
function getVisibleTasks() {
    return tasks.filter(task => {
        if (task.date !== currentViewDate) {
            return false;
        }

        if (currentFilter === "active") {
            return task.done === false;
        }

        if (currentFilter === "done") {
            return task.done === true;
        }

        return true;
    });
}

///////////////////////////////

//// Statistics


function updateStatistics() {
    const visibleTasks = getVisibleTasks();

    const total = visibleTasks.length;
    statTotal.textContent = total;

    const done = visibleTasks.filter(t => t.done).length;
    statDone.textContent = done;

    const pending = total - done;
    statPending.textContent = pending;


    //    if (total === 0) {
    //         pct = 0;
    //     } else {
    //         pct = Math.round((done / total) * 100);
    //     }

    //  ``  --> Backtick
        const pct = total === 0 ? 0 : (Math.round((done / total) * 100));
            statPct.textContent = `${pct}%`;

}
//////////////////////////////////////////////






function render() {
    renderTasks();
    renderEmptyMessage()
    updateStatistics();
    renderDate();
    updateTodayJump();
    updateLanguage()
   
}



 tasks = loadTasksFromStorage();
 render();
