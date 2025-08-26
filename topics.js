const verifyBox = document.querySelector(".verify");
const topicBox = document.querySelector(".centralise");
const submitBox = document.querySelector(".verify-topic");
const verirfySelectField = verifyBox.querySelector("select");
const hiddenBtn = verifyBox.querySelector(".button");
const submitClass = submitBox.querySelector("#classes");
const submitSubject = submitBox.querySelector("#subject-one");
const mainForm = document.querySelector(".main");
const delay = 0.2;

const next = topicBox.querySelector(".next");
const submitBtn = topicBox.querySelector(".submit");
const prev = topicBox.querySelector(".prev");
const submitTwo = submitBox.querySelector(".submit")

let teacherCode;
let subject;
let clas;
let topicCount = 0;
let currentTopicIndex = 0;
let topics = [];
let topicContainer = [];
let currentTopicInpt;

const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");

const subjecBox = verifyBox.querySelector(".body");
const colors = [
  "#AEDFF7", // light sky blue
  "#F4D19B", // light orange
  "#CFF2E1", // pale mint green
  "#B2EBF2", // pale cyan
  "#D1F2A5", // light lime green
  "#B0C4DE", // light steel blue
  "#DDECC9", // pale olive green
  "#E6CFC1", // pale peach
  "#E4DEF3", // pale lavender
  "#F9E7C3", // pale gold
  "#D0E6B3", // soft olive green
  "#F8C8DC", // pale pink
  "#B0C4DE", // light steel blue (duplicate)
  "#C9E6E9", // pastel cyan
  "#F7DBB4", // creamy peach
  "#E0F7D7", // very pale green
  "#D2EBF7", // baby blue
  "#E8F4E2", // soft sage green
  "#F0E5D7", // dusty beige
  "#E2D8F2", // soft lilac
];

const myDefaultSubjects = [
  "english",
  "kiswahili",
  "mathematics",
  "chemistry",
  "biology",
  "physics",
  "geography",
  "history",
  "cre",
  "business",
  "agriculture",
  "computer",
  "french",
  "subject14",
  "subject15",
  "subject16",
];

loadSchoolData((schoolData) => {
  const subjects = schoolData.subjects;

  subjects.forEach((subj , idx) => {
    const div = document.createElement("div");
    div.className = "subject";
    div.textContent = subj;
    div.style.backgroundColor = colors[idx];
    div.style.transitionDelay = `${delay * idx}s`;

    subjecBox.appendChild(div);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        div.style.opacity = "1";
        div.style.transform = "scale(1)"
      })
    })

    div.addEventListener("click" , () => {
      hiddenBtn.style.display = "none";
      if (verirfySelectField.value.trim() === "") {
        showErrorMessage("please select class to continue");
      } else {
        subject = myDefaultSubjects[idx];
        clas = verirfySelectField.value;
        verifyTeacher();
      }
    })

  })

})

function getTeachers(callback){
  const xhr = new XMLHttpRequest();
  xhr.open('POST','teachers.php',true);
  xhr.onload = () => {
    try{
      if(xhr.status === 200){
        const response = JSON.parse(xhr.responseText);
        callback(response)
      } 
    }catch(error){
      console.log(error);
    }
  }
  xhr.send()
}

//function verify teacher
function verifyTeacher() {
  getUser((user) => {
    getTeachers((teachers) => {
      const match = teachers.find(t => t.teacherCode === user.code && t.schoolId === user.schoolId);
      if(match){
        const rank = match.rank.split("-");
        if(rank.length > 0){
           if(subject === rank[1]){
             showSuccessMessage("access granted");
             showTopicContainer();
           }else{
            showErrorMessage("access denied");
           }           
        }else{
          showErrorMessage("user is no H.O.D")
        }       
      }
    })
 })
}

//functioncher code from login.json
function getTeacherCode() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "saved_user.php", true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      teacherCode = response.code;
    }
  };
  xhr.send();
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

function showTopicContainer() {
  topicBox.style.display = "flex";
  submitBox.style.display = "none";
  verifyBox.style.display = "none";
  createTopics();
}

//function to create topic container boxes

function createTopics() {
  topicCount++;
  const allTopicBoxes = topicBox.querySelectorAll(".topic-box");
  const body = topicBox.querySelector(".body");
  //hides all previous divs
  allTopicBoxes.forEach((box) => {
    box.style.display = "none";
  });

  const newTopic = document.createElement("div");
  newTopic.className = "topic-box";
  newTopic.innerHTML = `
    <h2>topics ${topicCount}</h2>
      <span>
        <h3>topic number</h3>
        <input type="text" class="required topic-number" name="topic-number[]" id="">
      </span>
      <span>
        <h3>topic tittle</h3>
        <input type="text" class="required topic-tittle" name="topic-tittle[]" id="">
      </span>
      <span>
        <h3>topic description</h3>
        <textarea name="topic-description[]" class="required topic-dec" id=""></textarea>
      </span>
  `;
  body.appendChild(newTopic);
  currentTopicIndex = topicCount - 1;
  topicContainer.push(newTopic);

  const currentTopic = body.querySelectorAll(".topic-box")[currentTopicIndex];
  const currentTopicInputs = currentTopic.querySelectorAll(".required");
  currentTopicInpt = currentTopicInputs;
}

//this verifies if all inuts on the curent topic are all filled
function verifyCurrentTopic() {
  let allIsFilled = true;
  currentTopicInpt.forEach((input) => input.classList.remove("errors"));
  currentTopicInpt.forEach((input) => {
    if (input.value === "") {
      input.classList.add("errors");
      allIsFilled = false;
    }
  });

  if (allIsFilled) {
    return true;
  } else {
    return false;
  }
}

//this toogels th enext topic
function showNext() {
  const verify = verifyCurrentTopic();
  if (verify) {
    showNextQuestion(currentTopicIndex + 1);
  } else {
    showErrorMessage("please fill up");
  }
}

function showNextQuestion(index) {
  const body = topicBox.querySelector(".body");
  const questionDivs = body.querySelectorAll(".topic-box");
  if (index < 0) return;
  if (index === questionDivs.length) {
    createTopics();
  } else if (index < questionDivs.length) {
    questionDivs.forEach((div, i) => {
      div.style.display = i === index ? "flex" : "none";
    });
  }
  currentTopicIndex = index;
}

//this toggles the previous topic div container
function showPrev() {
  const verify = verifyCurrentTopic();
  if (verify) {
    showPreviousQuestion(currentTopicIndex - 1);
  } else {
    showErrorMessage("please fill up");
  }
}

function showPreviousQuestion(index) {
  const questionDivs = topicBox.querySelectorAll(".topic-box");
  if (index < 0 || index >= questionDivs.length) return;

  questionDivs.forEach((div, i) => {
    div.style.display = i === index ? "flex" : "none";
  });
  currentTopicIndex = index;
}

//this function show the last step of verifing
function showVerirfy() {
  topicBox.style.display = "none";
  submitBox.style.display = "flex";
  verifyBox.style.display = "none";
  createVerifyList();
}

function createVerifyList(){
  const body = submitBox.querySelector(".main-body ul");
  body.innerHTML = "";
  topicContainer.forEach((box , q) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="hidden" id="submit-number" value="${q}">
       <span class="question"><h2>${box.querySelector(".topic-tittle").value
       }</h2></span>
       <span class="answer"><p>${box.querySelector(".topic-dec").value
       }</p></span>  
    `;
    body.appendChild(li)
  })

  const lis = body.querySelectorAll("li");
  lis.forEach(li => {
    li.addEventListener("click" , function  () {
      const index = this.querySelector("#submit-number").value;
      const interger = parseInt(index , 10);
      redirectTopics(interger)
    })
  })
}

//function to redirect to 
function redirectTopics(index){
  topicBox.style.display = "flex";
  submitBox.style.display = "none";
  verifyBox.style.display = "none";
  console.log(index)
  const questionDivs = topicBox.querySelectorAll(".topic-box");
  if (index < 0 || index >= questionDivs.length) return;

  questionDivs.forEach((div, i) => {
    div.style.display = i === index ? "flex" : "none";
  });
  currentTopicIndex = index;
}

//this poats the results to the database
function postTopics() {
  getUser((user) => {
  const formData = new FormData(mainForm);
  formData.append("id" , user.schoolId);
  formData.append("class" , clas);
  formData.append("subject" , subject);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "topics.php", true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.type === true) {
        let alah;
        response.message === "success" ? alah = "added" :alah = "updated"
        showSuccessMessage(`topics are ${alah} succesfully`)
        const message = `${subject} topics have just been ${alah}`;
        const destination = `teachers-all`;
        const from = `H.O.D-${subject}`;
        const description = `${11} topics have just been added </br>you can now succesfully add:notes,quizes e.t.c`;
        const type = `educative-topic-all`;
        postFeedback(message,destination,from,description,type);
      } else {
        showErrorMessage("error in uploading topics");
      }
    }
  };
  xhr.send(formData);
  })
}

function postFeedback(message,destination,from,description,type){
  getUser((user) => {
  const data = new FormData();
  data.append("message" , message);
  data.append("destination" , destination);
  data.append("from" , from);
  data.append("description" , description);
  data.append("type" , type);
  data.append("id" , user.schoolId);
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
  })
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

getTeacherCode();

topicBox.style.display = "none";
submitBox.style.display = "none";

//event listeners

hiddenBtn.querySelector("button").addEventListener("click", showTopicContainer);
submitBox.querySelector(".submit").addEventListener("click", postTopics);
next.addEventListener("click", showNext);
prev.addEventListener("click", showPrev);
submitBtn.addEventListener("click" , () => {
  const verify = verifyCurrentTopic();
  if(verify){
    showVerirfy();
  }else{
    showErrorMessage("please fill up")
  }
})

submitTwo.addEventListener("click" , postTopics)

console.log(submitBox)
console.log(submitBtn)