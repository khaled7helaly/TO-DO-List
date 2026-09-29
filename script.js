//dom elements

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



// Date Helpers
// ==============================

// ==============================
// Helper Functions


function getTodayKey() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function generateId() {
    return Date.now().toString();
}

function formatDateKey(dateKey) {
    const [year, month, day] = dateKey.split("-");

    return new Date(year, month - 1, day);
}
