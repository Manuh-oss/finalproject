const studentTable = document.querySelector(".student");
const teacherTable = document.querySelector(".teacher");
const classSelect = document.querySelector("#student-class");
const streamSelect = document.querySelector("#student-stream");
const studentForm = document.querySelector(".main .student");
const teacherForm = document.querySelector(".main .teacher");
const selects = document.querySelectorAll(".required-select");

const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");
const teacherCodeInput = document.querySelector(".teacher-code");

const LongBreak = ["b", "r", "e", "a", "k"];
const lunch = ["l", "u", "n", "c", "h"];
const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

let teacherSessions = [];
let studentSessions = [];
let teacherLessons = [];

teacherTable.style.display = "none";
let allStudentInputs;

classSelect.addEventListener("change", getStudents);
streamSelect.addEventListener("change", getStudents);

function createStudentTimetable() {
  const studentBody = studentTable.querySelector("table tbody");
  studentBody.innerHTML = "";
  for (let r = 0; r < 5; r++) {
    const tableRow = document.createElement("tr");
    tableRow.innerHTML = `    
            <td class="break">${days[r]}</td>
            <td class="double-lesson"><input type="text" name="first[]" class="input" id="${days[r]}-first"></td>
            <td class="no-double-lesson"><input type="text" name="second[]" class="input" id="${days[r]}-second"></td>
            <td class="break"><h2>${LongBreak[r]}</h2></td>
            <td class="double-lesson"><input type="text" name="third[]" class="input" id="${days[r]}-third"></td>
            <td class="no-double-lesson"><input type="text" name="forth[]" class="input" id="${days[r]}-forth"></td>
            <td class="break"><h2>${LongBreak[r]}</h2></td>
            <td class="double-lesson"><input type="text" name="fifth[]" class="input" id="${days[r]}-fifth"></td>
            <td class="double-lesson"><input type="text" name="sixth[]" class="input" id="${days[r]}-sixth"></td>
            <td class="no-double-lesson"><input type="text" name="seventh[]" class="input" id="${days[r]}-seventh"></td>
            <td class="break"><h2>${lunch[r]}</h2></td>
            <td class="double-lesson"><input type="text" name="eigth[]" class="input" id="${days[r]}-eigth"></td>
            <td class="double-lesson"><input type="text" name="ninth[]" class="input" id="${days[r]}-ninth"></td>
            <td class="no-double-lesson"><input type="text" name="tenth[]" class="input" id="${days[r]}-tenth"></td>
            <input type="hidden" value="${days[r]}" class="inputz" name="day">
    `;
    studentBody.appendChild(tableRow);
  }

  const allInputs = studentBody.querySelectorAll(".input");
  allStudentInputs = allInputs;

  console.log(studentSessions);

  if (studentSessions.length > 0) {
    allInputs.forEach((inputs) => {
      studentSessions.forEach((session) => {
        if (inputs.id === session.id) {
          const parent = inputs.parentElement;
          const next = parent.nextElementSibling;
          const prev = parent.previousElementSibling;
          const span = document.createElement("span");
          const initial = getInitials(session.subject);
          if (session.type === true) {
            if(!next.querySelector(".input")){
              prev.style.display = "none";
              prev.querySelector(".input").value = session.subject;
              parent.setAttribute("colspan", 2);
              span.innerHTML = `
                <h3>${initial}</h3>
                <h4>${session.teacher}</h4>
              `;
              inputs.style.display = "none";
              inputs.value = session.subject;
              parent.classList.add("opened");
              parent.appendChild(span);
            }else{
              next.style.display = "none";
              next.querySelector(".input").value = session.subject;
              parent.setAttribute("colspan", 2);
              span.innerHTML = `
                <h3>${initial}</h3>
                <h4>${session.teacher}</h4>
              `;
              inputs.style.display = "none";
              inputs.value = session.subject;
              parent.classList.add("opened");
              parent.appendChild(span);
            }
          } else {
            span.innerHTML = `
            <h3>${initial}</h3>
            <h4>${session.teacher}</h4>
          `;
            inputs.style.display = "none";
            inputs.value = session.subject;
            parent.appendChild(span);
            console.log(false);
          }
        }
      });
    });
  }

  allInputs.forEach((input) => {
    input.addEventListener("change", function () {
      verifySelects(input);
    });
  });

  allInputs.forEach((input) => {
    input.addEventListener("dblclick", addDoubleLesson);
  });
}

function verifySelects(input) {
  let alFilled = true;
  selects.forEach((select) => select.classList.remove("errors"));
  selects.forEach((select) => {
    if (select.value.trim() === "") {
      alFilled = false;
      select.classList.add("errors");
    } else {
      alFilled = true;
    }
  });

  if (alFilled) {
    getUserInputs(input);
  } else {
    showErrorMessage("all input fields are required");
  }
}

function getUserInputs(input) {
  const parent = input.parentElement;
  const next = parent.nextElementSibling;
  if (parent.classList.contains("opened")) {
    next.querySelector(".input").value = input.value;
    handleUserInput(input, true);
  } else {
    handleUserInput(input, false);
  }
}

function handleUserInput(input, type) {
  const userValue = input.value;
  const corrected = correctUser(userValue);
  const initial = getInitials(corrected);
  const xhr = new XMLHttpRequest();
  const parent = input.parentElement;
  xhr.open("POST", "lesson.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      const match = response.find(
        (t) =>
          t.class === classSelect.value &&
          t.stream === streamSelect.value &&
          t.subject === corrected.toLowerCase()
      );
      if (!match) {
        showErrorMessage("no teacher was found");
        return;
      } else {
        getTeachers((datas) => {
          datas.forEach((data) => {
            if (data.teacherCode === match.teacherCode) {
              let double;
              if(type === true){
                double = "d";
              }else{
                double = "s";
              }              
              const value = `${corrected}-${data.firstname}-${double}`;
              const span = document.createElement("span");
              span.innerHTML = `
                        <h3>${initial}</h3>
                        <h4>${data.firstname}</h4>
                      `;
              parent.appendChild(span);
              input.style.display = "none";
              let teacherDetails = {
                firstname: data.firstname,
                middlename: data.middlename,
                teacherCode: data.teacherCode,
                profileImage: data.profileImage,
                subject: corrected,
                type: type,
              };
              checkTeacherAvailability(input, teacherDetails, value);
            }
          });
        });
      }
    }
  };
  xhr.send();
}

function checkTeacherAvailability(input, details, inputValue) {
  if (details.teacherCode === "") return;
  const xhr = new XMLHttpRequest();
  const teacherCode = details.teacherCode;
  const param = "teacherCode=" + teacherCode;
  xhr.open("POST", "teachertimetable.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = () => {
    if (xhr.status === 200) {
      const allSessions = JSON.parse(xhr.responseText);
      const result = convertIdToName(input.id, allSessions);
      const parent = input.parentElement;
      const next = parent.nextElementSibling;

      if (allSessions.length > 0) {
        const lessons = getId(allSessions);
        addSavedLessons(lessons, details);
        if (result === "") {
          displayTeacherTable(input, details, inputValue);
        } else {
          if (details.type === false) {
            console.log(details.type);
            input.style.display = "flex";
            input.value = "";
            const span = parent.querySelector("span");
            if (span) {
              parent.removeChild(span);
            }
            showErrorMessage("teacher occupied");
          } else if (details.type === true) {
            console.log(details.type);
            input.value = "";
            const span = parent.querySelector("span");
            parent.remove(span);
            parent.setAttribute("colspan", 0);
            next.style.display = "flex";
            next.querySelector(".input").value = "";
            showErrorMessage("teacher occupied");
          }
        }
      } else {
        displayTeacherTable(input, details, inputValue);
      }
    }
  };
  xhr.send(param);
}

function displayTeacherTable(input, teacherDetails, value) {
  teacherTable.style.display = "flex";
  const tableHead = teacherTable.querySelector(".head");
  const tableBody = teacherTable.querySelector("table tbody");
  tableHead.innerHTML = `
       <div class="upper">
        <div class="profile">
           <img src="${teacherDetails.profileImage}" height="10rem" width="10rem" />
        </div>
          <div class="name">
            <h2>${teacherDetails.firstname} ${teacherDetails.middlename}</h2>
              <h3>${teacherDetails.teacherCode}</h3>
              <h3>${teacherDetails.subject}</h3>
          </div>
    </div>
   `;
  teacherCodeInput.value = teacherDetails.teacherCode;
  tableBody.innerHTML = "";
  for (let r = 0; r < 5; r++) {
    const tableRow = document.createElement("tr");
    tableRow.innerHTML = `
     <td class="break">${days[r]}</td>
            <td class="double-lesson"><input type="text" name="first[]" class="input" id="${days[r]}-first"></td>
            <td class="no-double-lesson"><input type="text" name="second[]" class="input" id="${days[r]}-second"></td>
            <td class="break"><h2>${LongBreak[r]}</h2></td>
            <td class="double-lesson"><input type="text" name="third[]" class="input" id="${days[r]}-third"></td>
            <td class="no-double-lesson"><input type="text" name="forth[]" class="input" id="${days[r]}-forth"></td>
            <td class="break"><h2>${LongBreak[r]}</h2></td>
            <td class="double-lesson"><input type="text" name="fifth[]" class="input" id="${days[r]}-fifth"></td>
            <td class="double-lesson"><input type="text" name="sixth[]" class="input" id="${days[r]}-sixth"></td>
            <td class="no-double-lesson"><input type="text" name="seventh[]" class="input" id="${days[r]}-seventh"></td>
            <td class="break"><h2>${lunch[r]}</h2></td>
            <td class="double-lesson"><input type="text" name="eigth[]" class="input" id="${days[r]}-eigth"></td>
            <td class="double-lesson"><input type="text" name="ninth[]" class="input" id="${days[r]}-ninth"></td>
            <td class="no-double-lesson"><input type="text" name="tenth[]" class="input" id="${days[r]}-tenth"></td>
            <input type="hidden" value="${days[r]}" class="inputz" name="day">
    `;
    tableBody.appendChild(tableRow);
  }

  const allInputs = tableBody.querySelectorAll(".input");

  //this handles the saved session in teacherSession array

  allInputs.forEach((inputs) => {
    if (teacherSessions.length > 0) {
      teacherSessions.forEach((session) => {
        if (
          inputs.id === session.id &&
          teacherDetails.teacherCode === session.teacherCode
        ) {
          const parent = inputs.parentElement;
          const next = parent.nextElementSibling;
          let spans = parent.querySelector("span");
          if (session.type === true) {
            if (!spans) {
              parent.setAttribute("colspan", 2);
              next.style.display = "none";
              parent.querySelector(".input").value = session.inputValue;
              parent.querySelector(".input").style.display = "none";
              next.querySelector(".input").value = session.inputValue;
              let id3 = next.querySelector(".input").id;
              const span = document.createElement("span");
              span.innerHTML = `
                <h3>${session.subject}</h3>
                <h4>form${session.class} ${session.stream}</h4>
           `;
              parent.appendChild(span);
            }
          } else if (session.type === false) {
            if (!spans) {
              parent.querySelector(".input").value = session.inputValue;
              parent.querySelector(".input").style.display = "none";
              const span = document.createElement("span");
              span.innerHTML = `
             <h3>${session.subject}</h3>
             <h4>form${session.class} ${session.stream}</h4>
        `;
              parent.appendChild(span);
            }
          }
        }
      });
    }
  });

  // during user insertion this diaplys and stores the data in teacherSession array
  allInputs.forEach((teacherInput) => {
    if (input.id === teacherInput.id) {
      const parent = teacherInput.parentElement;
      const next = parent.nextElementSibling;
      const inputValue = `${teacherDetails.subject}-${classSelect.value}-${streamSelect.value}-s`;
      const [subject, clas, streams, type] = inputValue.split("-");
      let stream = streams;
      switch (stream) {
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
      }

      if (teacherDetails.type === true) {
        parent.setAttribute("colspan", 2);
        next.style.display = "none";
        parent.querySelector(".input").value = inputValue;
        parent.querySelector(".input").style.display = "none";
        next.querySelector(".input").value = inputValue;
        let id3 = next.querySelector(".input").id;
        const span = document.createElement("span");
        span.innerHTML = `
              <h3>${subject}</h3>
              <h4>form${clas} ${stream}</h4>
         `;
        parent.appendChild(span);

        let currentSession = {
          id: input.id,
          id2: input.id,
          id3: id3,
          teacherCode: teacherDetails.teacherCode,
          inputValue: inputValue,
          value: value,
          subject: subject,
          class: clas,
          stream: stream,
          type: true,
        };

        teacherSessions.push(currentSession);
        updateInputs();
        postTeacherTimeTable();
        postStudentTimeTable();
      } else if (teacherDetails.type === false) {
        parent.querySelector(".input").value = inputValue;
        parent.querySelector(".input").style.display = "none";
        const span = document.createElement("span");
        span.innerHTML = `
             <h3>${subject}</h3>
             <h4>form${clas} ${stream}</h4>
        `;
        parent.appendChild(span);

        let currentSession = {
          id: input.id,
          id2: input.id,
          id3: "",
          teacherCode: teacherDetails.teacherCode,
          inputValue: inputValue,
          value: value,
          subject: subject,
          class: clas,
          stream: stream,
          type: false,
        };

        teacherSessions.push(currentSession);
        updateInputs();
        postTeacherTimeTable();
        postStudentTimeTable();
      }
    }
  });
}

function convertIdToName(id, data) {
  const [day, lessonPart] = id.split("-");

  const lessonMap = {
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

  const lessonkey = lessonMap[lessonPart];

  const actualDay = day.toLowerCase();

  for (let item of data) {
    if (item.day.toLowerCase() === actualDay) {
      return item[lessonkey] || "";
    }
  }

  return null;
}

function addSavedLessons(lessons, details) {
  const uniquePeriod = new Set();
  let result = [];
  lessons.forEach((lesson) => {
    if (lesson !== "") {
      const [id, period] = lesson.split("/");
      if (!uniquePeriod.has(period)) {
        const [subject, clas, stream, types] = period.split("-");
        let type = types;
        if (type === "d") {
          type = true;
        } else if (type === "s") {
          type = false;
        }
        let session = {
          id: id,
          value: "",
          teacherCode: details.teacherCode,
          inputValue: period,
          id2: id,
          subject: subject,
          class: clas,
          stream: stream,
          type: type,
          id3: "",
        };
        console.log(session);
        if (teacherSessions.push(session)) console.log("pushed");
        uniquePeriod.add(period);
      }
    }
  });
}

function updateInputs(){
  allStudentInputs.forEach(input => {
    teacherSessions.forEach(session => {
      if(input.id === session.id2 || input.id === session.id3){
          input.value = session.value;
      }
    })
  })
}

function getStudents() {
  const formData = new FormData(studentForm);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "studenttimetable.php", true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      const result = getId(response);
      getUniqueTimetableEntries(result);
      createStudentTimetable();
    }
  };
  xhr.send(formData);
}

function getUniqueTimetableEntries(dbValues) {
  const seen = {};

  dbValues.forEach((entry) => {
    const [id, value] = entry.split("/"); // e.g. "thursday-first", "geography-martin-d"
    const [day] = id.split("-"); // Extract day: "thursday"
    const key = `${day}-${value}`;
    if (value) {
      const [subject, teacher, type] = value.split("-");
      let types = type;
      if (types === "d") {
        types = true;
      } else if (types === "s") {
        types = false;
      }

      if (!seen[key]) {
        seen[key] = true;
        let result = {
          id: id,
          subject: subject,
          teacher: teacher,
          type: types,
        };
        studentSessions.push(result);
      }
    }
  });
}

getStudents();

function getTeachers(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "teachers.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      callback(response);
    }
  };
  xhr.send();
}

function getInitials(value) {
  let originalValue = value.toLowerCase();
  if (originalValue.trim() !== "") {
    switch (originalValue) {
      case "english":
        originalValue = "ENG";
        break;
      case "kiswahili":
        originalValue = "KIS";
        break;
      case "mathematics":
        originalValue = "MATH";
        break;
      case "chemistry":
        originalValue = "CHEM";
        break;
      case "biology":
        originalValue = "BIO";
        break;
      case "physics":
        originalValue = "PHY";
        break;
      case "geography":
        originalValue = "GEO";
        break;
      case "history":
        originalValue = "HIST";
        break;
      case "cre":
        originalValue = "CRE";
        break;
      case "business":
        originalValue = "B/S";
        break;
      case "agriculture":
        originalValue = "AGRI";
        break;
      case "computer":
        originalValue = "COMP";
        break;
      case "french":
        originalValue = "FREN";
        break;
      default:
        originalValue = originalValue;
    }
  }
  return originalValue;
}

function correctUser(userInput) {
  const knownSubject = [
    "English",
    "Kiswahili",
    "Mathematics",
    "Biology",
    "Physics",
    "Chemistry",
    "Geography",
    "History",
    "Cre",
    "Business",
    "Agriculture",
    "Computer",
    "French",
  ];
  let bestMatch = userInput;
  let highScore = 0;
  let input = userInput.toLowerCase();

  for (let subject of knownSubject) {
    let correct = subject.toLowerCase();

    if (correct.startsWith(input) && input.length >= 2) {
      return subject; // THIS HANDLES IF USER INPUT IS LIKE ENG
    }

    let score = getCharacterMatchScore(input, correct);

    if (score > highScore && score > 0.2) {
      highScore = score;
      bestMatch = subject;
    }
  }
  return bestMatch;
}

function getCharacterMatchScore(user, correct) {
  const correctArr = correct.split("");
  const userArr = user.split("");

  const smallest = Math.min(correctArr.length, userArr.length);
  let score = 0;

  for (let z = 0; z < smallest; z++) {
    if (userArr[z] === correctArr[z]) {
      score++;
    }
  }

  const similarity = score / correctArr.length;

  return similarity;
}

function getId(data) {
  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  const otherNumbers = [
    "first",
    "second",
    "third",
    "forth",
    "fifth",
    "sixth",
    "seventh",
    "eigth",
    "ninth",
    "tenth",
  ];
  let lessons = [];
  let results = [];

  data.forEach((item, i) => {
    for (let z = 0; z < 10; z++) {
      const lesson = `lesson${z + 1}`;
      if (item[lesson]) {
        lessons.push(`${daysOfWeek[i]}-${otherNumbers[z]}/${item[lesson]}`);
      } else {
        lessons.push("");
      }
    }
  });

  return lessons;
}

function addDoubleLesson() {
  const parent = this.parentElement;
  const next = parent.nextElementSibling;

  if (!parent) {
    console.error("parentElement is null.  Check event target.");
    return; // Exit if no parent
  }

  if (!parent.classList.contains("double-lesson")) {
    console.warn("Element is not a double-lesson cell.");
    showErrorMessage("Cannot create a double lesson here.");
    return; // Exit if not a double-lesson cell
  }

  if (parent.classList.contains("opened")) {
    // Revert to single lesson
    parent.classList.remove("opened");
    parent.removeAttribute("colspan");

    if (next) {
      next.style.display = "flex";
    }

    const existingSpan = parent.querySelector("span");
    if (existingSpan) {
      parent.removeChild(existingSpan);
    }
    const input = parent.querySelector(".input");
    if (input) {
      input.style.display = "inline-flex";
      input.value = "";
    }
  } else {
    // Expand to double lesson
    parent.classList.add("opened");
    parent.setAttribute("colspan", 2);
    if (next) {
      next.style.display = "none";
    }
  }
}

function postTeacherTimeTable() {
  const formData = new FormData(teacherForm);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "postteacher.php", true);
  xhr.onload = () => {
    const response = xhr.responseText;
    console.log(response);
  };
  xhr.send(formData);
}

function postStudentTimeTable() {
  const formData = new FormData(studentForm);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "timetable.php", true);
  xhr.onload = () => {
    const response = xhr.responseText;
    console.log(response);
  };
  xhr.send(formData);
}

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

createStudentTimetable();
