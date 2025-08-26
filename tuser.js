const dateDisplay = document.querySelector(".today");
const calendar = document.querySelector(".calendar");
const notificationContainer = document.querySelector(".notification");
const date = new Date();

const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const progressContainer = document.getElementById("container");
const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const sessionsobject = {
  first: "lesson1",
  second: "lesson2",
  third: "lesson3",
  forth: "lesson4",
  fifth: "lesson5",
  sixth: "lesson6",
  seventh: "lesson7",
  eigth: "lesson8",
  ninth: "lesson9",
  tenth: "lesson10",
};

const subjectIcons = {
  english: "fa-book",
  kiswahili: "fa-language",
  mathematics: "fa-calculator",
  chemistry: "fa-flask",
  biology: "fa-leaf",
  physics: "fa-atom",
  geography: "fa-globe",
  history: "fa-landmark",
  cre: "fa-church",
  business: "fa-chart-line",
  agriculture: "fa-tractor",
  computer: "fa-desktop",
  french: "fa-flag",
  subject14: "fa-music",
  subject15: "fa-clipboard",
  subject16: "fa-chalkboard",
};
const subjectBgImages = {
  english: "./subjects/language.jpg",
  kiswahili: "./subjects/language.jpg",
  mathematics: "./subjects/math-bj.jpg",
  chemistry: "./subjects/phyc-bg.jpg",
  biology: "./subjects/biology-bg.jpg",
  physics: "./subjects/phyc-bg.jpg",
  geography: "./subjects/geo-bg.jpg",
  cre: "./subjects/geo-bg.jpg",
  history: "./subjects/geo-bg.jpg",
  business: "./subjects/tech-bg.jpg",
  french: "./subjects/tech-bg.jpg",
  agriculture: "./subjects/tech-bg.jpg",
  computer: "./subjects/phyc-bg.jpg",
  subject14: "./subjects/tech-bg.jpg",
  subject15: "./subjects/geo-bg.jpg",
  subject16: "./subjects/language.jpg",
};

const myDefaultSubjects = [
  "english",
  "kiswahili",
  "mathematics",
  "chemistry",
  "biology",
  "physics",
  "geography",
  "history",
  "cre",
  "business",
  "agriculture",
  "computer",
  "french",
  "subject14",
  "subject15",
  "subject16",
];

const today =
  date.getDate() + " " + months[date.getMonth()] + "," + date.getFullYear();

const userDays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const lowerClasses = [
  "pp1",
  "playgroup",
  "pp2",
  "grade 1",
  "grade 2",
  "grade 3",
  "grade 4",
  "grade 5",
  "grade 6",
];
const higherClases = [
  "grade 7",
  "grade 8",
  "grade 9",
  "grade 10",
  "grade 11",
  "grade 12",
];

const allClasesTimes = [
  {
    lesson1: "8:10-8:45",
    lesson2: "8:45-9:20",
    lesson3: "9:30-10:05",
    lesson4: "10:05-10:50",
    lesson5: "11:30-12:05",
    lesson6: "12:05-12:40",
    lesson7: "2:00-2:35",
    lesson8: "2:35-3:10",
  },
  {
    lesson1: "8:00-8:40",
    lesson2: "8:40-9:20",
    lesson3: "9:30-10:10",
    lesson4: "10:10-10:50",
    lesson5: "11:30-12:10",
    lesson6: "12:10-12:50",
    lesson7: "2:00-2:40",
    lesson8: "2:40-3:20",
    lesson9: "3:20-4:00",
  },
];

const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const eventColors = {
  meeting: "#1e90ff",
  educative: "#228b22",
  personal: "#ff7043",
  reminder: "#c62828",
};

//ajax functions
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

//function to get teachers
async function getTeachers() {
  const user = await getUser();
  try {
    const response = await fetch("teachers.php", {
      method: "POST",
    });
    const result = await response.json();
    const thisSchool = result.filter((t) => t.schoolId === user.schoolId);
    return thisSchool;
  } catch (error) {
    console.log("teachers error", error);
  } finally {
    removeLoader();
  }
}

async function getStudents() {
  const user = await getUser();
  try {
    const response = await fetch("students.php", {
      method: "POST",
    });
    const result = await response.json();
    const thisSchool = result.filter((s) => s.schoolId === user.schoolId);
    return thisSchool;
  } catch (error) {
    console.log("teachers error", error);
  } finally {
    removeLoader();
  }
}

//function to get teacher lessons
async function getLessons() {
  const user = await getUser();
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

//function to get marks
async function getMarks() {
  const user = await getUser();
  const data = new FormData();
  data.append("class", "");
  data.append("exam", "");
  data.append("term", "");
  data.append("id", "");

  try {
    const response = await fetch("result.php", {
      method: "POST",
      body: data,
    });
    const result = await response.json();
    const schoolResult = result.filter((r) => r.schoolId === user.schoolId);
    return schoolResult;
  } catch (error) {
    console.log("marks error", error);
  } finally {
    removeLoader();
  }
}

//function to get school details
async function getSetup() {
  try {
    const user = await getUser();
    const response = await fetch("getsetup.php", {
      method: "POST",
    });
    const result = await response.json();
    const thisSchool = result.filter((s) => s.schoolId === user.schoolId);
    return thisSchool;
  } catch (error) {
    console.log("setup error", error);
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

async function getTeacherSessions(code) {
  const user = await getUser();
  const data = new FormData();
  data.append("teacherCode", code);
  data.append("id", user.schoolId);
  try {
    const response = await fetch("teachersessions.php", {
      method: "POST",
      body: data,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("teacher sessions error", error);
  }
}

function getSessionArray(rawSessions) {
  let mySessions = [];
  const notAllowed = ["day", "class", "stream", "schoolId", "teacherCode"];
  if (rawSessions.length === 0) return [];
  rawSessions.forEach((daySes, idx) => {
    const day = days[idx];
    Object.entries(daySes).forEach(([key, value]) => {
      if (!notAllowed.includes(key) && value !== "") {
        if (value !== "") {
          const sessionKey = Object.keys(sessionsobject).find(
            (ses) => sessionsobject[ses] === key
          );
          let sessionObject;

          if (value === "occupied") {
            sessionObject = {
              id: `${key}`,
              name: "",
              type: "",
              subject: "occupied",
            };
          }

          if (value.split("-").length === 3) {
            sessionObject = {
              id: `${key}`,
              name: value.split("-")[1],
              type: value.split("-")[2],
              subject: value.split("-")[0],
            };
          } else if (value.split("-").length === 4) {
            sessionObject = {
              id: `${key}`,
              subject: value.split("-")[0],
              class: value.split("-")[1],
              stream: value.split("-")[2],
              type: value.split("-")[3],
            };
          }

          if (!mySessions.some((s) => s.id === sessionObject.id)) {
            mySessions.push(sessionObject);
          }
        }
      }
    });
  });
  return mySessions;
}

//accessory functions

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

function formatDate(date) {
  return `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}-${date.getDay()}`;
}

function normalise(string) {
  return string.toLowerCase().trim().replace(" ", "");
}

function convertExam(rawExam) {
  switch (rawExam) {
    case "11":
      return "opener";
      break;
    case "22":
      return "midterm";
      break;
    case "33":
      return "endterm";
      break;
    default:
      return "midterm";
  }
}

function getTotalMinutes(rawTime) {
  const [hour, minute] = rawTime.split(":");
  return Number(minute) + Number(hour) * 60;
}

function incrementLessonKey(lessonKey) {
  const match = lessonKey.match(/^lesson(\d+)$/i);
  if (!match) return null; // not a valid lesson key
  const num = parseInt(match[1], 10);
  return `lesson${num + 1}`;
}

/*
  main functions start here
*/

async function updateWelcomeMessage() {
  const user = await getUser();
  const teachers = await getTeachers();
  const thisUser = teachers.find((t) => t.teacherCode === user.code);

  if (thisUser) {
    const data = [
      {
        h2: `welcome back ${thisUser.firstname}`,
        p: "Welcome to your Teacher’s Dashboard — a centralized space where you can manage class registers, assign subjects, track student progress, and stay updated with school activities, all designed to make your teaching experience smoother and more efficient.",
        img: "./subjects/profile.jpg",
        a: [`${today}`, "#"],
      },
      {
        h2: "📋 Update Class Register",
        p: "Submit and update your class register with ease to keep attendance accurate and up to date. This helps maintain clear records for both student participation and overall class management.",
        img: "./subjects/register.jpg",
        a: ["view regiter", "register.html"],
      },
      {
        h2: "Manage Topic Selection",
        p: "Select or manage lesson topics to guide what your class will learn each day. Keeping topics organized ensures structured teaching and smooth lesson delivery.",
        img: "./subjects/topics.avif",
        a: ["update topics", "topics.html"],
      },
      {
        h2: "View School Events",
        p: "Stay informed about upcoming and past school events directly from your dashboard. This feature keeps you connected with important activities across the school.",
        img: "./subjects/eventsImage.avif",
        a: ["view scheduled events", "admincalendar.html"],
      },
      {
        h2: "Assign Students to Subjects",
        p: "Easily assign students to the subjects they should study in your class. This keeps records organized and ensures each student is linked to the correct subjects for lessons, exams, and reports.",
        img: "./subjects/select.avif",
        a: ["select students", "teacherselection.html"],
      },
    ];
    return data;
  } else {
    showLoader("user was not found, redirecting to main page");
    setTimeout(() => {
      window.location.href = "main.html";
    }, 4000);
  }
}

let done = [];
let currentindex = 0;

const welcomeMesage = document.querySelector(".main .welcome-message");

async function showSlideShow() {
  const sliders = await updateWelcomeMessage();
  if (currentindex >= sliders.length) {
    currentindex = 0;
  }
  welcomeMesage.innerHTML = "";
  const currentSlider = sliders[currentindex];
  const text = document.createElement("div");
  text.className = "text";
  text.style.transform = "scale(.8)";
  text.style.opacity = "0";
  text.innerHTML = `
       <h2>${currentSlider.h2}</h2>
       <p>${currentSlider.p}</p>
       <a href='${currentSlider.a[1]}'>${currentSlider.a[0]}</a>
     `;

  const image = document.createElement("div");
  image.className = "image";
  image.style.transform = "scale(.8)";
  image.style.opacity = "0";
  image.innerHTML = `
        <img src="${currentSlider.img}" alt="" />
     `;

  welcomeMesage.appendChild(text);
  welcomeMesage.appendChild(image);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      image.style.transform = "scale(1)";
      image.style.opacity = "1";
      text.style.transform = "scale(1)";
      text.style.opacity = "1";
    });
  });

  currentindex++;
}

showSlideShow();
setInterval(showSlideShow, 5000);

/* calendar function*/

async function displayCalendar() {
  const dates = await getAllDates();
  const allEvents = await getEvents();
  const spans = document.querySelector(".calendar .body");
  const eventDesc = document.querySelector(".calendar .event");
  spans.innerHTML = "";

  for (const [day, date] of Object.entries(dates)) {
    const [dates, days] = formatDate(date).split("-");
    const event = allEvents.find((evt) => evt.date === dates);
    const span = document.createElement("span");
    span.innerHTML = `
       <h3>${shortDays[days]}</h3>
       <h4>${dates.split("/")[0]}</h4>
     `;
    if (
      event &&
      (event.destination === "all" || event.destination === "teacher")
    ) {
      span.style.backgroundColor = eventColors[event.category];
      span.style.color = "#fff";
      if (event && day === "today") {
        eventDesc.innerHTML = `
          <h3>${event.tittle}</h3>
          <h4>${event.description}</h4>
        `;
      }
    }
    spans.appendChild(span);
  }
}
displayCalendar();

function getAllDates() {
  const twoDaysAfter = new Date(date);
  twoDaysAfter.setDate(date.getDate() + 2);
  const twoDaysBefore = new Date(date);
  twoDaysBefore.setDate(date.getDate() - 2);
  const oneDaysAfter = new Date(date);
  oneDaysAfter.setDate(date.getDate() + 1);
  const oneDaysBefore = new Date(date);
  oneDaysBefore.setDate(date.getDate() - 1);

  return {
    twoDB: twoDaysBefore,
    oneDB: oneDaysBefore,
    today: new Date(),
    oneDA: oneDaysAfter,
    twoDA: twoDaysAfter,
  };
}

/* marks function start here */
let currentMarkIndex = 0;
async function getMarksChartData() {
  const lessons = await getLessons();
  const marks = await getMarks();
  const students = await getStudents();
  const user = await getUser();

  const allExams = {};

  const myLessons = lessons.filter((les) => les.teacherCode === user.code); //get all user clases
  if (myLessons.length > 0) {
    for (const lesson of myLessons) {
      const classResults = marks.filter((mark) => {
        const classMatch = normalise(mark.class) === normalise(lesson.class);
        const streamMatch = normalise(mark.stream) === normalise(lesson.stream);

        if (streamMatch && classMatch) {
          const exam = `${mark.class}-${mark.stream}-${convertExam(
            mark.exam
          )}-term${mark.term}`;
          if (!allExams[exam]) {
            allExams[exam] = [];
          }
          allExams[exam].push(Number(mark[lesson.subject]));
        }
      });
    }
  }

  const allExamEntries = Object.entries(allExams);

  // Check if we are at the end of the array and reset if needed
  if (currentMarkIndex >= allExamEntries.length) {
    currentMarkIndex = 0;
  }

  const currentExam = allExamEntries[currentMarkIndex];

  if (currentExam[1].length > 0) {
    const completed = currentExam[1].filter((m) => m !== 0);
    const progress = (completed.length / currentExam[1].length) * 100;
    displayChart(currentExam);
    displayMarkProgrees(progress, currentExam[0].split("-"));
  }

  currentMarkIndex++;
}

let chart = null;
function displayChart(data) {
  if (chart !== null) chart.destroy();
  const canvas = document.getElementById("my-chart").getContext("2d");
  const gradient = canvas.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "blue");
  gradient.addColorStop(1, "white");
  const values = data[1];

  const chartData = {
    labels: values.map((val, index) => index + 1),
    datasets: [
      {
        data: data[1].sort((a, b) => b - a),
        label: data[0].split("-").join(" "),
        fill: true,
        backgroundColor: gradient,
        borderWidth: 1,
        borderColor: "blue",
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  chart = new Chart(canvas, {
    type: "line",
    data: chartData,
  });
}

function displayMarkProgrees(progress, currentClass) {
  const outerCircle = document.querySelector(".progress");
  const text = document.querySelector(".percentage");
  text.textContent = progress.toFixed(1);

  const circumference = Math.PI * 54 * 2;
  outerCircle.style.strokeDasharray = circumference;

  const offset = circumference - (progress / 100) * circumference;
  outerCircle.style.strokeDashoffset = offset;
}

getMarksChartData();
setInterval(getMarksChartData, 6000);
/* marks function end here */

/* my sessions function start here */

async function displayMySessions() {
  const user = await getUser();
  const mySessions = await getTeacherSessions(user.code);

  const todaySessions = mySessions.filter(
    (ses) => ses.day === userDays[date.getDay()]
  );
  const allSessions = getSessionArray(todaySessions);
  const sessionDiv = document.querySelector(".my-classes-box .body");
  const timeNow = date.getHours() + ":" + date.getMinutes();
  const rawTimeNow = getTotalMinutes(timeNow);

  for (const [idx, session] of allSessions.entries()) {
    if (session.subject !== "occupied") {
      const classValue = session.class;
      let sessionTimes;
      if (higherClases.includes(classValue)) {
        sessionTimes = allClasesTimes[1];
      } else if (lowerClasses.includes(classValue)) {
        sessionTimes = allClasesTimes[0];
      }

      const [lessonFrom, lessonTo] = sessionTimes[session.id].split("-");
      const box = document.createElement("div");
      box.className = "box";

      //box initial styles
      box.style.background = `url(${
        subjectBgImages[session.subject.toLowerCase()]
      })`;
      box.style.opacity = "0";
      box.style.transform = "scale(.8)";
      box.style.transitionDelay = `${0.2 * idx}s`;

      let type;
      let to;
      session.type === "d" ? (type = "double") : (type = "single");

      if (type === "double") {
        const [lessonFrom, lessonTo] =
          sessionTimes[incrementLessonKey(session.id)].split("-");
        to = lessonTo;
      } else {
        to = lessonTo;
      }

      const allowed = [1, 2, 3, 4, 5];
      const difference = getTotalMinutes(lessonFrom) - rawTimeNow;
      box.innerHTML = `
        <div class="opacity">
          <h3><i class="fa ${subjectIcons[normalise(session.subject)]}"></i> ${
        session.subject
      } (${type})</h3>
          <h4><i class="fa fa-clock"> ${lessonFrom} - ${to}</i></h4>
          <h5>${session.class} ${session.stream}</h5>
          <h5>25 students</h5>
        </div>
      `;

      if (allowed.includes(difference)) {
        box.style.animation = "scale 1s ease-in-out infinite";
      } else if (
        getTotalMinutes(lessonFrom) < rawTimeNow &&
        getTotalMinutes(to) > rawTimeNow
      ) {
        const h4 = box.querySelector("h4");
        h4.textContent = "lesson ongoing";
      }

      console.log(rawTimeNow);
      console.log(getTotalMinutes(lessonFrom));
      console.log(getTotalMinutes(to));

      sessionDiv.appendChild(box);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          box.style.opacity = "1";
          box.style.transform = "scale(1)";
        });
      });
    }
  }
}

displayMySessions();
/* my sessions function end here */

async function getNotificaions() {
  const user = await getUser();
  try {
    const response = await fetch("getnotifications.php", {
      method: "POST",
    });
    const result = await response.json();

    const thisSchool = result.filter((n) => n.schoolId === user.schoolId);
    return thisSchool;
  } catch (error) {
    console.log("notification error", error);
  }
}

async function displayNotifications() {
  const lessons = await getLessons();
  const notifications = await getNotificaions();
  let myNotifications;
  lessons.forEach((lesson) => {
    myNotifications = notifications.filter((not) => {
      const [user, clas] = not.destination.split("-");
      return (user === "teacher" && clas === lesson.class) || "all";
    });
  });

  if (myNotifications.length > 0) {
    const ul = notificationContainer.querySelector("ul");
    ul.innerHTML = "";

    myNotifications.forEach((notification, idx) => {
      const atag = getRedirection(notification.type);
      const li = document.createElement("li");

      li.style.opacity = "0";
      li.style.transform = "scale(.8)";
      li.style.transitionDelay = `${0.3 * idx}s`;

      li.innerHTML = `
             <i class="fa fa-comment"></i>
             <p>${notification.message}</p>
         `;
      ul.appendChild(li);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          li.style.opacity = "1";
          li.style.transform = "scale(1)";
        });
      });

      const nextLi = document.createElement("li");
      const [type, href, info] = notification.type.split("-");
      nextLi.className = "expanded";
      nextLi.style.display = "none";
      nextLi.innerHTML = `
            <div class="head">
                  <i class="fa-regular fa-comment"></i>
                  <h3>${type} <i class="fa fa-angle-down"></i></h3>
               </div>
               <div class="body">
                  <p>${notification.desc}</p>
               </div>
               <div class="link">
                  <a href="${atag.href}">${atag.text}</a>
               </div>
         `;
      ul.appendChild(nextLi);

      li.addEventListener("click", () => {
        const next = li.nextElementSibling;
        if (next.classList.contains("expanded")) {
          li.style.display = "none";
          next.style.display = "flex";
        }
      });

      nextLi.addEventListener("click", () => {
        const prev = nextLi.previousElementSibling;
        if (prev) {
          nextLi.style.display = "none";
          prev.style.display = "flex";
        } else {
          alert("error");
        }
      });
    });
  }
}

function getRedirection(nottype) {
  const [type, href, info] = nottype.split("-");
  switch (href) {
    case "topic":
      return {
        href: "#",
        text: "mark as read",
      };
      break;
    case "exam":
      return {
        href: `marks2.html`,
        text: "check it out",
      };
      break;
    default:
      return {
        href: "#",
        text: "mark as read",
      };
  }
}

displayNotifications();

//
const displineRecord = document.querySelector(".top button");
const displineBox = document.getElementById("discpline-record");

const close = displineBox.querySelector(".close-dis");
const submit = displineBox.querySelector(".submit-dis");

const allInputs = Array.from(displineBox.querySelectorAll("input"));

close.addEventListener("click", () => {
  displineBox.style.opacity = "0";
  displineBox.style.transform = "scale(.3)";

  setTimeout(() => {
    displineBox.style.display = "none";
  }, 1000);
});

displineRecord.addEventListener("click", () => {
  displineBox.style.display = "flex";

  requestAnimationFrame(() => {
    displineBox.style.opacity = "1";
    displineBox.style.transform = "scale(1)";
  });
});

submit.addEventListener("click" , async() => {
  const filled = verifySelects(allInputs);

  if(filled){
   const response = await postDisplineRecord();
   if(response.type){
      displineBox.style.opacity = "0";
      displineBox.style.transform = "scale(.3)";

      setTimeout(() => {
        displineBox.style.display = "none";
        showSuccessMessage("record added successfully")
      }, 1000);
   }
  }
})

function verifySelects(array) {
  let allFilled = true;
  array.forEach((select) => select.classList.remove("errors"));
  array.forEach((select) => {
    if (select.value == -"") {
      select.classList.add("errors");
      allFilled = false;
    }
  });

  if (allFilled) {
    return true;
  } else {
    return false;
  }
}

async function postDisplineRecord() {
  const user = await getUser();
  const data = new FormData();
  data.append("date", allInputs[0].value);
  data.append("location", allInputs[1].value);
  data.append("admission", allInputs[2].value);
  data.append("incident", allInputs[3].value);
  data.append("action", allInputs[4].value);
  data.append("user", user.code);
  data.append("id", user.schoolId);

  try{
    const response = await fetch("postrecords.php" , {
      method : 'POST',
      body : data
    }) 
    const result = await response.json();
    return result;
  }catch(error){
    console.log("posting displine error" , error);
  }finally{
    removeLoader();
  }
}

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
