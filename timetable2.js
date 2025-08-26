const studentTable = document.querySelector(".student-table");
const teacherContainer = document.querySelector(".teacher");
const classSelect = document.getElementById("class");
const streamSelect = document.getElementById("stream");

const studentForm = document.querySelector(".student");
const teacherForm = document.querySelector(".teacher");

const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");

const LongBreak = ["b", "r", "e", "a", "k"];
const lunch = ["l", "u", "n", "c", "h"];
const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

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

let teacherInputs = [];
let studentInputs = [];
let clas = classSelect.value;
let stream = streamSelect.value;

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
  }
}

//function to get teacher sessions
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

//function to get teacher lessons
async function getLessons() {
  const user = await getUser();
  try {
    const response = await fetch("lesson.php", {
      method: "POST",
    });
    const result = await response.json();
    const thisSchool = result.filter(t => t.schoolId === user.schoolId);
    return thisSchool;
  } catch (error) {
    console.log("lessons error", error);
  }
}

//function to get studens timetable
async function getClassSessions() {
  const user = await getUser();
  const data = new FormData();
  data.append("student-class", classSelect.value || clas);
  data.append("student-stream", streamSelect.value || stream);
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
  }
}

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
  }
}

async function updateSelects() {
  const setup = await getSetup();
  if (setup.length === 0) return;
  const schoolClases = getClases(setup[0].clases);
  const schoolStreams = getStreams(setup[0].streams);

  classSelect.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "--select class--";
  classSelect.appendChild(defaultOption);

  schoolClases.forEach((clas) => {
    const option = document.createElement("option");
    option.value = clas;
    option.textContent = clas;
    classSelect.appendChild(option);
  });

  classSelect.addEventListener("change", () => {
    const classStreams = schoolStreams[classSelect.value];
    streamSelect.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "--select stream--";
    streamSelect.appendChild(defaultOption);

    classStreams.forEach((clas) => {
      const option = document.createElement("option");
      option.value = clas;
      option.textContent = clas;
      streamSelect.appendChild(option);
    });
  });
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

function getStreams(rawStreams) {
  let result = {};
  const rawstreamArray = rawStreams.split("-");

  rawstreamArray.forEach((stream) => {
    const parts = stream.split(":");
    if (parts.length === 2) {
      const [clas, streams] = parts;
      result[clas] = streams.split("/");
    }
  });

  return result;
}

function getClases(rawClases) {
  const rawclasesArray = rawClases.split("-");
  const classArray = rawclasesArray.map((s) => {
    const [classes] = s.split("/");
    return classes;
  });
  return classArray;
}

//main function start here

async function createStudentTimetable() {
  const verified = verifyselects([classSelect, streamSelect]);
  if (verified) {
    const existingNoresult = studentTable.querySelector(".noresult");
    if (existingNoresult) existingNoresult.remove();

    const tbody = studentTable.querySelector("tbody");
    const table = createTable(classSelect.value, tbody);

    if(lowerClasses.includes(classSelect.value)) showSuccessMessage("lower class timetable mode")
    if(higherClases.includes(classSelect.value)) showSuccessMessage("higher class timetable mode")

    if (table) {
      // if the table was created
      const allInputs = Array.from(tbody.querySelectorAll(".input"));
      studentInputs = allInputs;
      const schoolSubjects = await mySubjects();
      const myLessons = await getLessons();
      const allTeachers = await getTeachers();
      const thisClassSessions = await getClassSessions(); //gets the current selected class sessions
      const proccessedSesions = getSessionArray(thisClassSessions); //this procces thre data into arrays of session objects
      for (const input of allInputs) {
        input.dataset.text = "s"; //by defualt single lesson

        input.addEventListener("change", async () => {
          const subject = input.value;
          const subjectInitial = subject.substring(0, 4);
          const index = schoolSubjects.indexOf(subject);

          if (myDefaultSubjects[index]) {
            const defaultSubject = myDefaultSubjects[index];
            const availability = await checkteacherAvailabity(
              defaultSubject,
              input
            );
            const teacherDetails = allTeachers.find(
              (t) => t.teacherCode === availability.details
            );

            if (availability.type) {
              input.value = `${subject}-${teacherDetails.firstname}-${input.dataset.text}`;
              const lessonDetails = {
                details: teacherDetails,
                subject: subject,
              };
              createTeacherTimetable(true, lessonDetails, input, false);
              createSubjectSpan(
                input,
                subjectInitial,
                teacherDetails.firstname
              );
            } else if (availability.message === "occupied") {
              const lessonDetails = {
                details: teacherDetails,
                subject: subject,
              };
              showErrorMessage("teacher is currently occupied");
              createTeacherTimetable(false, lessonDetails, input, false);
            }
          } else {
            showErrorMessage("oops, wrong typed subject..");
            input.value = "";
          }
        });

        //event listener fo doublelesson
        input.addEventListener("dblclick", async () => {
          addDoubleLesson(input);
        });

        proccessedSesions.forEach((session) => {
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
            const teacher = myLessons.find((teach) => {
              return (
                teach.class === classSelect.value &&
                teach.stream === streamSelect.value &&
                teach.subject === session.subject
              );
            });

            if (teacher) {
              const span = parent.querySelector("span");
              const details = {
                subject: session.subject,
                details: allTeachers.find(
                  (t) => t.teacherCode === teacher.teacherCode
                ),
              };
              if (span) {
                span.addEventListener("dblclick", async () => {
                  await createTeacherTimetable(false, details, input, false);
                  await removeSpan(span, teacher.teacherCode ,session.type);
                });
              }
            }
          }
        });
      }
    } else {
      showErrorMessage("error loading table, refreshing page..");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }
}

// function to check teacher availabity

/* 
  manuh this is the main function it checks for user availability
  add return the relevant message
*/
async function checkteacherAvailabity(subject, input) {
  try {
    const mylessons = await getLessons();
    const teacherDetails = mylessons.find((teach) => {
      return (
        teach.class === classSelect.value &&
        teach.stream === streamSelect.value &&
        teach.subject === subject
      );
    }); //this finds the actual teacher and returns the teacher code to the teacher code variable

    if (teacherDetails) {
      // if a teacher was found then check if he/she has a session
      const teacherCode = teacherDetails.teacherCode;
      const [day, session] = input.id.split("-");
      const allsessions = await getTeacherSessions(teacherCode); //this all sessions
      const todaysessions = allsessions.find((ses) => ses.day === day);
      if (todaysessions) {
        const thisLessonKey = sessionsobject[session];
        const currentSession = todaysessions[thisLessonKey];

        if (currentSession !== "") {
    
          const lessonTime = allClasesTimes[getLevel(classSelect.value)][
            thisLessonKey
          ]
            .split("-")
            .map((time) => getTotalMinutes(time));
          const classvalue = currentSession.split("-")[1]; //ths is the saved lesson
          if (getLevel(classvalue) === getLevel(classSelect.value)) {
            //if both sumitted session and the current class are the same
            return {
              type: false,
              message: "occupied",
              details: teacherCode,
            };
          } else {
            const savedLessonTime =
              allClasesTimes[
                getLevel[classvalue][thisLessonKey]
                  .split("-")
                  .map((time) => getTotalMinutes(time))
              ]; //this gets the saved lesson time diifernce
            if (
              lessonTime[0] >= savedLessonTime[0] &&
              lessonTime[1] <= lessonTime[1]
            ) {
              return {
                type: false,
                message: "occupied",
                details: teacherCode,
              };
            }
          }
        } else {
          return {
            type: true,
            message: "teacher is available",
            details: teacherCode,
          };
        }
      } else {
        //if no today sessions
        return {
          type: true,
          message: "teacher is available",
          details: teacherCode,
        };
      }
    } else {
      showErrorMessage("no allocated teacher was found");
      return {
        type: false,
        message: "no allocated teacher was foundz",
      };
    }
  } catch (error) {
    console.log("user availabilty error", error);
  }
}

//function to create teacher timetable
teacherForm.style.display = "none";
async function createTeacherTimetable(avail, details, input, mode = false) {
  const tbody = teacherForm.querySelector("tbody");
  const table = createTable(clas, tbody);
  teacherForm.style.display = "flex";
  if(!table) return

  const tableHeader = teacherContainer.querySelector(".head");
  teacherForm.style.display = "flex";

  // Destructure properties safely
  const teacherDetails = details.details || {};
  const { profileImage, firstname, middlename, teacherCode } = teacherDetails;

  tableHeader.innerHTML = `
    <div class="upper">
      <div class="profile">
        <img src="${profileImage || "./teachers/profileimage.png"}"/>
      </div>
      <div class="name">
        <h2>${firstname || ""} ${middlename || ""}</h2>
        <h3>${teacherCode || ""}</h3>
        <h3>${details.subject || ""}</h3>
      </div>
    </div>
  `;

  let processedSessions = [];
  const allMySessions = await getTeacherSessions(teacherCode);
  if (allMySessions.length > 0)
    processedSessions = getSessionArray(allMySessions);

  const allInputs = Array.from(tbody.querySelectorAll(".input"));
  teacherInputs = allInputs;

  for (const tInput of allInputs) {
    const session = processedSessions.find((ses) => tInput.id === ses.id);
    if (session) {
      const parent = tInput.parentElement;
      const next = parent.nextElementSibling;
      const initial = session.subject.substring(0, 4);
      const value = `${session.class} ${session.stream}`;
      const type = session.type;

      tInput.value = `${session.subject}-${session.class}-${session.stream}-${session.type}`;

      if (avail === false && session.id === input.id)
        parent.classList.add("errors");

      if (type === "s") {
        createSubjectSpan(tInput, initial, value);
      } else if (type === "d") {
        parent.setAttribute("colspan", 2);
        next.style.display = "none";
        createSubjectSpan(tInput, initial, value);
      }

      const span = parent.querySelector("span");
      if (span && mode === true) {
        span.addEventListener("dblclick", async () => {
          streamSelect.value = session.stream
          classSelect.value = session.class
          studentForm.style.display = "flex";
          await createStudentTimetable()
          await removeSpan(span, teacherCode , type);
        });
      }
    }
  }

  const newSession = allInputs.find((inp) => inp.id === input.id);
  if (newSession && avail === true) {
    const parent = newSession.parentElement;
    const next = parent.nextElementSibling;
    const initial = details.subject.substring(0, 4);
    const value = `${classSelect.value} ${streamSelect.value}`;
    const lessonType = normalize(input.dataset.text);

    newSession.value = `${details.subject}-${classSelect.value}-${streamSelect.value}-${lessonType}`;

    if (lessonType === "s") {
      createSubjectSpan(newSession, initial, value);
    } else if (lessonType === "d") {
      parent.setAttribute("colspan", 2);
      if (next) next.style.display = "none";
      createSubjectSpan(newSession, initial, value);
      const nextInput = next.querySelector(".input");
      nextInput.value = "occupied";
    }
  }

  if (avail === true) {
    try {
      await postAlltimetables(teacherCode);
    } catch (error) {
      console.log(error);
    }
  }

  const myLessons = await getLessons();
  const thisSchools = myLessons.filter(t => t.teacherCode === details.details.teacherCode);

  for(const input of allInputs){
    input.dataset.text = "s";
    if(mode){
      let timer;
      input.addEventListener("mousedown" , async () => {
       timer = setTimeout(() => {
          loadTeacherSessions(input,thisSchools);
        },3000)
      })

      input.addEventListener("mouseup" , () => {
        clearTimeout(timer);
      })

      input.addEventListener("dblclick" , () => {
         addDoubleLesson(input)
      })

    }
  }

}

async function loadTeacherSessions(input,myLessons){
  if(myLessons.length > 0){
    const span = document.createElement("span");
    const parent = input.parentElement;
    const ul = document.createElement("ul");
    input.style.display = "none";
    const allTeachers = await getTeachers();

    myLessons.forEach((lesson,i) => {
      const li = document.createElement("li");
      li.style.opacity = "0";
      li.style.transform = "scale(.8)";
      li.style.transitionDelay = `${delay * i}s`;

      li.textContent = `${lesson.class} ${lesson.stream} ${lesson.subject}`;

      ul.appendChild(li);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          li.style.opacity = "1";
          li.style.transform = "scale(1)";
        })
      })

      li.addEventListener("click" , async (e) => {
         e.preventDefault(); 
         classSelect.value = lesson.class;
         studentForm.style.display = "flex";
         await updatedStreamSelect(classSelect.value,lesson.stream);
         await createStudentTimetable();

         ul.remove();
         span.innerHTML = `
           <h3>${lesson.subject.substring(0,4)}</h3>
           <h4>${lesson.stream} ${lesson.stream}</h4>
         `;
          const teacherDetails = allTeachers.find(t => t.teacherCode === lesson.teacherCode);
          const teacherInput = teacherInputs.find((inp) => inp.id === input.id);
          const studentInput = studentInputs.find((inp) => inp.id === input.id);
          const studentParent = studentInput.parentElement;
          const nextParent = studentParent.nextElementSibling;
          const lessonType = teacherInput.dataset.text;

          //input values
          const initial = lesson.subject.substring(0,4);
          const value = teacherDetails.firstname;

          //input values
          teacherInput.value = `${lesson.subject}-${lesson.class}-${lesson.stream}-${lessonType}`;
          studentInput.value = `${lesson.subject}-${teacherDetails.firstname}-${lessonType}`;

          if(lessonType === "d"){
             studentParent.setAttribute('colspan' , 2);
             nextParent.style.display = "none";
             createSubjectSpan(studentInput,initial,value);
          }else if(lessonType === "s"){
             createSubjectSpan(studentInput,initial,value);
          }

          try{
            await postAlltimetables(teacherDetails.teacherCode);
          }catch(error){
            console.log("error" , error);
          }

      })

    })
    span.appendChild(ul);
    parent.appendChild(span);
    console.log(span)
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

//function to post data to database

async function postTeacherTimeTable(code) {
  const user = await getUser();
  const data = new FormData(teacherForm);
  data.append("id", user.schoolId);
  data.append("teacher-code", code);

  try {
    const response = await fetch("postteacher.php", {
      method: "POST",
      body: data,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("teacher posting error", error);
  }
}

async function postStudentTimeTable() {
  const user = await getUser();
  const data = new FormData(studentForm);
  data.append("student-class", classSelect.value);
  data.append("student-stream", streamSelect.value);
  data.append("id", user.schoolId);

  try {
    const response = await fetch("timetable.php", {
      method: "POST",
      body: data,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("student posting error", error);
  }
}

async function postAlltimetables(teacher) {
  const studentResponse = await postStudentTimeTable();
  const teacherResponse = await postTeacherTimeTable(teacher);

  console.log("student", studentResponse);
  console.log("teacher", teacherResponse);
}

//function accesory functions
function verifyselects(array) {
  // to check select field filled
  let allFilled = true;
  array.forEach((input) => input.classList.remove("errors"));
  array.forEach((input) => {
    if (input.value === "") {
      allFilled = false;
      input.classList.add("errors");
    }
  });

  if (allFilled) {
    return true;
  } else {
    showErrorMessage("please select class & stream");
    return false;
  }
}

function normalize(string) {
  return string.toLowerCase().trim();
}

function getTotalMinutes(rawTime) {
  const [hour, minute] = rawTime.split(":");
  return Number(minute) + Number(hour * 60);
}

function getLevel(clas) {
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
  if (lowerClasses.includes(clas)) {
    return 0;
  } else if (higherClases.includes(clas)) {
    return 1;
  } else {
    return 1;
  }
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

function addDoubleLesson(input) {
  const parent = input.parentElement;
  const next = parent.nextElementSibling;

  if (
    next.classList.contains("no-double-lesson") &&
    !parent.classList.contains("opened") &&
    parent.classList.contains("double-lesson")
  ) {
    parent.setAttribute("colspan", 2);
    next.style.display = "none";
    parent.classList.add("opened");
    input.dataset.text = "d";
    const nextInput = next.querySelector(".input");
    nextInput.value = "occupied";
  } else if (parent.classList.contains("opened")) {
    parent.removeAttribute("colspan");
    next.style.display = "flex";
    const nextInput = next.querySelector(".input");
    nextInput.value = ""
    parent.classList.remove("opened");
    input.dataset.text = "s";
  } else {
    showErrorMessage("Oops! You can't add a double lesson there");
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

           if(value === "occupied"){
            sessionObject = {
              id: `${day}-${sessionKey}`,
              name : "",
              type : "",
              subject : "occupied" 
            }
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

async function removeSpan(span, tcode ,type) {
  const parent = span.parentElement;
  const next = parent.nextElementSibling;
  const nextInput = next.querySelector(".input");
  const input = parent.querySelector(".input");

  if (span) {
    const teacherInput = teacherInputs.find((inp) => inp.id === input.id);
    const studentInput = studentInputs.find((inp) => inp.id === input.id);
    const span1 = teacherInput.parentElement.querySelector("span");
    const span2 = studentInput.parentElement.querySelector("span");

    if (span1 && span2) {
      span1.style.opacity = "0";
      span1.style.transform = "scale(.8) rotate(360deg)";
      span2.style.opacity = "0";
      span2.style.transform = "scale(.8) rotate(360deg)";
    }

    if(type === "d"){
      next.style.display = "flex";
      nextInput.value = "";
      parent.removeAttribute('colspan');
    }

    setTimeout(async () => {
      span.remove();
      input.style.display = "inline-flex";

      teacherInput.value = "";
      studentInput.value = "";

      try {
        await postAlltimetables(tcode);
      } catch (error) {
        console.log("error removing span", error);
      }
    }, 600);
  }
}

async function updatedStreamSelect(classValue,stream){
  const setup = await getSetup();
  if(setup.length === 0) return
  const schoolStreams = getStreams(setup[0].streams);

  const classStreams = schoolStreams[classValue];
    streamSelect.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "--select stream--";
    streamSelect.appendChild(defaultOption);

    classStreams.forEach((clas) => {
      const option = document.createElement("option");
      option.value = clas;
      option.textContent = clas;
      streamSelect.appendChild(option);
  });

  streamSelect.value = stream
}

//error function
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

//function calls
updateSelects();

//event listeners
classSelect.addEventListener("change", () => {
  clas = classSelect.value;
  stream = streamSelect.value;
  createStudentTimetable();
});
streamSelect.addEventListener("change", () => {
  clas = classSelect.value;
  stream = streamSelect.value;
  createStudentTimetable();
});

//edit functions

const editBtn = document.querySelector(".edit");
const centralise = document.querySelector(".centralise");
const children = Array.from(centralise.children);
const teacherCont = document.querySelector(".teacher-container");
const delay = 0.3;

editBtn.addEventListener("click", () => {
  if(!editBtn.classList.contains("opened")){
     children
    .filter((child) => !child.classList.contains(".teacher-container"))
    .map((child) => (child.style.display = "none"));
    teacherCont.style.display = "grid";
    
    teacherCont.style.opacity = "1";
    teacherCont.style.transform = "scale(1)"

    displayAllTeachers();
    editBtn.classList.add("opened");
    editBtn.textContent = "back";
    editBtn.style.backgroundColor = "var(--red)";
    editBtn.style.color = "#fff";
  }else{
    children
    .filter((child) => !child.classList.contains(".teacher-container"))
    .map((child) => (child.style.display = "flex"));
    teacherCont.style.display = "none";

    editBtn.classList.remove("opened");
    editBtn.textContent = "edit";
    editBtn.style.backgroundColor = "#f8f9fb";
    editBtn.style.color = "#000";
    centralise.style.flexDirection = "column";
    teacherForm.style.display = "none";
    document.querySelector(".select").style.display = "flex";
  }
});

async function displayAllTeachers() {
  const allTeachers = await getTeachers();
  teacherCont.innerHTML = "";
  if (allTeachers.length > 0) {
    allTeachers.forEach((teacher, i) => {
      const div = document.createElement("div");
      const profileImage =
        teacher.profileImage || "./teachers/profileimage.png";
      div.className = "box";

      // Set initial styles before animation
      div.style.opacity = "0";
      div.style.transform = "scale(0.9)";
      div.style.transition = "opacity .6s linear,transform .6s linear";
      div.style.transitionDelay = `${delay * i}s`;

      div.innerHTML = `
        <div class="upper">
          <div class="image">
            <img src="${profileImage}" alt="">
          </div>
        </div>
        <div class="lower">
          <h3 class="name">${teacher.firstname} ${teacher.middlename}</h3>
          <p>${teacher.rank}</p>
          <div class="subjects">
            <span>${teacher.subjectOne}</span>
            <span>${teacher.subjectTwo}</span>
          </div>
        </div>
        <i style="display:none;" class="fas fa-check"></i>
      `;

      teacherCont.appendChild(div);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          div.style.opacity = "1";
          div.style.transform = "scale(1)";
        });
      });

      div.addEventListener("click", async () => {
        editTable(teacher.teacherCode);
      });
    });
  } else {
    children
      .filter((child) => !child.classList.contains(".teacher-container"))
      .map((child) => (child.style.display = "flex"));
    teacherCont.style.display = "none";
  }
}

async function editTable(code) {
  const teachers = await getTeachers();
  const thisTeacher = teachers.find((t) => t.teacherCode === code);
  teacherCont.style.transform = "scale(.5)";
  teacherCont.style.opacity = "0";

  setTimeout(async () => {
    children
      .filter(
        (child) =>
          !child.classList.contains(".teacher-container") ||
          !child.classList.contains(".remedial-container")
      )
      .map((child) => (child.style.display = "flex"));
    teacherCont.style.display = "none";
    centralise.style.flexDirection = "column-reverse";
    studentForm.style.display = "none";
    document.querySelector(".select").style.display = "none";
    document.querySelector(".remedial-container").style.display = "none";

    clas = "grade 7";
    classSelect.value = "grade 7"
    const subjects = await mySubjects();
    const index1 = myDefaultSubjects.indexOf(thisTeacher.subjectOne)
    const index2 = myDefaultSubjects.indexOf(thisTeacher.subjectTwo)

    const details = {
      subject : `${subjects[index1]} ${subjects[index2]}`,
      details : thisTeacher
    }

    createTeacherTimetable(false,details,"",true);
  }, 1000);
}
