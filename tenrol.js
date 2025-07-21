const labelInput = document.querySelector(".text label");
const inputFile = document.querySelector(".text input");
const removeFileBtn = document.querySelector(".text button");
const profileImage = document.querySelector(
  ".profile-image-container .image img"
);
const messageBox = document.querySelector(".message");
const form = document.querySelector(".form");
const submitBtn = form.querySelector(".submit");
const subjectOne = form.querySelector("#subject-one")
const subjectTwo = form.querySelector("#subject-two");

const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");


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

//file handling functions
function fileHandler(){
  if(this.files.length > 0){
    const file = this.files[0];
    if(file.type.startsWith("image/")){
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        profileImage.setAttribute('src' , event.target.result);
      }
      fileReader.readAsDefault(file);
      showSuccessMessage("✅ Profile photo uploaded successfully!");
    }else{
      showErrorMessage("🚫 Please select a valid image file ");
      removeFile();
    }
  }else{
    removeFile();
    return;
  }
}

function removeFile() {
  inputFile.value = "";
  profileImage.setAttribute("src", "./teachers/profileimage.png");
  profileImage.classList.remove("uploaded");
  showErrorMessage("image removed succesfully");
}

//function to post quiz form
function postSubmitForm(){
  const formData = new FormData(form);
  const xhr = new XMLHttpRequest();
  let department = assignDepartment(subjectOne.value,subjectTwo.value);
  formData.append("rank" , "normal");
  formData.append("department" , department);
  formData.append("teacher-code" , assingTeacherCode(department));
  formData.append("rank" , "normal");
  formData.append("stream" , "");
  formData.append("class" , "");
  xhr.open('POST','tenrol.php',true);
  xhr.onload = () => {
    try{
      if(xhr.status == 200){
        const response = JSON.parse(xhr.responseText);
        if(response.type === true){
          showSuccessMessage("teacher details added succesfully");
        }else{
          showErrorMessage("contact support");
          console.log(response.errorInfo); 
        }
      }
    }catch(error){
      console.log("Post error" , error);
    }finally{
      console.log(xhr.responseText)
    }
  }
  xhr.send(formData);
}

//function to verify inputs
function verifyInputs(){
  const allinputs = document.querySelectorAll(".required");
  allinputs.forEach(input => input.classList.remove("errors"));
  let allisFiled = true;
  allinputs.forEach(input => {
    if(input.value === ""){
      input.classList.add("errors");
      allisFiled = false;
    }
  })

  if(allisFiled){
    return true;
  }else{
    return false;
  }
}

//event listeners
submitBtn.addEventListener("click" , function() {
   const verify = verifyInputs();
   postSubmitForm()
})
inputFile.addEventListener("change", fileHandler);
removeFileBtn.addEventListener("click", removeFile);

//function to get department and teacher code

function assignDepartment(one, two) {
  let department = "";

  const scienceSubjects = ["biology", "chemistry", "physics"];
  const humanitySubjects = ["geography", "history", "cre"];
  const technicalSubjects = ["business", "agriculture", "french", "computer"];
  
  if (one === "english" || two === "english") {
    department = "english";
  } else if (scienceSubjects.includes(one) || scienceSubjects.includes(two)) {
    department = "science";
  } else if (one === "mathematics" || two === "mathematics") {
    department = "mathematics";
  } else if (humanitySubjects.includes(one) || humanitySubjects.includes(two)) {
    department = "humanity";
  } else if (technicalSubjects.includes(one) || technicalSubjects.includes(two)) {
    department = "techinals";
  }
  
  return department;
}

function generateSixDigit() {
  return Math.floor(1000 + Math.random() * 9000);
}

function assingTeacherCode(department) {
  let credentials = "";

  switch (department) {
    case "english":
      credentials = "EL";
      break;
    case "mathematics":
      credentials = "MD";
      break;
    case "science":
      credentials = "SD";
      break;
    case "humanities":
      credentials = "HM";
      break;
    case "technicals":
      credentials = "TC";
      break;
    default:
      credentials = "HM";
  }

  const six = generateSixDigit();

  const teacherCode = "T" + "/" + `${credentials}` + "/" + `${six}`;

  return teacherCode;
}


