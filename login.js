const studentLogin = document.querySelector("#student");
const teacherLogin = document.querySelector("#teacher");

const studentBtn = document.querySelectorAll(".student");
const teacherBtn = document.querySelectorAll(".teacher");

const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");

document.addEventListener("DOMContentLoaded", () => {
  studentLogin.classList.add("active");
  teacherLogin.style.position = "absolute";
});

studentBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    studentLogin.classList.add("active");
    teacherLogin.classList.remove("active");
    teacherLogin.style.position = "absolute";
  });
});

teacherBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    studentLogin.classList.remove("active");
    teacherLogin.classList.add("active");
    studentLogin.style.position = "absolute";
  });
});

const studentLoginBtn = studentLogin.querySelector(".login");
const teacherLoginBtn = studentLogin.querySelector(".login");

function loginStudent() {
  const loginCredentials = new FormData();
  const username = document.getElementById("s-username");
  const passowrd = document.getElementById("s-password");
  loginCredentials.append("user", username.value);
  loginCredentials.append("pass", passowrd.value);
  loginCredentials.append("username", "");
  loginCredentials.append("password", "");

  const verified = verifyInputs(passowrd, username);
  if (!verified) showErrorMessage("fill in all required fields");
  if (!verified) return;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "slogin.php", true);
  studentLoginBtn.textContent = "verifying...";
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        studentLoginBtn.textContent = "login";
        if (response.type) {
          window.location.href = "dashboard.html";
        } else {
          showErrorMessage("invalid credentials");
        }
      }
    } catch (error) {
      console.log("student login error", error);
    } finally {
      console.log(xhr.responseText);
    }
  };
  xhr.send(loginCredentials);
}

studentLoginBtn.addEventListener("click", loginStudent);

function verifyInputs(pass, user) {
  let verified = true;
  [pass, user].forEach((input) => {
    if (input.value === "") {
      input.style.borderBottom = "1px solid red";
      verified = false;
    }
  });

  if (verified) {
    return true;
  } else {
    return false;
  }
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
