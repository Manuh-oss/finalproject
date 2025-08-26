const badgeInput = document.querySelector("#input");
const schoolName = document.querySelector(".school-name");
const schoolAdress = document.querySelector(".school-address");
const stream = document.querySelector(".default-streams").children;
const clases = document.querySelector(".clases");
const classValue = document.querySelector(".class");
const system = document.querySelector("#system");
const cateogory = document.querySelector("#category");
const badgeDisplay = document.querySelector(".image img");

const resetButton = document.querySelector(".reset");
const submitButton = document.querySelector(".submit");
const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");

const subjectArray = [
    "english/c",
    "kiswahili/c",
    "mathematics/c",
    "chemistry/s",
    "biology/s",
    "physics/s",
    "geography/h",
    "history/h",
    "cre/h",
    "business/t",
    "agriculture/t",
    "french/t",
    "computer/t",
]


function readFile(input,imageDiv){
    if(input.files.length > 0){
        const file = input.files[0];
        const fileType = file.type;

        if(!fileType.startsWith('image/')){
            showErrorMessage("a non-image file detected");
            input.value = "";
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            const result = e.target.result; 
            imageDiv.setAttribute('src' , result);
        }

        fileReader.readAsDataURL(file);
    }else{
        showErrorMessage("error uploading image");
        input.value = "";
    }
}

function verifyAllInputs(){
   const allInputs = document.querySelectorAll(".required");
   let allFilled = true;

   allInputs.forEach(input => input.classList.remove("errors"));

   allInputs.forEach(input => {
    if(input.value === ""){
        allFilled = false;
        input.classList.add("errors");
    }
   })

   if(allFilled){
    return true;
   }else{
    return false;
   }
}

//event listeeners
badgeInput.addEventListener("change" , () => {
    readFile(badgeInput,badgeDisplay);
})

resetButton.addEventListener("click" , () => {
   const allInputs = document.querySelectorAll("input");
   const allselects = document.querySelectorAll("select");

  allInputs.forEach(input => input.value = "");
  allselects.forEach(input => input.value = "");
  badgeDisplay.setAttribute('src' , "images/images (4).png")
})

function submitChanges(){
  const verified = verifyAllInputs();
  if(verified){
     const clasesValue = Array.from(clases.children)
    .filter(input => input.classList.contains("class"))
    .map(input => input.value+"/"+system.value+"/"+cateogory.value)
    .join("-");
    const streamValue = Array.from(stream)
    .map(input => input.value)
    .join("-");
    const subjects = subjectArray.join("-");
    const contacts = getContactsArray();
    const activities = getActivitiessArray(); 
    const domain = document.querySelector(".domain").value
    const email = document.querySelector(".email").value

    document.querySelector(".submit").disabled = true;

    postSchoolInfo(subjects,clasesValue,streamValue,contacts,activities,domain,email);
  }else{
    showErrorMessage("please input all required fields")
  }
}

function getContactsArray(){
   const weekDays = document.querySelector(".weekdays");
   const weekends = document.querySelector(".weekend");
   const phone = document.querySelector(".phone1");
   const phone2 = document.querySelector(".phone2");

   return [weekDays,weekends,phone,phone2]
   .map(inp => inp.id+"/"+inp.value)
   .join("-");
}

function getActivitiessArray(){
  const activites = document.querySelectorAll(".educational-details span");
  return Array.from(activites).map(span => {
    const icon = span.querySelector(".icon");
    const act = span.querySelector(".activity");

    return icon.value+"/"+act.value;
  }).join("-");
}

function postSchoolInfo(subjects,clases,streams,contacts,activities,domain,email){
    const schoolData = new FormData();
    schoolData.append("name" , schoolName.value);
    schoolData.append("address" , schoolAdress.value);
    schoolData.append("class" , clases)
    schoolData.append("email" , email)
    schoolData.append("domain" , domain)
    schoolData.append("activities" , activities)
    schoolData.append("contacts" , contacts)
    schoolData.append("stream" , streams)
    schoolData.append("subject" , subjects)
    schoolData.append("term" , "term 1-10/10/2020-10/10/2021");
    schoolData.append("badge" , input.files[0]);

    const xhr = new XMLHttpRequest();
    xhr.open('POST','schoolinfo.php' , true);
    xhr.onload = () => {
        try{
            if(xhr.status == 200){
                const response = JSON.parse(xhr.responseText);
                if(response.type){
                    if(response.message === "update success"){
                       showSuccessMessage("update was succesfull");
                       document.querySelector(".submit").disabled = false;
                    }else{
                       const id = response.schoolId
                       const timestamp = new Date().getTime();
                       window.location.href = `tenarol.html?school=${id}&t=${timestamp}&domain=${response.domain}`;
                    }
                }else{
                    showErrorMessage("contact support");
                    console.log(response.errorInfo)
                }
            }
        }catch(error){
            console.log(error);
        }finally{
            console.log(xhr.responseText);
        }
    }
    xhr.send(schoolData)
}

//error handling funtions
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
