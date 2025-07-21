const sortButton = document.querySelector(".sort .open");
const sortDropdown = document.querySelector(".sort .dropdown");
const sortDropdownButtons = document.querySelectorAll(".sort .dropdown button");
const sortDropdownInput = document.querySelector(".sort .dropdown input");
const headBtns = document.querySelectorAll(".head .navigations button");

const main = document.querySelector(".main");

const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");

const assignmentSection = document.querySelector(".right .lower .body");
const assignmentBtn = document.querySelector(".navigations .assignment");
const notesBtn = document.querySelector(".navigations .notes");

//functions section
function navigateButtons(e) {
  headBtns.forEach((headBtn) => {
    headBtn.style.borderBottom = "none";
  });
  e.target.style.borderBottom = "2px solid navy";
}

//function to get loged in user
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

//function to get avaiable assignment
function getAssignments(callback) {
  getUser((user) => {
    let code;
    if (user.from === "student") {
      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get("code");
      code = urlCode;
    }else{
      code = user.code;
    }
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "getassign.php", true);
    xhr.onload = () => {
      try {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const match = response.filter((a) => a.code === code);
          callback(match);
        }
      } catch (error) {
        console.log("ERROR=>", error);
      }
    };
    xhr.send();
  });
}

//function to display the assignments
function displayAssignments() {
  getAssignments((assignments) => {
    const noresult = assignmentSection.querySelector(".no-result")
    const ul = document.querySelector(".body ul");
    ul.innerHTML = "";
    if (assignments.length > 0) {
      noresult.style.display = "none";
      ul.style.display = "flex";
      ul.style.flexDirection = "column";
      assignments.forEach((assignment, idx) => {
        const li = document.createElement("li");
        if (assignment.type === "document") {
          //if the file is a document
          li.innerHTML = `
                    <a href="${assignment.path}" target="_blank">
                        <h3>${assignment.fileName}</h3>
                        <h4>${assignment.subject}</h4>
                    </a>    
                   `;
        } else if (assignment.type === "image") {
          li.innerHTML = `
                        <h3>${assignment.fileName}</h3>
                        <h4>${assignment.subject}</h4>
                     `;
          li.addEventListener("click", () => {
            window.open(assignment.path, "_blank");
          });
        }
        li.style.display = idx > 3 ? "none" : "flex";
        ul.appendChild(li);
      });
    } else {
      noresult.style.display = "flex";
      ul.style.display = "none";
    }
  });
}

//function to hide the main section details
function hideMainChildren() {
  const children = main.children;
  main.classList.add("ql-editor");
  Array.from(children).forEach((child) => {
    child.style.display = "none";
  });
}

//function to get notes from database
function getNotes(callback) {
  getUser((user) => {
    let code;
    if (user.from === "student") {
      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get("code");
      code = urlCode;
      console.log("student mode")
    } else {
      code = user.code;
      console.log("wozaa")
    }
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "getnotes.php", true);
    xhr.onload = () => {
      try {
        if (xhr.status == 200) {
          const response = JSON.parse(xhr.responseText);
          const mine = response.filter((n) => n.teacherCode === code);
          callback(mine);
        }
      } catch (error) {
        console.log("error =>", error);
      }
    };
    xhr.send();
  });
}

//function to display notes
function displayNotes() {
  getNotes((notes) => {
    const noresult = assignmentSection.querySelector(".no-result")
    const ul = document.querySelector(".body ul");
    if (notes.length > 0) {
      noresult.style.display = "none";
      ul.style.display = "flex";
      ul.style.flexDirection = "column";
      ul.innerHTML = "";
      notes.forEach((note) => {
        const li = document.createElement("li");
        li.innerHTML = `
                        <h3>${note.topic}</h3>
                        <h4>${note.subject}</h4>
             `;
        ul.appendChild(li);

        li.addEventListener("click", () => {
          hideMainChildren();
          main.innerHTML = note.notes;
        });
      });
    } else {
      noresult.style.display = "flex";
      ul.style.display = "none";
    }
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
displayAssignments();
console.log(assignmentSection);
//event listners
headBtns.forEach((headbtn) => {
  headbtn.addEventListener("click", navigateButtons);
});

sortButton.addEventListener("click", function () {
  if (sortButton.classList.contains("opened")) {
    sortDropdown.style.height = "12rem";
    sortDropdown.style.overflow = "auto";
    sortButton.classList.remove("opened");
  } else {
    sortDropdown.style.height = "0";
    sortDropdown.style.overflow = "hidden";
    sortButton.classList.add("opened");
  }
});

notesBtn.addEventListener("click", displayNotes);
assignmentBtn.addEventListener("click", displayAssignments);
