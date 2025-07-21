//variables
const classSelect = document.getElementById("class");
const examSelect = document.getElementById("exam");
const termSelect = document.getElementById("term");
const table = document.querySelector(".body .table");
const submitBtn = document.querySelector(".submit-btn .submit");

const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");

//function section
function getUser(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "saved_user.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("LOgin Error", error);
    }
  };
  xhr.send();
}

//function to getStudents
function getStudents(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "students.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Student Error", error);
    }
  };
  xhr.send();
}

//function getTeachers
function getTeachers(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "teachers.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Student Error", error);
    }
  };
  xhr.send();
}

//function to verify teacher

function verifyTeacher() {
  getUser((user) => {
    getTeachers((teachers) => {
      if (user.from === "students") return;
      const foundTeacher = teachers.find((t) => t.teacherCode === user.code);
      if (foundTeacher) {
        if (foundTeacher.rank === "H.O.D") {
          displayStudents(true);
        } else {
          displayStudents(false);
        }
      } else {
        showErrorMessage("contact support");
        return;
      }
    });
  });
}

function displayStudents(boolean) {
  if (boolean) {
    getStudents((students) => {
      const verified = verifySelects();
      if (verified) {
        const tableBody = table.querySelector("table tbody");
        tableBody.innerHTML = "";
        const thisClassStudents = students.filter(
          (s) => s.class === classSelect.value
        );
        thisClassStudents.forEach((student, idx) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
                      <td>${idx + 1}</td>
                      <td>${student.admission}</td>
                      <td style="text-align: left;">${student.firstname} ${
            student.middlename
          } ${student.lastname}</td>
                      <td class="remove">form${student.class}</td>
                      <td class="remove" style="text-align: left;">${convertStream(
                        student.stream
                      )}</td>
                      <td><input type="text" class="term-input"/><span></span></td>
                      <td><input type="text" class="exam-input"/><span></span></td>
                      <input type="hidden" class="" value="${
                        student.admission
                      }" name="admission[]"/>
                       <input type="hidden" class="" value="${
                        student.stream
                      }" name="stream[]"/>
                    `;
          tableBody.appendChild(tr);
        });
        const termInputs = tableBody.querySelectorAll(".term-input");
        const examInputs = tableBody.querySelectorAll(".exam-input");

        termSelect.addEventListener("input", (e) => {
          termInputs.forEach((input) => {
            input.value = e.target.value;
            const spanElement = input.nextElementSibling;
            if (spanElement) {
              spanElement.textContent = "term" + e.target.value;
            }
          });
        });
        examSelect.addEventListener("input", (e) => {
          examInputs.forEach((input) => {
            input.value = e.target.value;
            const spanElement = input.nextElementSibling;
            if (spanElement) {
              spanElement.textContent = convertExam(e.target.value);
            }
          });
        });
      } else {
        showErrorMessage("⚠️ Please fill in all required fields.");
      }
    });
  } else {
    showErrorMessage("access denied");
  }
}

function verifySelects() {
  classSelect.classList.remove("errors");
  if (classSelect.value !== "") {
    classSelect.classList.add("errors");
    return true;
  } else {
    return false;
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

function postFeedback(message,destination,from,description,type){
  const data = new FormData();
  data.append("message" , message);
  data.append("destination" , destination);
  data.append("from" , from);
  data.append("description" , description);
  data.append("type" , type);
  const xhr = new XMLHttpRequest();
  xhr.open('POST','postfeedback.php',true);
  xhr.onload = () => {
    try{
       if(xhr.status === 200){
        const response = JSON.parse(xhr.responseText);
       }
    }catch(error){
      console.log("feedback error" , error);
    }finally{
      console.log(xhr.responseText);
    }
  }
  xhr.send(data);
}


function postExamForm(){
    console.log("am called")
   if(classSelect.value !== "" && termSelect.value !== "" && examSelect.value !== ""){
    const formData = new FormData(table);
    formData.append("class", classSelect.value);
    formData.append("term", termSelect.value);
    formData.append("exam", examSelect.value);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "exam.php", true);
    xhr.onload = () => {
      try {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if(response.type === true){
            let alah;
            response.message.trim() === "update success" ? alah = "updated" : alah = "added";
            showSuccessMessage(`exam was ${alah} succesfully`);
            const message = `The ${convertExam(examSelect.value)} exam for Form${classSelect.value} has just been set`;
            const destination = `teacher-${classSelect.value}`;
            const description = `new ${convertExam(examSelect)} exam for form${classSelect.value} was just uploaded wanna check out`;
            const type = `educative-exam-${classSelect.value}`;
            const from = `H.O.D-examination`
            postFeedback(message,destination,from,description,type);
          }else{
            showErrorMessage(response.message);
            console.log(response.errorInfo);
          }
        }
      } catch (error) {
          console.log("Posting error", error);
      } finally {
        console.log(xhr.responseText);
      }
    };
    xhr.send(formData);
   } else{
    showErrorMessage("please fill up term & exam");
   }
}

//errro handling functions
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
verifyTeacher();

classSelect.addEventListener("change", verifyTeacher);
submitBtn.addEventListener("click" , postExamForm);


