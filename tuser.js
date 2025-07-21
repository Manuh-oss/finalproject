const dateDisplay = document.querySelector(".today");
const calendar = document.querySelector(".calendar");
const notificationContainer = document.querySelector(".notification");
const date = new Date();

date.setHours(new Date().getHours() - 15);
date.setDate(new Date().getDate() - 3)

let subject;
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
  computer: "./subjects/tech-bg.jpg",
  french: "./subjects/tech-bg.jpg",
  agriculture: "./subjects/tech-bg.jpg",
};
const lessonTime = {
  lesson1: "08:00-08:40/am",
  lesson2: "08:40-09:20/am",
  shortBreak: "09:20-09:30",
  lesson3: "09:30-10:10/am",
  lesson4: "10:10-10:50/am",
  longBreak: "10:50-11:10",
  lesson5: "11:10-11:50/am",
  lesson6: "11:50-12:30/pm",
  lesson7: "12:30-13:10/pm",
  lunch: "13:10-14:00",
  lesson8: "14:00-14:40/pm",
  lesson9: "14:00-15:20/pm",
  lesson10: "15:20-16:00/pm",
};
const days = ["sun", "mon", "tue", "wed", "thur", "fri", "sat"];
const today =
  date.getDate() + " " + months[date.getMonth()] + ", " + date.getFullYear();
dateDisplay.textContent = today;
//function to get events
function getEvents(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "events.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Events error", error);
    }
  };
  xhr.send();
}

//function to get logged in user
function getUser(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "saved_user.php", true);
  xhr.onload = () => {
    if (xhr.status == 200) {
      const response = JSON.parse(xhr.responseText);
      callback(response);
    }
  };
  xhr.send();
}

//function get student details
function getStudent(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "students.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Student error", error);
    }
  };
  xhr.send();
}

//function to get studeent marks
function getStudentMarks(callback) {
  const data = new FormData();
  data.append("term", "");
  data.append("exam", "");
  data.append("class", "");
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "result.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Result error", error);
    }
  };
  xhr.send(data);
}

//function to get user lessons taught
function getLessons(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "lesson.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const resonse = JSON.parse(xhr.responseText);
        callback(resonse);
      }
    } catch (error) {
      console.log("Lesson error", error);
    }
  };
  xhr.send();
}

//function to get teacher timetable
function getTeacherTimetable(callback, code) {
  const tcode = new FormData();
  tcode.append("teacherCode", code);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "teachertimetable.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("teacher error", error);
    }
  };
  xhr.send(tcode);
}

//function to et notifications
function getNotifications(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "getnotifications.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Notification error", error);
    }
  };
  xhr.send();
}

//calendar section start here
function getCalendarValues(baseDate = new Date()) {
  const oneDayBefore = new Date(baseDate);
  oneDayBefore.setDate(baseDate.getDate() - 1);

  const twoDaysBefore = new Date(baseDate);
  twoDaysBefore.setDate(baseDate.getDate() - 2);

  const oneDayAfter = new Date(baseDate);
  oneDayAfter.setDate(baseDate.getDate() + 1);

  const twoDaysAfter = new Date(baseDate);
  twoDaysAfter.setDate(baseDate.getDate() + 2);
  const today = baseDate;

  return {
    oneDayBefore,
    twoDaysBefore,
    today,
    oneDayAfter,
    twoDaysAfter,
  };
}

function displayCalendar() {
  getEvents((events) => {
    getUser((user) => {
      const calendarValues = getCalendarValues();
      const calendarDates = Object.values(calendarValues).map((cal) =>
        getCalendarDates(cal)
      );
      displayEvents(events);
      const body = calendar.querySelector(".body");
      body.innerHTML = "";
      const dates = Object.values(calendarValues);
      calendarDates.forEach((date, idx) => {
        const myEvent = events.find(
          (evt) =>
            evt.date === date && //acording to date
            (evt.destination === "teacher" || //checks if the suer submited or he has one
              evt.user === user.code)
        );
        const span = document.createElement("span");
        if (idx == 2) {
          //to highlight today
          span.style.backgroundColor = "#0052a5";
          span.style.color = "#eee";
          span.style.transform = "scale(1.2)";
          span.style.transition = "transform .4s linear";
        }
        if (myEvent) {
          //if there is an event
          span.style.backgroundColor = `${getBgColor(myEvent.category).bg}`;
          span.style.color = `${getBgColor(myEvent.category).cl}`;
        }
        span.innerHTML = `
        <h3>${days[dates[idx].getDay()]}</h3>
        <h4>${dates[idx].getDate()}</h4>
        `;
        body.appendChild(span);
      });
    });
  });
}

function displayEvents(events) {
  getUser((user) => {
    const calendarValues = getCalendarValues();
    const dates = Object.values(calendarValues);
    const today = getCalendarDates(dates[2]);

    const todayEvents = events.find(
      (evt) =>
        evt.date === today &&
        (evt.user === user.code || evt.destination === "teacher")
    );

    const evntBox = calendar.querySelector(".event");

    if (todayEvents) {
      evntBox.innerHTML = `
          <h3>${todayEvents.tittle}</h3>
          <p>${todayEvents.description}</p>
      `;
    } else {
      evntBox.innerHTML = `
          <h3>no events</h3>
          <p></p>
        `;
    }
  });
}

function getCalendarDates(constructor) {
  return (
    constructor.getDate() +
    "/" +
    (constructor.getMonth() + 1) +
    "/" +
    constructor.getFullYear()
  );
}

function getBgColor(category) {
  switch (category) {
    case "educative":
      return {
        bg: "#228B22",
        cl: "#fff",
      };
      break;
    case "reminder":
      return {
        bg: "#C62828",
        cl: "#fff",
      };
      break;
    case "personal":
      return {
        bg: "#FF7043",
        cl: "#fff",
      };
      break;
    case "meeting":
      return {
        bg: "#1E90FF",
        cl: "#fff",
      };
      break;
    default:
      return "#eee";
  }
}
//calendar section end here

/*notification code sand function strart here future manuh */
function displayNotifications() {
  getNotifications((notifications) => {
    getLessons((lessons) => {
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

        myNotifications.forEach((notification) => {
          const atag = getRedirection(notification.type);
          const li = document.createElement("li");
          li.innerHTML = `
             <i class="fa fa-comment"></i>
             <p>${notification.message}</p>
         `;
          ul.appendChild(li);
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
    });
  });
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
/*notification code sand function strart end future manuh */

/*msrks functions the graph and the progress functions */
let doneClases = [];
let examQueue = [];
function handleMarks() {
  getStudentMarks((studentMarks) => {
    getStudent((students) => {
      getLessons((lessons) => {
        getUser((user) => {
          let organisedExamData = {};
          /* steps to take
            1. we going to loop through each lesson taught
            2. we going to the the class and the marks fro that class
            3. we going to check for all available exams
            4. we going to check how many students exist 
            5. we going to the out of themwho has their marks at zero
        */
          const myLessons = lessons.filter((l) => l.teacherCode === user.code);
          let randomClass;
          if (myLessons.length > 0) {
            //if user teaches lessons
            let tries = 0;
            do {
              const random = Math.floor(Math.random() * myLessons.length);
              randomClass = myLessons[random];
              tries++;
              if (tries > 1000) break; // safety stop
            } while (
              doneClases.some(
                (c) =>
                  c.class === randomClass.class &&
                  c.stream === randomClass.stream
              )
            );
            if (doneClases.length === myLessons.length) doneClases = [];
            doneClases.push(randomClass);

            const myClassData = studentMarks.filter((marks) => {
              return (
                marks.class === randomClass.class &&
                marks.stream === randomClass.stream
              );
            }); //this filters this class marks data

            myClassData.forEach((classData) => {
              const exam = classData.exam;
              const term = classData.term;
              //this is to organise the data
              if (!organisedExamData[exam + "-" + term]) {
                organisedExamData[exam + "-" + term] = [];
              }
              //this finds the student detai;s
              const studentDetails = students.find(
                (s) => s.admission === classData.admission
              );
              //if student exist
              if (studentDetails) {
                //and does the subject
                if (studentDetails[randomClass.subject] !== "not-selected") {
                  //this pushes the user subject taught
                  organisedExamData[exam + "-" + term].push(
                    classData[randomClass.subject]
                  );
                }
              }
            });

            subject = randomClass.subject;

            /*
              i know you will probably wonder how i did this lets break it down future manuh
              the examQueue is an array and the organisedExamData is an object with keys and values
              this is the structue of organisedExamData 
              {
                11-1 : [array of marks]
                22-1 : [array of marks]
                33-1 : [array of marks]
              }
              so when i pass examQueues to ObjectEntries in organisedExamData(shown bellow)
              the examQueues structure looks like
              [
               ["11-1" , [array of marks]]
               ["22-1" , [array of marks]]
               ["33-1" , [array of marks]]
              ]
               because this is an array we have some addedfunctionalities and functions
               we used shift to remove the first element in the array
               so it becomes [
                ["22-1" , [array of marks]]
                ["33-1" , [array of marks]]
               ]
                understoofd manuh
            */

            examQueue = Object.entries(organisedExamData);

            if (examQueue.length > 0) {
              const [exam, data] = examQueue[0];
              displayMarksProgress(exam, data);
              displayChart(exam, data);
            } else {
              handleMarks(); // If class has no exam data, skip to next
            }
          }
        });
      });
    });
  });
}

function showNextExamProgress() {
  examQueue.shift(); //this removes the first array

  if (examQueue.length > 0) {
    const [exam, data] = examQueue[0];
    displayMarksProgress(exam, data);
    displayChart(exam, data);
  } else {
    handleMarks(); // Move to next class
  }
}

function displayMarksProgress(exam, examData) {
  const notFilledMarks = examData.filter((mark) => Number(mark) === 0);
  const filledCount = examData.length - notFilledMarks.length;
  const percentageDone = (filledCount / examData.length) * 100;

  const circle = document.querySelector(".marks-completion .progress");
  const text = document.querySelector(".marks-completion .percentage");
  const examText = document.querySelector(".exam-text");

  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = `${circumference}`;
  circle.style.strokeDashoffset = `${
    circumference - (percentageDone / 100) * circumference
  }`;

  // Optional: log or update text
  const [exams, term] = exam.split("-");
  text.textContent = percentageDone.toFixed(1) + "%";
  examText.textContent = `term${term} ${converExam(exams)}`;
}

let chart = null;
function displayChart(exam, examData) {
  if (chart !== null) {
    chart.destroy();
  }
  const ctx = document.getElementById("my-chart").getContext("2d");

  // Create gradient fill
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "blue");
  gradient.addColorStop(1, "white");

  const [exams, term] = exam.split("-");

  const newData = examData.map((m) => Number(m)).filter((m) => m !== 0);

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: newData.map((_, index) => `#${index + 1}`),
      datasets: [
        {
          label: `${subject}`,
          data: Object.values(newData).sort(),
          fill: true, // enable area under the line
          backgroundColor: gradient,
          borderWidth: 1,
          borderColor: "blue",
          tension: 0.4, // smooth curves
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          ticks: {
            font: {
              size: 6,
              family: "Arial",
              style: "italic",
              weight: "bold",
            },
            color: "#333",
          },
        },
        y: {
          ticks: {
            font: {
              size: 8,
              family: "Courier New",
              style: "normal",
              weight: "500",
            },
            color: "#666",
          },
          title: {
            display: true,
            text: "marks",
            font: {
              size: 7,
              weight: 400,
            },
          },
        },
      },
    },
  });
}

function converExam(rawExam) {
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
      return "unknown";
  }
}

/*msrks functions the graph and the progress end functions */

/*my clases functions all to do with my clases*/

function handleSessions() {
  getLessons((lessons) => {
    getUser((user) => {
      getTeacherTimetable((mySessions) => {
        //this is to get user classes taught
        const myLessons = lessons.filter((l) => l.teacherCode === user.code);
        const dayToday = getDayToday(date.getDay());
        //this current day sessions
        const mySessionsArray = Object.entries(mySessions[dayToday]);
        let mySessionsToday = [];
        mySessionsArray.forEach(([sessionTime, session]) => {
          const actualLessonTime = lessonTime[sessionTime];
          if (actualLessonTime) {
            //this is to filter things like day
            if (session !== "") {
              const [time, reference] = actualLessonTime.split("/");
              const [from, to] = time.split("-");
              let sessionData = {
                from: from,
                to: to,
                reference: reference,
                session: session,
              };
              mySessionsToday.push(sessionData);
            }
          }
        });
        displaySessions(mySessionsToday);
      }, user.code);
    });
  });
}
  const classesDiv = document.querySelector(".my-classes-box");

function displaySessions(sessionsToday) {
  sessionsToday.sort(
    (a, b) => getMinutesSumation(a.from) - getMinutesSumation(b.from)
  );
  console.log(sessionsToday)
  const timeNow = date.getHours() * 60 + date.getMinutes();
  const remainingSessions = sessionsToday.filter((session) => {
    return timeNow <= getMinutesSumation(session.to);
  }); //this gets the remaining today sessions

  let time;

  if (remainingSessions.length > 0) {
    classesDiv.innerHTML = ""
    remainingSessions.forEach((session) => {
      const sessionDiv = document.createElement("div");
      const [subject, clas, stream, type] = session.session.split("-");
      sessionDiv.className = "box";
      const status = checkSessionTime(session,sessionDiv);
      if(status !== "lesson ongoing"){
        time = session.from+" "+"-"+" "+session.to;
      }else{
        time = "lesson ongoing"
      }
      console.log(status)
      sessionDiv.innerHTML = `
        <div class="opacity" style="background:url(
          ${subjectBgImages[subject.toLowerCase()]}
        )">
          <h3><i class="fa ${subjectIcons[subject.toLowerCase()]}"></i> ${subject}</h3>
          <h4><i class="fa fa-clock"> ${time}</i></h4>
          <h5>form${clas} ${converStream(stream)}</h5>
          <h5>25 students</h5>
        </div>
      `;
      classesDiv.appendChild(sessionDiv);
    });
  }
}

function getMinutesSumation(time) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function checkSessionTime(session, sessionDiv) {
  const lessonFrom = getMinutesSumation(session.from);
  const lessonTo = getMinutesSumation(session.to);
  const timeNow = date.getHours() * 60 + date.getMinutes();

  if (timeNow >= lessonFrom && timeNow < lessonTo) {
    return "lesson ongoing";
  }
  if (lessonFrom - timeNow === 5) {
    highlightSession(sessionDiv);
    setTimeout(() => {
      clearSession(sessionDiv);
    }, 300000);
  }else{
    return "not yet";
  }
}
date.setMinutes(new Date().getMinutes() + 15);
console.log(date.getHours(),":",date.getMinutes())
function highlightSession(div) {
  div.style.animation = "scale .6s linear infinite";
  const icon = div.querySelector(".fa-clock");
  if (icon) icon.classList.add("fa-beat");
}

function clearSession(div) {
  div.style.animation = "";
  const icon = div.querySelector(".fa-clock");
  if (icon) icon.classList.remove("fa-beat");
}

function converStream(rawStream) {
  switch (rawStream) {
    case "111":
      return "green";
      break;
    case "222":
      return "blue";
      break;
    case "333":
      return "red";
      break;
    case "444":
      return "purple";
      break;
    default:
      return "green";
  }
}

function getDayToday(actualDay) {
  switch (actualDay) {
    case 0:
      return "weekend";
      break;
    case 1:
      return 0;
      break;
    case 2:
      return 1;
      break;
    case 3:
      return 2;
      break;
    case 4:
      return 3;
      break;
    case 5:
      return 4;
      break;
    case 6:
      return "weekend";
      break;
  }
}

/*my clases functions all to do with my clases*/

//function calls
displayCalendar();
displayNotifications();
handleMarks();
handleSessions();

setInterval(showNextExamProgress, 4000);
