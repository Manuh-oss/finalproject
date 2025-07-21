const assignentSection = document.querySelector(".assignment-body");
const subjectSelect = document.querySelector(".select #subject");
const classSelect = document.querySelector(".select #class");
const myAssignBtn = document.querySelector(".head .mine");
const otherAssignBtn = document.querySelector(".head .other");

const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");

/* function calls section
   1 get the assignments
   2. display tem
   3 add some bit of functionality
*/

//function to get lgged in user
function getUser(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "saved_user.php", true);
  xhr.onload = () => {
    if (xhr.status == 200) {
      const tcode = JSON.parse(xhr.responseText);
      callback(tcode);
    }
  };
  xhr.send();
}

//function to get the assignments
function getAssignments(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "getassign.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("ERROR=>", error);
    }
  };
  xhr.send();
}

//function to getSubject teachers
function getSubjectTeacher(callback) {
  getUser((user) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "lesson.php", true);
    xhr.onload = () => {
      try {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const match = response.filter(
            (s) => s.class === user.class && s.stream === s.stream
          );
          callback(match);
        }
      } catch (error) {
        console.log("ERROR=>", error);
      }
    };
    xhr.send();
  });
}

//function to display The assignents
function displayMyassignments() {
  getAssignments((assignments) => {
    getSubjectTeacher((teachers) => {
      const ul = assignentSection.querySelector("ul");
      const noresult = assignentSection.querySelector(".noresult");
      teachers.forEach((teacher) => {
        const myAssignments = assignments.filter(
          (a) => a.code === teacher.teacherCode
        );
        if (myAssignments.length > 0) {
          ul.innerHTML = "";
          noresult.style.display = "none";
          ul.style.display = "flex";

          myAssignments.forEach((assignment) => {
            const li = document.createElement("li");
            if (assignment.type === "document") {
              li.innerHTML = `
               <a href="${assignment.path}" target="_blank">
                <h3>${assignment.fileName}</h3>
                <h4>${assignment.subject}</h4>
                <a href="${assignment.path} download"><p>download</p></a>
               </a> 
              `;
            } else if (assignment.type === "image") {
              li.innerHTML = `
                  <h3>${assignment.fileName}</h3>
                  <h4>${assignment.subject}</h4>
                  <a href="${assignment.path} download"><p>download</p></a>
                `;
              li.addEventListener("click", () => {
                window.open(assignment.path, "_blank");
              });
            }
            ul.appendChild(li);
          });
        } else {
          ul.style.display = "none";
          noresult.style.display = "flex";
        }
      });
    });
  });
}

//function displayOther assignments
function displayOtherAssignments() {
  getAssignments((assignments) => {
    getSubjectTeacher((teachers) => {
      const ul = assignentSection.querySelector("ul");
      const noresult = assignentSection.querySelector(".noresult");
      teachers.forEach((teacher) => {
        const myAssignments = assignments.filter(
          (a) => a.code !== teacher.teacherCode
        );
        if (myAssignments.length > 0) {
          ul.innerHTML = "";
          noresult.style.display = "none";
          ul.style.display = "flex";

          myAssignments.forEach((assignment) => {
            const li = document.createElement("li");
            if (assignment.type === "document") {
              li.innerHTML = `
               <a href="${assignment.path}" target="_blank">
                <h3>${assignment.fileName}</h3>
                <h4>${assignment.subject}</h4>
                <a href="${assignment.path} download"><p>download</p></a>
               </a> 
              `;
            } else if (assignment.type === "image") {
              li.innerHTML = `
                  <h3>${assignment.fileName}</h3>
                  <h4>${assignment.subject}</h4>
                  <a href="${assignment.path} download"><p>download</p></a>
                `;
              li.addEventListener("click", () => {
                window.open(assignment.path, "_blank");
              });
            }
            ul.appendChild(li);
          });
        } else {
          ul.style.display = "none";
          noresult.style.display = "flex";
        }
      });
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

//function calls
displayMyassignments();
//event listeners

myAssignBtn.addEventListener("click", displayMyassignments);
otherAssignBtn.addEventListener("click", displayOtherAssignments);
subjectSelect.addEventListener("change", displayOtherAssignments);
classSelect.addEventListener("change", displayOtherAssignments);
