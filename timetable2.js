const studentTable = document.querySelector(".student-table table");
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

let studentInputs;
let teacherInputs;
let editMode =  null;
let teacherEditmode = null;
let clas;
let stream;
let timer;

function getStudentTimetable(callback, clas, stream) {
  const data = new FormData();
  data.append("student-class", clas);
  data.append("student-stream", stream);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "studenttimetable.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Student Error", error);
    }
  };
  xhr.send(data);
}

function getUser(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "saved_user.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Login error", error);
    }
  };
  xhr.send();
}

function getTeachers(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "teachers.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("teachers Error", error);
    }
  };
  xhr.send();
}

function getLessons(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "lesson.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Lesson error", error);
    }
  };
  xhr.send();
}

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

function getStudentSessions(callback, clas, stream) {
  //this gets all session fo students under the selected classes
  getStudentTimetable(
    (students) => {
      let converted = [];
      Object.entries(students).forEach(([day, sessions]) => {
        Object.entries(sessions).forEach(([key, value]) => {
          if (getId(key)) {
            //to filter out the day object key
            if (value !== "") {
              const [subject, teacher, type] = value.split("-");
              let sessionData = {
                id: days[day] + "-" + getId(key),
                subject: subject,
                teacher: teacher,
                type: type,
              };
              if (!converted.some((s) => s === sessionData)) {
                converted.push(sessionData);
              }
            }
          }
        });
      });
      callback(converted);
    },
    clas,
    stream
  );
}

function getTeacherSessions(callback, tcode) {
  getTeacherTimetable((teachers) => {
    let converted = [];
    Object.entries(teachers).forEach(([day, sessions]) => {
      Object.entries(sessions).forEach(([key, value]) => {
        if (getId(key)) {
          //to filter out the day object key
          if (value !== "") {
            const [subject, clas, stream, type] = value.split("-");
            let sessionData = {
              id: days[day] + "-" + getId(key),
              subject: subject,
              class: clas,
              stream: stream,
              type: type,
            };
            if (!converted.some((s) => s === sessionData)) {
              converted.push(sessionData);
            }
          }
        }
      });
    });
    callback(converted);
  }, tcode);
}

//function createStudent timetabe
function createStudentTable() {
  const tbody = studentTable.querySelector("tbody");
  if(!clas) clas = classSelect.value;
  if(!stream) stream = streamSelect.value;
  tbody.innerHTML = "";
  for (let r = 0; r < 5; r++) {
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
            <td class="no-double-lesson"><input type="text" name="seventh[]" class="input" id="${days[r]}-seventh"></td>
            <td class="break"><h2>${lunch[r]}</h2></td>
            <td class="double-lesson"><input type="text" name="eigth[]" class="input" id="${days[r]}-eigth"></td>
            <td class="double-lesson"><input type="text" name="ninth[]" class="input" id="${days[r]}-ninth"></td>
            <td class="no-double-lesson"><input type="text" name="tenth[]" class="input" id="${days[r]}-tenth"></td>
    `;
    tbody.appendChild(tr);
  }

  const allInputs = tbody.querySelectorAll(".input");
  studentInputs = allInputs;
  allInputs.forEach((td) => td.addEventListener("dblclick", addDoubleLesson));

    getStudentSessions((allSessions) => {
      allInputs.forEach(input => {
        const session = allSessions.find(ses => ses.id === input.id);
        
        if(session){
           const parent = input.parentElement;
           const span = document.createElement("span");
           const next = parent.nextElementSibling;

           if(editMode !== null && editMode.id === session.id){
              input.value = "";
           }else{
              input.value = 
              session.subject+"-"+session.teacher+"-"+session.type;
            
            if(session.type === "d"){
              if(next){
                next.style.display = "none";
                parent.setAttribute('colspan' , 2);
              }
              input.style.display = "none";
              span.innerHTML = `
                <h3>${session.subject}</h3>
                <h4>${session.teacher}</h4>
              `;
              parent.appendChild(span);
            }else if(session.type === "s"){
              input.style.display = "none";
              span.innerHTML = `
                <h3>${session.subject}</h3>
                <h4>${session.teacher}</h4>
              `;
              parent.appendChild(span); 
            }
           }

           span.addEventListener("dblclick" , (e) => {
            getTeachers((teachers) => {
               getLessons((lessons) => {
                const normalize = str => str.trim().toLowerCase();
                  const teacher = lessons.find(
                      (l) => l.class === clas && l.stream === stream && normalize(l.subject) === normalize(session.subject)
                    ); 
                  e.stopPropagation();
                  span.remove();

                  const teacherInfo = teachers.find(t => t.teacherCode === teacher.teacherCode);
                  const lessonInfo = {
                    details : teacherInfo,
                    type : session.type,
                    subject : session.subject
                  }

                  teacherEditmode = {
                    id : input.id
                  }

                  input.value = "";

                  createTeacherTimetable(input.id,false,lessonInfo,false);

                  postTeacherTimeTable(teacher.teacherCode);
                  postEditChanges(input.id , "");
                  showSuccessMessage("lesson removed sucessfully");
                  })
            })
           })
        }
      })
    },clas,stream);

  allInputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      const verified = verifySelects();

      if (verified) {
        const inputId = input.id;
        const value = e.target.value;
        const correctedSubject = correctUser(value);
        const subjectInitial = getInitials(correctedSubject);
        getSubjectTeacher(correctedSubject , (subjectTeacher) => {
            console.log(subjectTeacher)

            if (!subjectTeacher) showErrorMessage("no allocated teacher was found");
            if (!subjectTeacher) return;

            if (subjectTeacher) {
              checkUserAvailability(subjectTeacher,input.id , (available) => {
                const span = document.createElement("span");
                const parent = input.parentElement;
                let type;
                if(parent.classList.contains("opened")){
                  type = "d";
                }else{
                  type = "s";
                }
                
                if(available){
                    input.style.display = "none";
                    span.innerHTML = `
                        <h3>${subjectInitial}</h3>
                        <h4>${subjectTeacher.firstname}</h4>
                      `;
                    parent.appendChild(span);
              
                    input.value = 
                      correctedSubject+"-"+subjectTeacher.firstname+"-"+type; 
                    const lessonInfo = {
                      subject : correctedSubject,
                      type : type,
                      details : subjectTeacher
                    }  

                    createTeacherTimetable(inputId,true,lessonInfo,false);
                    postStudentTimeTable();
                }else{
                  const lessonInfo = {
                      subject : "",
                      type : type,
                      details : subjectTeacher
                  } 
                  showErrorMessage("teacher is occupied");
                  if(span) span.remove();
                  input.style.display = "inline-flex";
                  input.value = "";
                  createTeacherTimetable(inputId,false,lessonInfo,false);
                }
              })
            }
        });

      } else {
        showErrorMessage("please fill out all select fields");
      }
    });
  });
}

function verifySelects() {
  let allIsFilled = true;
  [classSelect, streamSelect].forEach((select) => {
    if (select.value === "") {
      allIsFilled = false;
    }
  });

  if (allIsFilled) {
    return true;
  } else {
    return false;
  }
}

function getSubjectTeacher(rawSubject , callback) {
  getLessons((lessons) => {
    getTeachers((teachers) => {
      const subject = rawSubject.toLowerCase();
      const thisLessons = lessons.find(
        (lesson) =>
          lesson.subject === subject &&
          lesson.class === classSelect.value &&
          lesson.stream === streamSelect.value
      );

      if (thisLessons) {
        const subjectTeacher = teachers.find(
          (teacher) => teacher.teacherCode === thisLessons.teacherCode
        );
        callback(subjectTeacher);
      } else {
        callback(false);
      }
    });
  });
}

//function to check for double lesso
function checkDoubleLesson(element) {
  if (element.classList.contains("opened")) {
    return "d";
  } else {
    return "s";
  }
}

//function to check teacher availability
function checkUserAvailability(details, id, callback) {
  const tcode = details.teacherCode;
  getTeacherSessions((teacherSessions) => {
    let availability = true;
    if (teacherSessions.length > 0) {
      const foundSession = teacherSessions.find((ts) => ts.id === id);
      if (foundSession) {
        if (foundSession.subject !== "") {
          availability = false;
        }
      }
    }
    callback(availability);
  }, tcode);
}

//function to create teacher timetable
function createTeacherTimetable(id, type, lessonInfo,editMode) {
  const tcode = lessonInfo.details.teacherCode;
  if(!clas) clas = classSelect.value;
  if(!stream) stream = streamSelect.value;
  getTeacherSessions((teacherSessions) => {
    const tbody = teacherContainer.querySelector("table tbody");
    const tableHeader = teacherContainer.querySelector(".head");
    teacherForm.style.display = "flex";
    const profileImage =
      lessonInfo.details.profileImage || "./teachers/profileimage.png";
    tableHeader.innerHTML = `
      <div class="upper">
        <div class="profile">
          <img src="${profileImage}"/>
        </div>
        <div class="name">
          <h2>${lessonInfo.details.firstname} ${lessonInfo.details.middlename}</h2>
          <h3>${lessonInfo.details.teacherCode}</h3>
          <h3>${lessonInfo.subject}</h3>
        </div>
      </div>
    `;
    tbody.innerHTML = "";
    for (let r = 0; r < 5; r++) {
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
            <td class="no-double-lesson"><input type="text" name="seventh[]" class="input" id="${days[r]}-seventh"></td>
            <td class="break"><h2>${lunch[r]}</h2></td>
            <td class="double-lesson"><input type="text" name="eigth[]" class="input" id="${days[r]}-eigth"></td>
            <td class="double-lesson"><input type="text" name="ninth[]" class="input" id="${days[r]}-ninth"></td>
            <td class="no-double-lesson"><input type="text" name="tenth[]" class="input" id="${days[r]}-tenth"></td>
      `;
      tbody.appendChild(tr);
    }

    const allInputs = tbody.querySelectorAll(".input");

    allInputs.forEach(input => {
      const session = teacherSessions.find(ses => ses.id === input.id);

      if(session){
           const parent = input.parentElement;
           const span = document.createElement("span");
           const next = parent.nextElementSibling;
  
           if(teacherEditmode !== null && session.id === teacherEditmode.id){
            input.value = ""
           }else{
              input.value = 
                 session.subject+"-"+session.class+"-"+session.stream+"-"+session.type;

              if(session.type === "d"){
                if(next){
                  next.style.display = "none";
                  parent.setAttribute('colspan' , 2);
                }
                input.style.display = "none";
                span.innerHTML = `
                  <h3>${session.subject}</h3>
                  <h4>form${session.class} ${convertStream(session.stream)}</h4>
                `;
                parent.appendChild(span);
              }else if(session.type === "s"){
                input.style.display = "none";
                span.innerHTML = `
                  <h3>${session.subject}</h3>
                  <h4>form${session.class} ${convertStream(session.stream)}</h4>
                `;
                parent.appendChild(span); 
              }

              span.addEventListener("dblclick" , (e) => {
                e.stopPropagation();
                removeSpan(span,lessonInfo.details.teacherCode,session);
              })
           }
      }
    })

    allInputs.forEach(input => {
      if(input.id === id){
        let status = true;
        const parent = input.parentElement;
        const next = parent.nextElementSibling;
        const span = document.createElement("span");
        if(type){
            parent.classList.remove("errors");           
            if(lessonInfo.type === "d"){
              if(next) next.style.display = "none";
              parent.setAttribute('colspan', 2);
              input.style.display = "none";
              span.innerHTML = `
                <h3>${lessonInfo.subject}</h3>
                <h4>form${clas} ${convertStream(stream)}</h4>
              `;
              parent.appendChild(span);
              input.value =
              lessonInfo.subject+"-"+clas+"-"+stream+"-"+"d";
            }else if(lessonInfo.type === "s"){
              input.style.display = "none"
              span.innerHTML = `
                <h3>${lessonInfo.subject}</h3>
                <h4>form${clas} ${convertStream(stream)}</h4>
              `;
              parent.appendChild(span);
              input.value =
              lessonInfo.subject+"-"+clas+"-"+stream+"-"+"s";
            }else{
              status = false;
            }
        }else{
          parent.classList.add("errors");
        }

        if(status){
          postTeacherTimeTable(lessonInfo.details.teacherCode);
        }
      }
    })

    allInputs.forEach(input => {
      input.addEventListener("dblclick" , addDoubleLesson);
    })

  allInputs.forEach(input => {
  if (editMode) {
    let pressTimer;

    input.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      e.preventDefault();

      clearTimeout(pressTimer);

      pressTimer = setTimeout(() => {
        getLessons((lessons) => {
          lessonUlFunction(input, lessons,lessonInfo);
        });
      }, 600);
    });

    input.addEventListener("mouseup", () => {
      clearTimeout(pressTimer);
    });

    input.addEventListener("mouseleave", () => {
      clearTimeout(pressTimer);
    });

    input.addEventListener("touchstart", (e) => {
      e.stopPropagation();
      pressTimer = setTimeout(() => {
        getLessons((lessons) => {
          lessonUlFunction(input, lessons,lessonInfo);
        });
      }, 600);
    });

    input.addEventListener("touchend", () => {
      clearTimeout(pressTimer);
    });
  }
});


  
  }, tcode);
}

function lessonUlFunction(input,lessons,lessonInfo){
  const parent = input.parentElement;
  const span = document.createElement("span");
  input.style.display = "none";
  const myLessons = lessons.filter(
    (l) => l.teacherCode === lessonInfo.details.teacherCode
  )

  let type;
  if(parent.classList.contains("opened")){
    type = "d"
  }else{
    type = "s";
  }

  if(myLessons.length > 0){
      const ul = document.createElement("ul");
      myLessons.forEach(lesson => {
        const li = document.createElement("li");
        li.innerHTML = `
            <h4>form${lesson.class} 
                ${convertStream(lesson.stream)} ${lesson.subject}
            </h4>
        `;
        ul.appendChild(li);

        li.addEventListener("click" , (e) => {
          e.stopPropagation();
          clas = lesson.class
          stream = lesson.stream
          input.value = 
             lesson.subject+"-"+lesson.class+"-"+lesson.stream+"-"+type;
          span.innerHTML = `
             <h3>${getInitials(lesson.subject)}</h3>
             <h4>form${lesson.class} ${convertStream(lesson.stream)}</h4>
          `; 
          const value = lesson.subject+"-"+lessonInfo.details.firstname+"-"+type;
          postEditChanges(input.id,value);
          postTeacherTimeTable(lesson.teacherCode);
        })
      })
        span.appendChild(ul);
        parent.appendChild(span);
  }
}

//accesory function
function getId(key) {
  const allIds = {
    lesson1: "first",
    lesson2: "second",
    lesson3: "third",
    lesson4: "forth",
    lesson5: "fifth",
    lesson6: "sixth",
    lesson7: "seventh",
    lesson8: "eigth",
    lesson9: "ninth",
    lesson10: "tenth",
  };
  return allIds[key];
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

function addDoubleLesson(e) {
  e.stopPropagation();
  const parent = this.parentElement;
  const next = parent.nextElementSibling;
  const input = parent.querySelector(".input");

  if (!parent) {
    console.log("no parent found");
    return;
  }

  if (parent.classList.contains("opened")) {
    parent.classList.remove("opened");
    parent.removeAttribute("colspan");

    if (next) next.style.display = "flex";

    const input = parent.querySelector(".input");
    if (input) {
      input.style.display = "inline-flex";
      input.value = "";
    }
  }else if(parent.classList.contains("no-double-lesson") || next.classList.contains("break")){
     showErrorMessage("double lesson error")
  }else {
    // Expand to double lesson
    parent.classList.add("opened");
    parent.setAttribute("colspan", 2);
    if (next) next.style.display = "none";
  }
}

function removeSpan(span,tcode,session) {
  const parent = span.parentElement;
  const next = parent.nextElementSibling;
  const input = parent.querySelector(".input");
  clas = session.class;
  stream = session.stream;
  editMode = ""
  
  if(span){
    span.remove();
    if(input) input.style.display = "inline-flex";
    if(input) input.value = "";
    showSuccessMessage("lesson removed successfully");

    studentForm.style.display = "flex";
    const select = studentForm.querySelector(".select");
    if(select) select.style.display = "none";
        
    editMode = {
      id : input.id,
    }

    createStudentTable();
    postTeacherTimeTable(tcode)
    postEditChanges(input.id,"");
    
    if(next.style.display === "none"){
      parent.removeAttribute('colspan');
      next.style.display = "flex";
    }
  }
}

function convertStream(rawStream) {
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

//this works as a simple word corrector

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

//function to post results to the database
function postStudentTimeTable() {
  const formData = new FormData(studentForm);
  formData.append("student-class" ,  clas || classSelect.value);
  formData.append("student-stream" , stream || streamSelect.value);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "timetable.php", true);
  xhr.onload = () => {
    if (xhr.status == 200) {
      const response = JSON.parse(xhr.responseText);
    }
  };
  xhr.send(formData);
}

function postEditChanges(id,value){
  const [day,session] = id.split("-");
  const inputName = getInputPhpName(session);
  const data = new FormData();
  data.append("day" , day);
  data.append("class" , clas || classSelect.value);
  data.append("stream" , stream || streamSelect.value);
  data.append("lesson" , inputName);
  data.append("value" , value || "");

  const xhr = new XMLHttpRequest();
  xhr.open('POST','timetableedit.php',true);
  xhr.onload = () => {
    try{
      if(xhr.status == 200){
        const response = JSON.parse(xhr.responseText); 
        console.log(value);
        console.log(response.value)
      }
    }catch(error){
      console.log("error" , error);
    }finally{
      console.log(xhr.responseText);
    }
  }
  xhr.send(data);
}

function getInputPhpName(session){
  const phpNames = {
    first : "lesson_one",
    second : "lesson_two",
    third : "lesson_three",
    fourth : "lesson_four",
    fifth : "lesson_five",
    sixth : "lesson_six",
    seventh : "lesson_seven",
    eigth : "lesson_eigth",
    ninth : "lesson_nine",
    tenth : "lesson_ten"
  }
  return phpNames[session];
}

function postTeacherTimeTable(tcode) {
  const formData = new FormData(teacherForm);
  formData.append("teacher-code", tcode);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "postteacher.php", true);
  xhr.onload = () => {
    if (xhr.status == 200) {
      const response = JSON.parse(xhr.responseText);
    }
  };
  xhr.send(formData);
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
createStudentTable();
classSelect.addEventListener("change", () => {
  clas = "";
  stream = "";
  createStudentTable();
});
streamSelect.addEventListener("change", () => {
  clas = "";
  stream = "";
  createStudentTable();
});
teacherForm.style.display = "none";

//the top section invloved style to add a new lesson into a timetable

/**this below section handles:
  lesoon editing ,
  remedial adding
  all the function s to make the time qtble 100% effective   
*/

///functions to edit the timetable start here

const editBtn = document.querySelector(".head-buttons .edit");
const remedialBtn = document.querySelector(".head-buttons .remedials");
const mainContent = document.querySelector(".main-content");
const centralise = document.querySelector(".centralise");
 const teacherDiv = document.querySelector(".teacher-container");

editBtn.addEventListener("click", (e) => {
  if(editBtn.classList.contains("opened")){
      editBtn.classList.remove("opened");
      editBtn.textContent = "edit";
      editBtn.style.backgroundColor = "var(--soft-white)";
      editBtn.style.color = "black";
      editBtn.style.border = "1px solid #d1d5db"
      centralise.style.flexDirection = "column";
      studentForm.style.display = "flex";
      teacherForm.style.display = "none";
      teacherDiv.style.display = "none"
  }else{
      editBtn.classList.add("opened");
      editBtn.textContent = "back";
      editBtn.style.backgroundColor = "red"
      editBtn.style.color = "#ffe5e5";
      centralise.style.flexDirection = "column-reverse";
      studentForm.style.display = "none";
      classSelect.parentElement.parentElement.style.display = "flex"
      teacherForm.style.display = "none";
      displayAllTeachers();
  }
});

const delay = 0.3;

function displayAllTeachers() {
  getTeachers((teachers) => {
    teacherDiv.style.display = "grid";
    teacherDiv.innerHTML = "";

    teachers.forEach((teacher, i) => {
      const div = document.createElement("div");
      const profileImage = teacher.profileImage || "./teachers/profileimage.png";
      div.className = "box";

      // Set initial styles before animation
      div.style.opacity = "0";
      div.style.transform = "scale(0.9)";
      div.style.transition = "all 0.4s ease";
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

      teacherDiv.appendChild(div);

      // Allow the browser to render before triggering the transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          div.style.opacity = "1";
          div.style.transform = "scale(1)";
        });
      });

      // Handle click
      div.addEventListener("click", (e) => {
        e.stopPropagation();
        const lessonInfo = {
          subject: `${teacher.subjectOne} ${teacher.subjectTwo}`,
          type: "s",
          details: teacher,
        };
        teacherDiv.style.display = "none";
        teacherForm.style.display = "flex";
        createTeacherTimetable("monday-twenty", false, lessonInfo, true);
      });
    });

    centralise.appendChild(teacherDiv);
  });
}


///functions to edit the timetable end here


//functions for remedials start here
