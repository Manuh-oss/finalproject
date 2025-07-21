const calendar = document.querySelector(".days-month");
const year = document.getElementById("year");
const month = document.getElementById("month");
const thisYear = new Date().getFullYear();
const modalContainer = document.getElementById("modal-box");
const eventBox = document.getElementById("create-event");
const currentEvent = document.querySelector(".existing-events");
const otherEvent = document.querySelector(".other-events-container");
const events = document.getElementById("event-box");
const cancelBtn = events.querySelector(".cancel");
const submitBtn = events.querySelector("#submit");
console.log(cancelBtn);
console.log(submitBtn);
let thisMonthDates;
let doneEvents = [];
const dones = JSON.parse(localStorage.getItem("doneEvents"));

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

function getUser(callback){
  const xhr = new XMLHttpRequest();
  xhr.open("GET","saved_user.php",true);
  xhr.onload = () => {
    if(xhr.status == 200){
      const response = JSON.parse(xhr.responseText);
      callback(response);
    }
  }
  xhr.send();
}

for (let i = 0; i < 11; i++) {
  const years = currentYear + i;
  const option = document.createElement("option");
  option.value = years;
  option.textContent = years;
  year.appendChild(option);
}

//this creates the calendar
function createCalendar() {
  addColors();
  displayTodayEvent();
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
  }

  for (let y = 1; y < nextDays; y++) {
    const div = document.createElement("div");
    div.className = "prev-months";
    div.innerHTML = `<p>${y}</p>`;
    calendar.appendChild(div);
  }
  const dates = document.querySelectorAll(".normal-border");
  thisMonthDates = dates;
  bindDateDivs();
}

function getLessons(callback){
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "lesson.php" , true);
  xhr.onload = () => {
    try{
      if(xhr.status === 200){
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    }catch(error){
      console.log("Lesson Error" , error);
    }
  }
  xhr.send();
}

//function get events from dtabase
function getEvents(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "events.php", true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.length > 0) {
        callback(response);
      } else {
        const noresult = currentEvent.querySelector(".today-events");
        const show = document.querySelectorAll(".show");
        if (!noresult) {
          show.forEach((s) => (s.style.display = "none"));
          const div = document.createElement("div");
          div.className = "today-events";
          div.innerHTML = `
            <div  class="image">
               <img src="./teachers/images (54).jpeg" alt="">
             </div>
             <h3>there are no events</h3>
           `;
          currentEvent.appendChild(div);
        }
      }
    }
  };
  xhr.send();
}

//function add colors to the events
function addColors() {
  getEvents((events) => {
    getUser((user) => {
      const userEvents = events.filter(e => e.destination === user.from || e.destination === "all" || e.user === user.code || e.destination === ("form"+user.class+user.stream));
      console.log(userEvents)
    thisMonthDates.forEach((dates) => {
      userEvents.forEach((event) => {
        const [day, month, years] = event.date.split("/");
        let texts;
        if (
          parseInt(month) === date.getMonth() + 1 &&
          parseInt(years) === date.getFullYear()
        ) {
          const calendarDate = dates.querySelector("p").textContent;
          if (calendarDate === day) {
            if(dones){
              if(dones.length > 0){
                dones.forEach(done => {
                  if(done.date === `${calendarDate}/${date.getMonth()}/${date.getFullYear()}`){
                     texts =  `✅${event.tittle}`;
                  }else{
                    texts = event.tittle;
                  }
                })
              }
            }else{
                texts = event.tittle
              }
            dates.innerHTML = "";
            dates.classList.remove("normal-border");
            dates.classList.add("padding");
            const newDiv = document.createElement("div");
            newDiv.className = "inner";

            switch (event.category) {
              //if the event is personal
              case "personal":
                    newDiv.innerHTML = `
                    <p>${day}</p>
                    <span class="text">${texts}</span>
                  `;
                    newDiv.classList.add("yellow");
                    dates.classList.add("yellow-border");
                    dates.appendChild(newDiv);
             
              break;
              //if the event is educative
              case "educative":
                newDiv.innerHTML = `
                          <p>${day}</p>
                          <span class="text">${texts}</span>
                        `;
                newDiv.classList.add("green");
                dates.classList.add("green-border");
                console.log(newDiv);
                dates.appendChild(newDiv);
                break;
              case "reminder":
                //if its just a reminder
                newDiv.innerHTML = `
                         <p>${day}</p>
                        <span class="text">${texts}</span>
                       `;
                newDiv.classList.add("red");
                dates.classList.add("red-border");
                console.log(newDiv);
                dates.appendChild(newDiv);
                break;
              case "meeting":
                //if its just a meeting
                newDiv.innerHTML = `
                             <p>${day}</p>
                            <span class="text">${texts}</span>
                           `;
                newDiv.classList.add("blue");
                dates.classList.add("blue-border");
                console.log(newDiv);
                dates.appendChild(newDiv);
                break;
            }
          }
        }
      });
    });
  });
})
}

//function to display todays event if it exist
function displayTodayEvent() {
  getEvents((events) => {
    if (events.length > 0) {
      const found = events.find((e) => e.date === currentDate);
      if (!found) {
        currentEvent.innerHTML = "";
        const div = document.createElement("div");
        div.className = "today-events";
        div.innerHTML = `
            <div  class="image">
               <img src="./teachers/images (54).jpeg" alt="">
             </div>
             <h3>there are no current events</h3>
           `;
        currentEvent.appendChild(div);
      } else {
        currentEvent.innerHTML = "";
        const div = document.createElement("div");
        const [day, month, years] = found.date.split("/");
        div.className = "today-events";
        div.classList.add("exist");
        div.innerHTML = `
          <h4 class="today-day">${days[new Date().getDay()]}</h4>
             <ul style="padding:0 1rem;">
               <li style="padding:1.5rem; border:1px solid navy; border-radius:1rem;">
                 <h3 style="color:black;font-weight:bold;font-size:1.8rem;" class="today-day">${
                   found.tittle
                 }</h3>
                 <p style="color:black;font-weight:bold;font-size:1.1rem;" class="today-day">${
                   months[month - 1]
                 } ${day}, ${years}</p>
                 <p style="font-size:1.2rem;line-height:2rem;">${
                   found.description
                 }</p>
               </li>
             </ul>  
         `;
        currentEvent.style.height = "fit-content";
        currentEvent.appendChild(div);
      }
    } else {
      console.log("not found");
    }
  });
}

// function update event left container
function showCurrentAndOtherEvents() {
  otherEvent.innerHTML = "";
  otherEvent.style.flexGrow = "1";
  getEvents((events) => {
    getUser((user) => {
      const userEvents = events.filter(e => e.destination === user.from || e.destination === "all" || e.user === user.code);
      userEvents.forEach((event) => {
        const div = document.createElement("div");
        const [day, month, years] = event.date.split("/");
        if (parseInt(day) !== new Date().getDate()) {
          if (
            parseInt(month) === date.getMonth() + 1 &&
            parseInt(years) === date.getFullYear()
          ) {
            //this handes the other event boxes and al
            div.className = "other-event-box";
            let duration;
            if (event.from === "" && event.to === "") {
              duration = "allday";
            } else [(duration = `${event.from} - ${event.to}`)];
                div.innerHTML = `
                <div class="date">${addZero.format(day)}</div>
                  <div class="text">
                    <h4>${event.tittle}</h4>
                    <h5>${duration}</h5>
                </div>
              `;
            otherEvent.appendChild(div);
          }
        }
      });
    })
  });
}

//function add holidays
function addHolidays() {
  thisMonthDates.forEach((dates) => {
    holidays.forEach((holiday) => {
      const [day, month] = holiday.date.split("/");
      const calendarDate = dates.querySelector("p").textContent;
      if (
        parseInt(calendarDate) === parseInt(day) &&
        parseInt(month) === date.getMonth() + 1
      ) {
        dates.innerHTML = "";
        dates.classList.remove("normal-border");
        dates.classList.add("padding");
        const newDiv = document.createElement("div");
        newDiv.className = "inner";
        newDiv.innerHTML = `
                             <p>${day}</p>
                             <span class="text">${holiday.tittle}</span>
                           `;
        newDiv.classList.add("gray");
        dates.classList.add("gray-border");
        dates.appendChild(newDiv);
      }
    });
  });
}

//function postCalendar

function postEvents() {
getUser((user) => {
  const formData = new FormData(events);
  const description = document.getElementById("description").value;
  formData.append("event-description", description);
  formData.append("user", user.code);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "eventsubmittion.php", true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.message === "success") {
        showSuccessMessage("event added succesfully");
        hideModal();
        addColors();
        showCurrentAndOtherEvents();
        displayTodayEvent();
      } else if (response.type === "false") {
        if (response.message === "event already exist") {
          showErrorMessage("event already exist");
        } else {
          showErrorMessage("error in submitting event");
          hideModal();
        }
      }
    }
  };
  xhr.send(formData);
})
}

//modal box function
function openModalBox(dates) {
  modalContainer.style.height = "100%";
  eventBox.style.transform = "translateY(0)";
  const eventDate = eventBox.querySelector("#event-date");
  eventDate.value = `${dates}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
//function close modal
function hideModal() {
  modalContainer.style.height = "0";
  eventBox.style.transform = "translateY(-200%)";
}

//function event listeners to all dates in cureent and chnaged months
function bindDateDivs() {
  thisMonthDates.forEach((dates) => {
    dates.addEventListener("dblclick", function () {
      const innerDiv = this.querySelector(".inner");
      const text = this.querySelector(".text");
      const p = this.querySelector("p");
      let texts;
      if (p) {
        if (innerDiv) {
          if (text) {
            if (!innerDiv.classList.contains("marked-done")) {
              let textContent = text.textContent;
              text.style.border = "none";
              text.innerHTML = "";
              text.innerHTML = `✅${textContent}`;
              innerDiv.classList.add("marked-done");
              const doneEvent = {
                date : `${p.textContent}/${date.getMonth()}/${date.getFullYear()}`
              }
              doneEvents.push(doneEvent);
              storeDone();
              if (innerDiv.classList.contains("yellow")) {
                showSuccessMessage("event completed");
              } else if (innerDiv.classList.contains("red")) {
                showSuccessMessage("event completed");
              }
            }
          }
        } else {
          const selectedDay = parseInt(p.textContent);
          const selectedDate = new Date(date.getFullYear(), date.getMonth(), selectedDay);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          selectedDate.setHours(0, 0, 0, 0);
          
          if (selectedDate < today){
            showErrorMessage("date is due");
            return;
          }else{
            openModalBox(p.textContent)
          }
        }
      }
    });
  });
}

//error handling functions

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

function storeDone(){
  localStorage.setItem("doneEvents" , JSON.stringify(doneEvents));
console.log(dones)
}

function convertStream(raw){
  let stream;
  switch(raw){
    case "111":
      stream = "green";
      break;
    case "222":
      stream = "blue";
      break;
    case "333":
      stream = "red";
      break;
    case "444":
      stream = "purple";
      break;
    default :
    stream = "green";        
  }
  return stream;
}

function changeSelectWithUserLogin(){
  getUser((user) => {
    const destinationSelect = document.querySelector(".destination");
    const typeSelect = document.querySelector(".category");
    if(user.from === "student"){
     destinationSelect.style.display = "none";
     destinationSelect.value = "student";
     typeSelect.innerHTML = `
                <option value="">--choose category--</option>
                <option value="educative">educative</option>
                <option value="personal">personal</option>
                <option value="reminder">reminder</option>
     `;
    }else if(user.from === "teacher"){
      getLessons((lessons) => {
        destinationSelect.innerHTML = "";
        const myLessons = lessons.filter(l => l.teacherCode === user.code);
        typeSelect.innerHTML = `
                <option value="">--choose category--</option>
                <option value="educative">educative</option>
                <option value="personal">personal</option>
                <option value="reminder">reminder</option>
        `;
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "select destination";
        destinationSelect.appendChild(defaultOption)
        myLessons.forEach(lesson => {
          const option = document.createElement("option");
          option.value = "form"+lesson.class+lesson.stream;
          option.textContent = "form"+lesson.class+" "+convertStream(lesson.stream);
          destinationSelect.appendChild(option);
        })
      })      
    }else if(user.from === "admin"){

    }
  })
}


//function class
createCalendar();
addColors();
displayTodayEvent();
showCurrentAndOtherEvents();
addHolidays();
bindDateDivs();
changeSelectWithUserLogin()
//event listeners

//monrh select event listener
month.addEventListener("change", function () {
  date.setMonth(month.value);
  createCalendar();
  addHolidays();
  showCurrentAndOtherEvents();
});

//year select event listenser
year.addEventListener("change", function () {
  date.setFullYear(year.value);
  createCalendar();
  addHolidays();
  showCurrentAndOtherEvents();
});

//close modal on cliking the modal container
window.onclick = (event) => {
  if (event.target === modalContainer) {
    hideModal();
  }
};

//cancel btn
cancelBtn.addEventListener("click", hideModal);
submitBtn.addEventListener("click", postEvents);
