const labelInput = document.querySelector(".text label");
const inputFile = document.querySelector(".text input");
const removeFileBtn = document.querySelector(".text button");
const profileImage = document.querySelector(
  ".profile-image-container .image img"
);
const messageBox = document.querySelector(".message");
const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");
const form = document.querySelector(".main")

const admissionInput = document.getElementById("admission-number");
const submitForm = document.querySelector(".submit-button-box .submit");
const classSelect = document.getElementById("class");
const streamSelect = document.getElementById("stream");

function getUser(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "saved_user.php", true);
  xhr.onload = () => {
    if (xhr.status == 200) {
      const response = JSON.parse(xhr.responseText);
      callback(response);
    }
  };
  xhr.send();
}

function getStudents(callback){
  getUser((user) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST" , 'students.php', true);
    xhr.onload = () => {
        try{
          if(xhr.status == 200){
            const response = JSON.parse(xhr.responseText);
            const thisSchool = response.filter(s => s.schoolId === user.schoolId);
            callback(thisSchool);
          }
        }catch(error){
          console.log("Student Error:" , error);
        }
    }
    xhr.send();
  })
}

function getTheGreatestAdmission(){
    getStudents((students) => {
        const greatestAdmission = students.reduce((current,value) => (current.admission > value.admission ? current : value));
        let newAdmission = Number(greatestAdmission.admission);
        admissionInput.value = ++newAdmission;  
    })
}

function verifyInputs(){
    const requiredInputs = document.querySelectorAll(".required");
    requiredInputs.forEach(input => input.classList.remove("errors"));
    let allIsFilled = true;
    requiredInputs.forEach(input => {
        if(input.value === ""){
           allIsFilled = false;
           input.classList.add("errors");
        }
    })

    if(allIsFilled){
        return true;
    }else{
        return false;
    }
}

function profileImageUpload(){
    const uploadedFile = inputFile.files[0];
    if(this.files.length > 0){
        if(uploadedFile.type.startsWith("image/")){
            profileImage.classList.add("uploaded");
            const fileReader = new FileReader();
            fileReader.onload = function (event) {
                profileImage.setAttribute("src", event.target.result);
              };
            fileReader.readAsDataURL(uploadedFile);   
            showSuccessMessage("✅ Profile photo uploaded successfully!");
        }else{
            inputFile.value = "";
            showErrorMessage("🚫 Please select a valid image file ")
        }
    }else{
        inputFile.value = "";
        showErrorMessage("oops, an error occured");
    }
}

function postEnrollFOrm(){
  getUser((user) => {
      const verified = verifyInputs();
     if(verified){
        const formData = new FormData(form);
        formData.append("id" , user.schoolId);
        const xhr = new XMLHttpRequest();
        xhr.open('POST','enrol.php',true);
        xhr.onload = () => {
          try{
             if(xhr.status === 200){
              const response = JSON.parse(xhr.responseText);
              if(response.type === true){
                if(response.message === "success"){
                    showSuccessMessage("student details added succesfully");
                    window.location.href = `parent.html?admission=${admissionInput.value}&class=${classSelect.value}&stream=${streamSelect.value}`;
                }
              }else{
                  console.log(response.errorInfo);
                  showErrorMessage(response.message);
              }
             }
          }catch(error){
              console.log("Posting Error", error);
          }
        }
        xhr.send(formData);
     } else{
       showErrorMessage("⚠️ Please fill in all required fields.")
     } 
  })  
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
getTheGreatestAdmission()
//event listeners

inputFile.addEventListener("change" , profileImageUpload);
submitForm.addEventListener("click" , postEnrollFOrm);
