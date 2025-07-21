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

const subjectDivs = verifyBox.querySelectorAll(".subject");
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

//function to add background color to all subject divs
subjectDivs.forEach((subjectDiv, idx) => {
  subjectDiv.style.backgroundColor = `${colors[idx]}`;
  subjectDiv.style.transitionDelay = `${delay * idx}` + "s";
});

//this adds opacity one and a scle of i to ever box when the page reloads
window.addEventListener("load", function () {
  Array.from(subjectDivs).forEach((element) => {
    element.style.opacity = "1";
    element.style.transform = "scale(1)";
  });
});

//this get subject and checks if user selected class
subjectDivs.forEach((subjectDiv) => {
  subjectDiv.addEventListener("click", function () {
    hiddenBtn.style.display = "none";
    if (verirfySelectField.value.trim() === "") {
      showErrorMessage("please select class to continue");
    } else {
      subject = this.textContent;
      clas = verirfySelectField.value;
      submitClass.value = verirfySelectField.value;
      submitSubject.value = this.textContent;
      verifyTeacher();
    }
  });
});

//function verify teacher
function verifyTeacher() {
  const xhr = new XMLHttpRequest();
  const param = "tcode=" + teacherCode + "&subject=" + subject;
  xhr.open("POST", "validate2.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = () => {
    if (xhr.status == 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.type == true && response.message === "validated") {
        hiddenBtn.style.display = "flex";
        showSuccessMessage("access granted");
      } else {
        showErrorMessage("access denied");
      }
    }
  };
  xhr.send(param);
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
  const formData = new FormData(mainForm);
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
        const description = `${divCount} topics have just been added </br>you can now succesfully add:notes,quizes e.t.c`;
        const type = `educative-topic-all`;
        postFeedback(message,destination,from,description,type);
      } else {
        showErrorMessage("error in uploading topics");
      }
    }
  };
  xhr.send(formData);
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