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
const form = document.querySelector(".main");

const admissionInput = document.getElementById("admission-number");
const submitForm = document.querySelector(".submit-button-box .submit");
const classSelect = document.getElementById("class");
const streamSelect = document.getElementById("stream");
let admission = 0;

function getAdmissionNumber(){
    const urlData = new URLSearchParams(window.location.href);
    const admissionNumber = urlData.get("admission");
    admission = admissionNumber;
    loadSchoolData((schoolData) => {
      const schoolClasses = schoolData.classes;
      const schoolStreams = schoolData.streams;

      classSelect.innerHTML = "";
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "--select class--";
      classSelect.appendChild(defaultOption);

      schoolClasses.forEach(clas => {
        const option = document.createElement("option");
        option.value = clas;
        option.textContent = clas;
        classSelect.appendChild(option);
      })

      classSelect.value = urlData.get("class");

       function showStreams(value){
         const classStreams = schoolData.streams[value];
         streamSelect.innerHTML = "";
         defaultOption.value = "";
         defaultOption.textContent = "--select stream--";
         streamSelect.appendChild(defaultOption);
         classStreams.forEach(clas => {
         const option = document.createElement("option");
              option.value = clas;
              option.textContent = clas;
              streamSelect.appendChild(option)
         })
       }
  
          showStreams(urlData.get("class"))
          streamSelect.value = urlData.get("stream");

    })
}

function verifyInputs() {
  const requiredInputs = document.querySelectorAll(".required");
  requiredInputs.forEach((input) => input.classList.remove("errors"));
  let allIsFilled = true;
  requiredInputs.forEach((input) => {
    if (input.value === "") {
      allIsFilled = false;  
    }
  });

  if (allIsFilled) {
    return true;
  } else {
    return false;
  }
}

function profileImageUpload() {
  const uploadedFile = inputFile.files[0];
  if (this.files.length > 0) {
    if (uploadedFile.type.startsWith("image/")) {
      profileImage.classList.add("uploaded");
      const fileReader = new FileReader();
      fileReader.onload = function (event) {
        profileImage.setAttribute("src", event.target.result);
      };
      fileReader.readAsDataURL(uploadedFile);
      showSuccessMessage("profile image uploaded");
    } else {
      inputFile.value = "";
      showErrorMessage("please upload an image file");
    }
  } else {
    inputFile.value = "";
    showErrorMessage("oops, an error occured");
  }
}

function getUser(callback){
  const xhr = new XMLHttpRequest();
  xhr.open('GET' , 'saved_user.php' , true);
  xhr.onload = () => {
    try{
     if(xhr.status == 200){
      const response = JSON.parse(xhr.responseText);
      callback(response);
     }
    }catch(error){
      console.log("Login error" , error);
    }
  }
  xhr.send();
}

function postEnrollFOrm(){
  getUser((user) => {
    const verified = verifyInputs();
     if(verified){
      const urlData = new URLSearchParams(window.location.search);
      const admissionNumber = urlData.get("admission");
        const formData = new FormData(form);
        const xhr = new XMLHttpRequest();
        xhr.open('POST','parent.php',true);
        formData.append("admission" , admissionNumber);
        formData.append("id" , user.schoolId);
        console.log(admissionNumber)
        xhr.onload = () => {
          try{
             if(xhr.status === 200){
              const response = JSON.parse(xhr.responseText);
              if(response.type === true){
                if(response.message === "success"){
                    showSuccessMessage("student details added succesfully");
                    window.location.href = `enrol.html`;
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

//functioncalls
getAdmissionNumber();

//event listeners
inputFile.addEventListener("change" , profileImageUpload);
submitForm.addEventListener("click" , postEnrollFOrm);