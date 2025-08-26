const table = document.querySelector(".timetable-container table tbody");
const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const LongBreak = ["b", "r", "e", "a", "k"];
const lunch = ["l", "u", "n", "c", "h"];

const progressContainer = document.getElementById("container");

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

//function to get teacher sessions
async function getTeacherSessions(code) {
  showLoader("fetching teacher sessions, please wait..");
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
  } finally {
    removeLoader();
  }
}

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

//function to get studens timetable
async function getClassSessions(clas, stream) {
  showLoader("fetching student sessions, please wait..");
  const user = await getUser();
  const data = new FormData();
  data.append("student-class", clas);
  data.append("student-stream", stream);
  data.append("id", user.schoolId);
  try {
    const response = await fetch("studenttimetable.php", {
      method: "POST",
      body: data,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("class sessions error", error);
  } finally {
    removeLoader();
  }
}

async function mySubjects() {
  const setup = await getSetup();
  if (setup.length === 0) return;
  const schoolSubjects = getSubject(setup[0].subjects);

  return schoolSubjects;
}

function getSubject(rawSubjects) {
  const rawstreamArray = rawSubjects.split("-");
  const streamArray = rawstreamArray.map((s) => {
    const [classes] = s.split("/");
    return classes;
  });
  return streamArray;
}

async function getSetup() {
  showLoader("fetching school details, please wait...");
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

//function to create any table
function createTable(classvalue, tbody) {
  const lastPeriod = document.querySelector(".last-period");
  if (lowerClasses.includes(normalize(classvalue))) {
    lastPeriod.style.display = "none";
    tbody.innerHTML = "";
    for (let r = 0; r < days.length; r++) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
              <td class="break">${days[r]}</td>
              <td class="double-lesson"><input type="text" name="first[]" class="input" id="${days[r]}-first"></td>
              <td class="no-double-lesson"><input type="text" name="second[]" class="input" id="${days[r]}-second"></td>
              <td class="break"><h2>${LongBreak[r]}</h2></td>
              <td class="double-lesson"><input type="text" name="third[]" class="input" id="${days[r]}-third"></td>
              <td class="no-double-lesson"><input type="text" name="forth[]" class="input" id="${days[r]}-forth"></td>
              <td class="break"><h2>${LongBreak[r]}</h2></td>
              <td class="double-lesson"><input type="text" name="fifth[]" class="input" id="${days[r]}-fifth"></td>
              <td class="double-lesson"><input type="text" name="sixth[]" class="input" id="${days[r]}-sixth"></td>
              <td class="break"><h2>${lunch[r]}</h2></td>
              <td class="double-lesson"><input type="text" name="eigth[]" class="input" id="${days[r]}-seventh"></td>
              <td class="no-double-lesson"><input type="text" name="eigth[]" class="input" id="${days[r]}-eigth"></td>
              <td class="no-double-lesson" style='display:none;'><input type="text" name="ninth[]" class="input" id="${days[r]}-ninth"></td>
              <td class="no-double-lesson" style='display:none;'><input type="text" name="tenth[]" class="input" id="${days[r]}-tenth"></td>
      `;
      tbody.appendChild(tr);
    }
    return true;
  } else if (higherClases.includes(normalize(classvalue))) {
    tbody.innerHTML = "";
    lastPeriod.style.display = "flex";
    for (let r = 0; r < days.length; r++) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
              <td class="break">${days[r]}</td>
              <td class="double-lesson"><input type="text" name="first[]" class="input" id="${days[r]}-first"></td>
              <td class="no-double-lesson"><input type="text" name="second[]" class="input" id="${days[r]}-second"></td>
              <td class="break"><h2>${LongBreak[r]}</h2></td>
              <td class="double-lesson"><input type="text" name="third[]" class="input" id="${days[r]}-third"></td>
              <td class="no-double-lesson"><input type="text" name="forth[]" class="input" id="${days[r]}-forth"></td>
              <td class="break"><h2>${LongBreak[r]}</h2></td>
              <td class="double-lesson"><input type="text" name="fifth[]" class="input" id="${days[r]}-fifth"></td>
              <td class="no-double-lesson"><input type="text" name="sixth[]" class="input" id="${days[r]}-sixth"></td>
              <td class="break"><h2>${lunch[r]}</h2></td>
              <td class="double-lesson"><input type="text" name="seventh[]" class="input" id="${days[r]}-seventh"></td>
              <td class="double-lesson"><input type="text" name="eigth[]" class="input" id="${days[r]}-eigth"></td>
              <td class="no-double-lesson"><input type="text" name="ninth[]" class="input" id="${days[r]}-ninth"></td>
              <td class="no-double-lesson" style='display:none;'><input type="text" name="tenth[]" class="input" id="${days[r]}-tenth"></td>
      `;
      tbody.appendChild(tr);
    }
    return true;
  } else {
    return null;
  }
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

function normalize(string) {
  return string.toLowerCase().trim();
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
              id: `${day}-${sessionKey}`,
              name: "",
              type: "",
              subject: "occupied",
            };
          }

          if (value.split("-").length === 3) {
            sessionObject = {
              id: `${day}-${sessionKey}`,
              name: value.split("-")[1],
              type: value.split("-")[2],
              subject: value.split("-")[0],
            };
          } else if (value.split("-").length === 4) {
            sessionObject = {
              id: `${day}-${sessionKey}`,
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

function createSubjectSpan(input, initial, value) {
  const span = document.createElement("span");
  span.innerHTML = `
     <h3>${initial}</h3>
     <h4>${value}</h4>
   `;
  input.style.display = "none";
  const parent = input.parentElement;
  parent.appendChild(span);
}

//function display timetable

async function diplayTimemable() {
  const user = await getUser();

  if (user.from === "student") {
    const sessions = await getClassSessions(user.class, user.stream);
    displayTable(user.class, table, sessions, "student");
  } else if (user.from === "teacher") {
    const sessions = await getTeacherSessions(user.code);
    displayTable("grade 7", table, sessions, "teacher");
  } else {
    showLoader("a foreign user detected , redirecting to main page...");
    setTimeout(() => {
      window.location.href = "main.html";
    }, 3000);
  }
}

async function displayTable(classValue, html, sessions, user) {
  const tableStatus = createTable(classValue, html);

  if (tableStatus) {
    const allInputs = Array.from(table.querySelectorAll(".input"));
    const sessionArray = getSessionArray(sessions);

    if (user === "teacher") {
      for (const tInput of allInputs) {
        const session = sessionArray.find((ses) => tInput.id === ses.id);
        if (session) {
          const parent = tInput.parentElement;
          const next = parent.nextElementSibling;
          const initial = session.subject.substring(0, 4);
          const value = `${session.class} ${session.stream}`;
          const type = session.type;

          tInput.value = `${session.subject}-${session.class}-${session.stream}-${session.type}`;

          if (type === "s") {
            createSubjectSpan(tInput, initial, value);
          } else if (type === "d") {
            parent.setAttribute("colspan", 2);
            next.style.display = "none";
            createSubjectSpan(tInput, initial, value);
          }
        }
      }
    } else if (user === "student") {
      for (const input of allInputs) {
      sessionArray.forEach((session) => {
        if (session.id === input.id) {
          const parent = input.parentElement;
          const next = parent.nextElementSibling;
          const initial = session.subject.substring(0, 4);

          input.value = `${session.subject}-${session.name}-${session.type}`;

          if (session.type === "d") {
            parent.setAttribute("colspan", 2);
            next.style.display = "none";
            createSubjectSpan(input, initial, session.name);
          } else if (session.type === "s") {
            createSubjectSpan(input, initial, session.name);
          }
        }
      });
      }
    }
  }
}

diplayTimemable();
