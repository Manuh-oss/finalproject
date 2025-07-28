const loginBox = document.querySelector(".login-box");
const otpBox = document.querySelector(".verify");
const button = document.querySelector(".login-bt");
const otpInputs = document.querySelectorAll(".input");
const verfiyOtpBtn = otpBox.querySelector(".verify-otp");

const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");

document.addEventListener("DOMContentLoaded", () => {
  otpBox.style.display = "none"
  loginBox.style.transform = "translateX(0) scale(1)";
  loginBox.style.opacity = "1";
});

const username = document.querySelector("#email");
const password = document.querySelector("#password");

[username,password].forEach(input => {
 input.addEventListener("input" , (e) => {
  const icon = input.nextElementSibling;
  icon.classList.remove("fa-envelope");
  icon.classList.remove("fa-lock");
  icon.classList.remove("fa-regular");
  icon.classList.add("fa-spinner");
  icon.classList.add("fa-spin");
  icon.classList.add("fas");
})
})

username.addEventListener("change" , () => {
    const value = username.value;
    value.split('');
    const icon = username.nextElementSibling;
    icon.classList.remove("fa-spinner");
    icon.classList.remove("fa-spin");
    if(value.includes("@")){
      icon.classList.add("fa")
      icon.classList.add("fa-check")
    }else{
      icon.classList.add("fa")
      icon.classList.add("fa-times") 
    }
})

function verifyInputs(){
    if(username.value === "" || password.value === ""){
        return false
    }else{
        return true;
    }
}

function validateAdmin(){
    const credentials = new FormData();
    credentials.append("username" , username.value);
    credentials.append("password" , password.value);
    const verify = verifyInputs();
    if(verify){
        const xhr = new XMLHttpRequest();
        xhr.open('POST','adminlogin.php',true);
        button.textContent = "signing in...";
        xhr.onload = () => {
            try{
            if(xhr.status == 200){
                const response = JSON.parse(xhr.responseText);
                if(response.type){
                  loginBox.style.display = "none";
                  otpBox.style.display = "flex";
                  otpBox.style.transform = "translateX(0) scale(1)";
                  otpBox.style.opacity = "1";
                  verifyOtps();

                }else{
                  showErrorMessage("wrong credentials");
                  button.textContent = "login"
                }
            }
            }catch(error){
                console.log("login error",error);
            }
        }
        xhr.send(credentials);
    }
}

function verifyOtps(){
  otpInputs.forEach((input , index) => {
    input.addEventListener("input" , (e) => {
      if(e.target.value.length === 1 && index < (otpInputs.length - 1 )){
        otpInputs[index + 1].focus()
      }
    })
  })

  otpInputs.forEach((input , index) => {
    input.addEventListener("keydown" , (e) => {
      if(e.key === "Backspace" && index > 0 && input.value === "" ){
        otpInputs[index - 1].focus();
      }
    })
  })
}

function verifyOtp(){
  otpInputs.forEach(input => input.classList.remove("errors"));
  let allIsfilled = true;
  otpInputs.forEach(input => {
    if(input.value === ""){
       allIsfilled = false;
       input.classList.add("errors");
    }
  })

  if(allIsfilled){
    return true;
  }else{
    return false;
  }
}

function validateOtp(){
  const userOtp = Array.from(otpInputs).map(input => input.value).join("");
  const data = new FormData();
  data.append("user-otp" , userOtp);
  console.log(userOtp)

  const xhr = new XMLHttpRequest();
  xhr.open('POST','otpverification.php',true);
  verfiyOtpBtn.textContent = "verifying...";

  xhr.onload = () => {
    try{
      if(xhr.status == 200){
        const response = JSON.parse(xhr.responseText);
        if(response.type){
          window.location.href = "timetable.html";
        }
      }
    }catch(error){
      console.log("otp error" , error);
    }
  }
  xhr.send(data);
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

button.addEventListener("click" , validateAdmin);

verfiyOtpBtn.addEventListener("click" , () => {
  const verify = verifyOtp();
  if(verify){
    validateOtp();
  }
})