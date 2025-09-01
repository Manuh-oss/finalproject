const calendar = document.querySelector(".days-month");
const yearSelect = document.getElementById("year");
const monthSelect = document.getElementById("month");
const thisYear = new Date().getFullYear();
const modalContainer = document.getElementById("modal-box");
const eventBox = document.getElementById("create-event");
const currentEvent = document.querySelector(".existing-events");
const otherEvent = document.querySelector(".other-events-container");
const events = document.getElementById("event-box");
const cancelBtn = events.querySelector(".cancel");
const submitBtn = events.querySelector("#submit");

let thisMonthDates = [];

const progressContainer = document.getElementById("container");
const dones = JSON.parse(localStorage.getItem("doneEvents"));
console.log(dones)

//error constants
const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");

const addZero = new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 });
const currentDate = `${new Date().getDate()}/${
  new Date().getMonth() + 1
}/${new Date().getFullYear()}`;

const date = new Date();

//other accesorries
const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

//days of the week
const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

//holiday array
const holidays = [
  {
    date: "1/1",
    tittle: "new year",
  },
  {
    date: "1/5",
    tittle: "labour day",
  },
  {
    date: "1/6",
    tittle: "madaraka day",
  },
  {
    date: "10/10",
    tittle: "huduma day",
  },
  {
    date: "20/10",
    tittle: "mashujaa day",
  },
  {
    date: "12/12",
    tittle: "jamhuri day",
  },
  {
    date: "25/12",
    tittle: "christmas",
  },
  {
    date: "26/12",
    tittle: "boxing day",
  },
];

//set month
month.value = date.getMonth();

//function to set ten yers after current year
const currentYear = new Date().getFullYear();

for (let i = 0; i < 11; i++) {
  const years = currentYear + i;
  const option = document.createElement("option");
  option.value = years;
  option.textContent = years;
  yearSelect.appendChild(option);
}

//this creates the calendar
function createCalendar() {
  thisMonthDates = [];
  calendar.innerHTML = "";
  //requirements for calendar
  const currentMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate(); //this month days
  const firstDayThisMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  ).getDay();
  const firstDayNextMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    1
  ).getDay();
  const prevMonthDays = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();
  const nextDays = 7 - firstDayNextMonth + 1;

  for (let z = firstDayThisMonth; z > 0; z--) {
    const div = document.createElement("div");
    div.className = "prev-months";
    div.innerHTML = `<p>${prevMonthDays - z + 1}</p>`;
    calendar.appendChild(div);
  }

  for (let x = 1; x <= currentMonth; x++) {
    const div = document.createElement("div");
    div.id = "div" + x;
    if (
      x === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear()
    ) {
      //this checks for current day
      const innerDiv = document.createElement("div");
      innerDiv.classList.add("navy");
      innerDiv.classList.add("inner");
      div.classList.add("navy-border");
      div.classList.add("padding");
      innerDiv.innerHTML = `
        <p>${x}</p>
        <span class="text">today</span>
        `;
      div.appendChild(innerDiv);
      calendar.appendChild(div);
    } else {
      div.className = "normal-border";
      div.innerHTML = `<p>${x}</p>`;
      calendar.appendChild(div);
    }
    if (!thisMonthDates.some((span) => span.id === div.id)) {
      thisMonthDates.push(div);
    }
    div.addEventListener("dblclick", addEvent);
  }

  for (let y = 1; y < nextDays; y++) {
    const div = document.createElement("div");
    div.className = "prev-months";
    div.innerHTML = `<p>${y}</p>`;
    calendar.appendChild(div);
  }
  highlightHolidays();
  const dates = document.querySelectorAll(".normal-border");
}

//ajax callls
async function getUser() {
  try {
    const response = await fetch("saved_user.php", {
      method: "GET",
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("login error", error);
  }
}

//function to get teacher lessons
async function getLessons() {
  const user = await getUser();
  showLoader("fetching teacher lessons...");
  try {
    const response = await fetch("lesson.php", {
      method: "POST",
    });
    const result = await response.json();
    const thisSchool = result.filter((t) => t.schoolId === user.schoolId);
    return thisSchool;
  } catch (error) {
    console.log("lessons error", error);
  } finally {
    removeLoader();
  }
}

//function to get events
async function getEvents() {
  showLoader("getting events, please wait...");
  const user = await getUser();
  try {
    const response = await fetch("events.php", {
      method: "POST",
    });
    const result = await response.json();
    const thisSchool = result.filter((t) => t.schoolId === user.schoolId);
    return thisSchool;
  } catch (error) {
    console.log("events error", error);
  } finally {
    removeLoader();
  }
}

//add event function
async function addEvent() {
  if (new Date() > date) {
    showErrorMessage("date is due");
    return;
  }
  openModal();
}

//function to add and highlight holidays
function highlightHolidays() {
  thisMonthDates.forEach((monthDate) => {
    const currentDate = monthDate.querySelector("p").textContent.trim();
    const currentMonth = date.getMonth() + 1;

    const holiday = holidays.find(
      (day) => day.date === `${currentDate}/${currentMonth}`
    );
    if (holiday) {
      monthDate.innerHTML = "";
      const innerDiv = document.createElement("div");
      innerDiv.className = "gray";
      monthDate.classList.add("padding");
      monthDate.classList.add("gray-border");
      innerDiv.innerHTML = `
        <p>${currentDate}</p>
        <span class="text">${holiday.tittle}</span>
      `;
      monthDate.appendChild(innerDiv);
    }
  });
}

//function highlight saved events
async function highlightSavedEvents() {
  const events = await getEvents();
  const user = await getUser();
  const myEvents = events.filter((evt) => {
    const userMatch = evt.user === user.code;
    const allMatch = evt.destination === "all";
    const desMatch = evt.destination === user.from;
    const classMatch = evt.destination === `${user.class}${user.stream}`;

    return userMatch || allMatch || classMatch;
  });

  if (myEvents.length > 0) {
    myEvents.forEach((event) => {
      const currentDiv = thisMonthDates.find((div) => {
        const p = parseInt(div.textContent.trim());
        const currentDate = `${p}/${date.getMonth() + 1}/${date.getFullYear()}`;
        return event.date === currentDate;
      });

      if (currentDiv) {
        const innerDiv = document.createElement("div");
        innerDiv.innerHTML = `
          <p>${event.date.split("/")[0]}</p>
          <span class="text">${event.tittle}</span>
        `;
        currentDiv.innerHTML = "";
        currentDiv.classList.add("padding");

        switch (event.category) {
          case "educative":
            currentDiv.classList.add("green-border");
            innerDiv.classList.add("green");
            break;
          case "personal":
            currentDiv.classList.add("yellow-border");
            innerDiv.classList.add("yellow");
            break;
          case "meeting":
            currentDiv.classList.add("blue-border");
            innerDiv.classList.add("blue");
            break;
          case "reminder":
            currentDiv.classList.add("red-border");
            innerDiv.classList.add("red");
            break;
        }
        currentDiv.appendChild(innerDiv);
        currentDiv.addEventListener("dblclick", () => {
          saveEvent(event);
        });
      }
    });
  }
}

let doneEvents = [];
async function saveEvent(event) {
  const user = await getUser();
  const savedEventObj = {
    date: event.date,
    desc: event.tittle,
    user: user.code,
  };
  if (!doneEvents.some((evt) => evt.date === event.date)) {
    doneEvents.push(savedEventObj);
  }
  localStorage.setItem("doneEvents" , JSON.stringify(doneEvents));
}

highlightSavedEvents();

//accesorry functions
function verifyInputs() {
  let allFilled = true;
  const allInputs = eventBox.querySelectorAll(".required");
  allInputs.forEach((input) => {
    input.style.backgroundColor = "whitesmoke";
    input.style.borderColor = "navy";
  });

  allInputs.forEach((input) => {
    if (input.value === "") {
      allFilled = false;
      input.style.backgroundColor = "#ffe5e5";
      input.style.borderColor = "red";
    }
  });

  if (allFilled) {
    return true;
  } else {
    showErrorMessage("please fill in all required fields");
    return false;
  }
}

function closeModal() {
  eventBox.style.opacity = "0";
  eventBox.style.transform = "scale(.3) translateY(-100vh)";
  setTimeout(() => {
    modalContainer.style.height = "0";
    eventBox.style.display = "none";
  }, 400);
}

function openModal() {
  const input = eventBox.querySelector("#event-date");
  const selectedDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  input.value = selectedDate;
  modalContainer.style.height = "100vh";
  eventBox.style.display = "flex";
  setTimeout(() => {
    eventBox.style.opacity = "1";
    eventBox.style.transform = "scale(1) translateY(0)";
  }, 400);
}

function showLoader(message) {
  progressContainer.classList.remove("removes");
  progressContainer.classList.add("active");
  const messageText = progressContainer.querySelector(".text");
  messageText.textContent = message;
}

function removeLoader() {
  progressContainer.classList.add("removes");
  progressContainer.classList.remove("active");
}

createCalendar();

//ajax post requests
async function postEvent() {
  showLoader("posting event, please wait");
  const user = await getUser();
  const data = new FormData(eventBox.querySelector("#event-box"));
  data.append("user", user.code);
  data.append("id", user.schoolId);

  try {
    const response = await fetch("eventsubmittion.php", {
      method: "POST",
      body: data,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("posting term event error", error);
  } finally {
    removeLoader();
  }
}

//event listeners
monthSelect.addEventListener("change", () => {
  date.setMonth(monthSelect.value);
  createCalendar();
});

yearSelect.addEventListener("change", () => {
  date.setFullYear(yearSelect.value);
  createCalendar();
});

cancelBtn.addEventListener("click", closeModal);

submitBtn.addEventListener("click", async (e) => {
  e.stopPropagation();
  e.preventDefault();
  const filled = verifyInputs();
  if (filled) {
    const status = await postEvent();
    console.log(status);
    if (status.type) {
      closeModal();
      showSuccessMessage("event added succesfully");
    } else {
      showErrorMessage("error adding event, refreshing page");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }
});

//error functions
function showErrorMessage(message) {
  improvedError.classList.add("show-error");
  improvedError.querySelector("#error-text").textContent =
    message || "an error just occurred";

  setTimeout(hideErrorMessage, 5000);
}

function hideErrorMessage() {
  improvedError.classList.remove("show-error");
  improvedSuccess.classList.remove("show-error");
}

function hideSuccessMessage() {
  improvedSuccess.classList.remove("show-success");
  improvedError.classList.remove("show-error");
}

function showSuccessMessage(messages) {
  improvedSuccess.classList.add("show-success");
  improvedSuccess.querySelector("#error-text").textContent =
    messages || "congrats!";

  setTimeout(hideSuccessMessage, 5000);
}
