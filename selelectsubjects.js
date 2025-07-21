const parent = document.querySelector(".grid-container");
const parentTwo = document.querySelector(".teacher-container");
const button = document.querySelector(".submit-btn");
const subjectInput = document.querySelector(".subject-input");
const codeInput = document.querySelector(".code-input");
const submitBtn = document.querySelector(".submit-btn .submit");
const backBtn = document.querySelector(".submit-btn .back");
const requiredInputs = document.querySelectorAll(".required");
const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");
const form = document.querySelector(".centralise");
const newForm = document.querySelector(".select");

const children = parent.children;

const subjectGrid = parent.querySelectorAll(".subject-grid");

const teacherGrid = parent.querySelectorAll(".teacher-box");

const colors = [
  "#AEDFF7",
  "#F4D19B",
  "#CFF2E1",
  "#B2EBF2",
  "#D1F2A5",
  "#B0C4DE",
  "#DDECC9",
  "#E6CFC1",
  "#E4DEF3",
  "#F9E7C3",
  "#D0E6B3",
  "#F8C8DC",
  "#A7FOF9",
];

let delay = 0.2;

for (let x = 0; x < children.length; x++) {
  children[x].style.transitionDelay = `${delay * x}` + "s";
  children[x].style.backgroundColor = colors[x];
  children[x].style.border = "none";
  children[x].textContent = children[x].querySelector(".text").textContent;
}

window.addEventListener("load", function () {
  subjectGrid.forEach((element) => {
    element.style.opacity = "1";
    element.style.transform = "scale(1)";
  });
});

function validateInputs(subject) {
  let allIsfilled = true;
  requiredInputs.forEach((required) => required.classList.remove("errors"));
  requiredInputs.forEach((input) => {
    if (input.value.trim() === "") {
      allIsfilled = false;
      input.classList.add("errors");
    } else {
      allIsfilled = true;
    }
  });

  if (allIsfilled) {
    getTeachers(subject);
  } else {
    showErrorMessage("all input fields are required");
  }
}

function getSubject() {
  subjectGrid.forEach((grid) => {
    grid.addEventListener("click", function () {
      subjectInput.value = grid.textContent.trim();
      validateInputs(grid.textContent.trim());
    });
  });
}

function getTeachers(subject) {
  const allSubjects = [];
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "teachers.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = () => {
    if (xhr.status == 200) {
      const response = JSON.parse(xhr.responseText);
      const subjectOne = response.filter(
        (newSubject) => newSubject.subjectOne === subject
      );
      const subjectTwo = response.filter(
        (newSubject) => newSubject.subjectTwo === subject
      );
      for (let x = 0; x < subjectOne.length; x++) {
        allSubjects.push(subjectOne[x]);
      }
      for (let y = 0; y < subjectTwo.length; y++) {
        allSubjects.push(subjectTwo[y]);
      }
      displayTeachers(allSubjects);
    }
  };
  xhr.send();
}

function getLessonsTaught(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "lesson.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("lesson Error", error);
    }
  };
  xhr.send();
}

function displayTeachers(array) {
  hideSubjects();
  parentTwo.innerHTML = "";
  if (array.length > 0) {
    getLessonsTaught((lessons) => {
      parentTwo.style.display = "grid";
      array.forEach((teacher, i) => {
        const newDiv = document.createElement("div");

        const profileImage =
          teacher.profileImage === ""
            ? "./teachers/profileimage.png"
            : teacher.profileImage;
        const myLessons = lessons.filter(
          (l) => l.teacherCode === teacher.teacherCode
        );

        newDiv.className = "box";
        newDiv.style.transitionDelay = `${delay * i}` + "s";
        newDiv.style.opacity = "1";
        newDiv.style.transform = "scale(1)";
        newDiv.innerHTML = `
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
                  <h5 style="display:none;">${teacher.teacherCode}</h5>
                  <h4>teaching ${myLessons.length} lessons</h4>
                </div>
                <i style="display:none;" class="fas fa-check"></i>
        `;
        parentTwo.appendChild(newDiv);
      });
      postTeacher(parentTwo.querySelectorAll(".box"));
    });
  } else {
    parentTwo.style.display = "flex";
    const noresult = document.createElement("div");
    noresult.className = "noresult";
    noresult.innerHTML = `
    <img src="./subjects/noresulttwo.jpeg" alt="">
    `;
    parentTwo.appendChild(noresult);
  }
}

function postTeacher(array) {
  Array.from(array).forEach((div) => {
    div.addEventListener("click", function () {
      codeInput.value = div.querySelector(".lower h5").textContent;
      const allCheckBoxes = div.parentElement.querySelectorAll(".fa-check");
      allCheckBoxes.forEach((checkBox) => (checkBox.style.display = "none"));
      if (codeInput.value.trim() !== "") {
        showSuccessMessage("teacher selected successfully");
        const checkBox = this.querySelector(".fa-check");
        checkBox.style.display = "grid";
        clickSubmitBtn(true);
      } else {
        console.log("error");
        clickSubmitBtn(false);
      }
    });
  });
}

function clickSubmitBtn(bool) {
  if (bool) {
    submitBtn.addEventListener("click", submitTeacher);
  }
}

function submitTeacher() {
  const formData = new FormData(newForm);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "submit.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        if (response.type == true) {
          showSuccessMessage(response.message);
        } else if (response.message == false) {
          showErrorMessage(response.message);
        }
      }
    } catch (error) {
      console.log("submit error" , error)
    } finally {
      console.log(xhr.responseText);
    }
  };
  xhr.send(formData);
}

function hideSubjects() {
  parentTwo.style.display = "grid";
  parent.style.display = "none";
  submitBtn.parentElement.style.display = "flex";
}

function hideTeachers() {
  parentTwo.style.display = "none";
  parent.style.display = "grid";
  submitBtn.parentElement.style.display = "none";
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

getSubject();
clickSubmitBtn();
backBtn.addEventListener("click", hideTeachers);
