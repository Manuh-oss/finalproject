const subjectSelect = document.getElementById("subject");
const classSelect = document.getElementById("class");
const uploadLabel = document.getElementById("upload-label");
const input = document.getElementById("input");
const submitBtn = document.querySelector(".submit");
const uploading = document.querySelector(".uploading");
const text = document.querySelector(".upload-box .text");

const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");

function recieveAssignment() {
  const file = input.files[0];
  if (!file) return;

  const verify = verifyInputs();
  if (verify) {
    getUser((user) => {

      const fileUpload = new FormData();
      fileUpload.append("file", file);
      fileUpload.append("class", classSelect.value);
      fileUpload.append("subject", subjectSelect.value);
      fileUpload.append("code", user.code);
      fileUpload.append("type", getType(file.type));
      if(getType(file.type)=== false){
        showErrorMessage("file type is not supported");
        return
      }
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          text.style.display = "none";
          uploading.style.display = "flex";
          uploading.querySelector(".file-name").textContent = file.name;
          uploading.querySelector(".juice").style.width = percent + "%";
          uploading.querySelector(".progress h5").textContent = percent + "%";
        }
      };
      xhr.open("POST", "postassign.php", true);
      xhr.onload = () => {
        try {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.type === true) {
                  if(response.message === "update success") console.log("the file name was noted hence an update of that filename was taken")
                  input.value = "";
                  showSuccessMessage(response.message);
                  uploading.style.display = "none";
                  text.style.display = "flex";
                  displayNotification(file.name);
                  displayAssignments();
                }
              }
        }catch (error){
            console.log("An error of->" , error);
        }
      };
      xhr.send(fileUpload);
    });
  } else {
    console.log("not filled");
    input.value = "";
    showErrorMessage("please select class and subject")
  }
}

function getTeachers(callback){
  const xhr = new XMLHttpRequest();
  xhr.open('POST','teachers.php',true);
  xhr.onload = () => {
    try{
      if(xhr.status === 200){
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    }catch(error){
      console.log("teacher error",error);
    }
  }
  xhr.send();
}

function displayNotification(name){
  getUser((user) => {
    getTeachers((teachers) => {
      const me = teachers.find(t => t.teacherCode === user.code);
      const message = `${getGender(me)} ${me.firstname} has just uploaded a ${subjectSelect.value} assignment`;
      const destination = `student-${classSelect.value}`;
      const from = user.code;
      const description = `
        📘 New assignment "<strong>${name}</strong>" has been posted in <strong>${subjectSelect.value} / form${classSelect.value}</strong>. Check it out!
      `;
      const type = `educative-assignment-${classSelect.value}`;
      postFeedback(message,destination,from,description,type);
    })
  })
}

//function to get gender
function getGender(data){
  switch(data.gender){
    case "male":
      return "Mr";
    break;
    case "female":
      return "Mrs";
    break;
    default:
      return "Mr / Mrs"    
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

function verifyInputs() {
  if (classSelect.value === "" || subjectSelect.value === "") {
    return false;
  } else {
    return true;
  }
}

//function to get file type
function getType(file){
    if (file.startsWith("image/")) {
        return "image";
      } else if (
        file === "application/pdf" ||
        file === "application/msword" ||
        file === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        return "document";
      } else {
        return false;
      }
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

//function to get the users subjects he or she teaches
function getSubjects() {
  getUser((user) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "teachers.php", true);
    xhr.onload = () => {
      if (xhr.status == 200) {
        const teachers = JSON.parse(xhr.responseText);
        const match = teachers.find((t) => t.teacherCode === user.code);
        if (match) {
          subjectSelect.innerHTML = `
                     <option value="">--choose subject--</option>
                     <option value="${match.subjectOne}">${match.subjectOne}</option>
                     <option value="${match.subjectTwo}">${match.subjectTwo}</option>
                `;
        }
      }
    };
    xhr.send();
  });
}

//function to get avaiable assignment
function getAssignments(callback){
    getUser((user) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST" , "getassign.php" ,true);
        xhr.onload = ( ) => {
            try{
                if(xhr.status === 200){
                    const response = JSON.parse(xhr.responseText);
                    const match = response.filter(a => a.code === user.code);
                    callback(match); 
                }
            }catch (error){
                console.log("ERROR=>" , error);
            }
        }
        xhr.send();
    })
}

function displayAssignments(){
    getAssignments((assignments) => {
        const assignmentSection = document.querySelector(".myassingments");
        const noresult = assignmentSection.querySelector(".body .noresult");
        const ul = assignmentSection.querySelector(".body ul");
        ul.innerHTML = "";
        if(assignments.length > 0){
          noresult.style.display = "none";
          ul.style.display = "flex";
          assignments.forEach((assignment , idx) => {
                const li = document.createElement("li");
                if(assignment.type === "document"){ //if the file is a document
                    li.innerHTML = `
                    <a href="${assignment.path}" target="_blank">
                        <h3>${assignment.fileName}</h3>
                        <h4>${assignment.subject}</h4>
                    </a>    
                   `;
                }else if(assignment.type === "image"){
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
        }else{
            noresult.style.display = "flex";
            ul.style.display = "none";
        }
    })
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
getSubjects();
displayAssignments();
//event listeners
input.addEventListener("change", recieveAssignment);
