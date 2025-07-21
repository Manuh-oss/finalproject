const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");

const controller = document.getElementById("controller");
const centralise = document.querySelector(".centralise");
const table = document.querySelector(".table");
const classtext = document.querySelector(".h2");
const submitBtn = document.querySelector("#submit");

const date = new Date();
const today =
  date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

const colors = ["#fdecea", "#eaf3fc", "#e6f4ea"];

//this function get teacher code from the login
function getTCode() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "saved_user.php", true);
  xhr.onload = () => {
    if (xhr.status == 200) {
      const tcode = JSON.parse(xhr.responseText);
      getTeacher(tcode.code);
    }
  };
  xhr.send();
}

// this function gets the teacher and validates him

function getTeacher(code) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "teachers.php", true);
  xhr.onload = () => {
    if (xhr.status == 200) {
      const response = JSON.parse(xhr.responseText);
      const match = response.find((t) => t.teacherCode === code);
  
      if(match){
        if (match.classTeacher !== "-") {
          const [clas, stream] = match.classTeacher.split("-");
          getStudents(clas, stream);
        } else {
          document.querySelector(".submit-btn button").style.display = "none";
        }
      }
    }
  };
  xhr.send();
}

// this funtion gets students from database and filters them accorfding to class and stream
function getStudents(clas, stream) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "students.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      const students = response.filter(
        (s) => s.class === clas && s.stream === stream
      );
      classtext.innerText = `form${clas} ${convertStream(stream)} register`;
      displayStudents(students);
    }
  };
  xhr.send();
}

//this function displays the students

function displayStudents(data) {
  const tableBody = table.querySelector("tbody");
  const noresult = centralise.querySelector(".noresult");
  tableBody.innerHTML = "";

  if (data.length > 0) {
    centralise.removeChild(noresult);

    data.forEach((datum) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td>${datum.admission}</td>
                <td class="name">${datum.firstname} ${datum.middlename} ${datum.lastname}</td>
                <td><select name="monday[]" id="">
                    <option value="present">present</option>
                    <option value="absent">absent</option>
                    <option value="permitted">permitted</option>
                </select></td>
                <td><select name="tuesday[]" id="">
                    <option value="present">present</option>
                    <option value="absent">absent</option>
                    <option value="permitted">permitted</option>
                </select></td>
                <td><select name="wednesday[]" id="">
                    <option value="present">present</option>
                    <option value="absent">absent</option>
                    <option value="permitted">permitted</option>
                </select></td>
                <td><select name="thursday[]" id="">
                    <option value="present">present</option>
                    <option value="absent">absent</option>
                    <option value="permitted">permitted</option>
                </select></td>
                <td><select name="friday[]" id="friday">
                    <option value="present">present</option>
                    <option value="absent">absent</option>
                    <option value="permitted">permitted</option>
                </select></td>
                <input type="hidden" name="week" class="date"/>
                <input type="hidden" name="admission[]" value="${datum.admission}"/>
            `;
      tableBody.appendChild(tr);
    });

    const selects = tableBody.querySelectorAll("select");

    selects.forEach((select) => {
      select.addEventListener("change", () => {
        if (select.value.trim() === "absent") {
          select.style.backgroundColor = colors[0];
        } else if (select.value.trim() === "permitted") {
          select.style.backgroundColor = colors[1];
        } else {
          select.style.backgroundColor = colors[2];
        }
      });
    });

    selects.forEach((select) => {
      controller.addEventListener("change", () => {
        select.value = controller.value;
        if (controller.value === "absent") {
          select.style.backgroundColor = colors[0];
        } else if (controller.value === "permitted") {
          select.style.backgroundColor = colors[1];
        } else {
          select.style.backgroundColor = colors[2];
        }
      });
    });

    const dateInputs = tableBody.querySelectorAll(".date");
    dateInputs.forEach((input) => {
      input.value = getCurrentWeekNumber();
    });
  }else{
    submitBtn.parentElement.style.display = "none";

  }
}

function convertStream(value) {
  switch (value) {
    case "111":
      value = "green";
      break;
    case "222":
      value = "blue";
      break;
    case "333":
      value = "red";
      break;
    case "444":
      value = "purple";
      break;
  }
  return value;
}

//function to post the register

function postRegister() {
  console.log("am caleed");
  const formData = new FormData(table);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "register.php", true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.type === true) {
        if (response.message === "update succesfull") {
          showSuccessMessage("changes saved succesfully");
        } else if (response.message === "insertion succesfull") {
          showSuccessMessage("register added succesfullt");
        }
      } else {
        showErrorMessage("error in uplading register");
      }
    }
  };
  xhr.send(formData);
}

//this function get the current week number from januarry first

function getCurrentWeekNumber() {
  const now = new Date();

  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday (0) into 7 for ISO 8601 week calculation
  const dayNumber = (now.getDay() + 6) % 7;
  now.setDate(now.getDate() - dayNumber + 3);

  // January 4 is always in week 1 (ISO rule)
  const firstThursday = new Date(now.getFullYear(), 0, 4);
  const diff = now - firstThursday;

  // Calculate full weeks to current date
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
  const weekNumber = 1 + Math.floor(diff / oneWeekMs);

  return weekNumber;
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

// calling functions

getTCode();

//event Listners


submitBtn.addEventListener("click", postRegister);
