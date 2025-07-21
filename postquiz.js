const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");
const subjectBox = document.querySelector(".verify");
const questionBox = document.querySelector(".quiz");
const verifyBox = document.querySelector(".submit-form");
const submitBox = document.querySelector(".last-step");

const classSelect = document.querySelector("#class");
const streamSelect = document.querySelector("#stream");
const subjectSelect = document.getElementById("subject");
let subject;
let quizCode;

let currentQuestionInpt;
let allQuestions = [];

const children = subjectBox.querySelectorAll(".body .subject");
const delay = 0.2;

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

//add colors to subject containers
for (let s = 0; s < children.length; s++) {
  children[s].style.background = colors[s];
  children[s].style.transitionDelay = `${delay * s}` + "s";
}

window.addEventListener("load", function () {
  Array.from(children).forEach((element) => {
    element.style.opacity = "1";
    element.style.transform = "scale(1)";
  });
});

//function to check if all class and stream values are filled
function getClassStream(subject) {
  const classStream = document.querySelectorAll(".verify .requiredz");
  let allFilled = true;
  classStream.forEach((streamz) => streamz.classList.remove("errors"));
  classStream.forEach((item) => {
    if (item.value.trim() === "") {
      allFilled = false;
      item.classList.add("errors");
    } else {
      allFilled = true;
    }
  });

  if (allFilled) {
    verifyUser(subject);
  } else {
    showErrorMessage("please select class & stream");
  }
}

//function getUser
function getUser(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "saved_user.php", true);
  xhr.onload = () => {
    if (xhr.status == 200) {
      const tcode = JSON.parse(xhr.responseText);
      callback(tcode.code);
    }
  };
  xhr.send();
}

//function to verify user
function verifyUser(subject) {
  getUser((code) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("tcode", code.code);
    formData.append("class", classSelect.value);
    formData.append("stream", streamSelect.value);
    xhr.open("POST", "validate.php", true);
    xhr.onload = () => {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        if (response.type === true && response.message === "validated") {
          const topicBox = subjectBox.querySelector(".topics");
          topicBox.style.display = "flex";
          const topicSelect = topicBox.querySelector("select");
          topicSelect.innerHTML = "";
          getTopics(topicSelect);
        } else {
          showErrorMessage("access denied");
        }
      }
    };
    xhr.send(formData);
  });
}

//if user is verified
function getTopics(select) {
  const param =
    "class=" + classSelect.value + "&subject=" + subjectSelect.value;
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "getTopics.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.length > 0) {
        const lastTopic = submitBox.querySelector("#last-topics");
        lastTopic.innerHTML = "";
        select.innerHTML = "";
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select Topic";
        select.appendChild(defaultOption);
        lastTopic.appendChild(defaultOption.cloneNode(true));

        response.forEach((topic) => {
          const option = document.createElement("option");
          option.value = topic.topic_tittle;
          option.textContent = topic.topic_tittle;
          select.appendChild(option);
          lastTopic.appendChild(option.cloneNode(true));
        });
      } else {
        showErrorMessage("there are no allocated topics");
      }
    }
  };
  xhr.send(param);
}

//function to get teachers
function getTeachers(callback){
  const xhr = new XMLHttpRequest();
  xhr.open('POST' , 'teachers.php' , true);
  xhr.onload = () => {
    try{
      if(xhr.status === 200){
        const response = JSON.parse(xhr.responseText);
        callback(response)
      }
    }catch(error){
      console.log("teacher error" , error)
    }
  } 
  xhr.send();
}

//function show verify form
function showSubjectForm() {
  verifyBox.style.display = "none";
  submitBox.style.display = "none";
  questionBox.style.display = "none";
  subjectBox.style.display = "flex";
}

//show question container
function showQuestionForm() {
  subjectBox.style.display = "none";
  verifyBox.style.display = "none";
  submitBox.style.display = "none";
  questionBox.style.display = "flex";
}

//show verify container
function showVerifyForm() {
  subjectBox.style.display = "none";
  questionBox.style.display = "none";
  submitBox.style.display = "none";
  verifyBox.style.display = "flex";
}

//function show submit container
function showSubmitForm() {
  subjectBox.style.display = "none";
  questionBox.style.display = "none";
  verifyBox.style.display = "none";
  submitBox.style.display = "flex";
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
showSubjectForm();

//event listeners
//this gets the subject value from the clicking
Array.from(children).forEach((child) => {
  child.addEventListener("click", function () {
    subjectSelect.value = this.textContent.trim();
    getClassStream(this.textContent.trim());
    //this enesures even if user is verified user cannot access any other subject
    const topicBox = subjectBox.querySelector(".topics");
    const buttonBox = subjectBox.querySelector(".button");
    buttonBox.style.display = "none";
    topicBox.style.display = "none";
  });
});

//event listener for topic select on subject box container
const topicSelect = subjectBox.querySelector(".topics select");
topicSelect.addEventListener("change", () => {
  const startBox = subjectBox.querySelector(".button");
  startBox.style.display = "flex";
  const lastTopic = submitBox.querySelector("#last-topics");
  lastTopic.value = topicSelect.value;
});

// evemt istener to start posting questions
const startButton = subjectBox.querySelector(".button button");
startButton.addEventListener("click", () => {
  showQuestionForm();
  startQuestionCreation();
});

/* this marks the end of user validation all that it entails
   the following section marks the start of the question creation fnction
*/

//function creation section
let divCount = 0;
let currentDivIndex = -1;
const prevBtn = questionBox.querySelector("#prev");
const nextBtn = questionBox.querySelector("#next");
const submitBtn = questionBox.querySelector(".submit");

function startQuestionCreation() {
  divCount++;
  currentDivIndex = divCount - 1;
  const body = questionBox.querySelector(".body");
  const questionBoxes = body.querySelectorAll(".post-quiz-section");
  //hide all existing divs
  questionBoxes.forEach((box) => {
    box.style.display = "none";
  });

  //create a new question box division
  const division = document.createElement("div");
  division.className = "post-quiz-section";
  division.style.display = "flex";
  questionBox.style.minWidth = "100%";
  division.style.background = "#fff";
  division.innerHTML = `
       <h1 class="heading">post question</h1>
      
       <div class="question">
         <h3>question ${divCount}</h3>
         <input class="required main-question" type="text" name="questions[]" id="question" placeholder="enter a question...">
       </div>
      
       <div class="answers">
          <ul>
             <li>
                <span>a.</span>
                <input class="required " type="text" name="answerOne[]" placeholder="enter option a">
                <input class="code" type="hidden" name="quiz-code[]" placeholder="enter option a">
             </li>
             <li>
                <span>b.</span>
                <input class="required " type="text" name="answerTwo[]" placeholder="enter option b">
             </li>
             <li>
                <span>c.</span>
                <input class="required " type="text" name="answerThree[]" placeholder="enter option c">
             </li>
             <li>
                <span>d.</span>
                <input class="required correct-answer" type="text" name="answerFour[]" placeholder="enter option d / correct answer">
             </li>
          </ul>
      </div>
      <div class="solution">
        <h3>solution</h3>
        <textarea class="required" name="solutions[]" id="solution" placeholder="provide an explanation for your answer..."></textarea>
      </div>
    `;
  body.appendChild(division); //this apends the div to the question box
  allQuestions.push(division);

  //this function verifies the question container inputs
  const currentQuestion =
    body.querySelectorAll(".post-quiz-section")[currentDivIndex];
  const currentQuestionInputs = currentQuestion.querySelectorAll(".required");
  currentQuestionInpt = currentQuestionInputs;
}

// function to verify currentDiv inputs

function verifyCurrentDivInputs() {
  let allIsFilled = true;
  currentQuestionInpt.forEach((input) => input.classList.remove("errors"));
  currentQuestionInpt.forEach((input) => {
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

//show next question
function showNext() {
  const verify = verifyCurrentDivInputs();
  console.log(verify);
  if (verify) {
    showNextQuestion(currentDivIndex + 1);
  } else {
    showErrorMessage("please input all fields");
  }
}

//function to show next question
function showNextQuestion(index) {
  const body = questionBox.querySelector(".body");
  const questionDivs = body.querySelectorAll(".post-quiz-section");
  if (index < 0) return;
  if (index === questionDivs.length) {
    startQuestionCreation();
  } else if (index < questionDivs.length) {
    questionDivs.forEach((div, i) => {
      div.style.display = i === index ? "flex" : "none";
    });
  }
  currentDivIndex = index;
}

//function show revious question
function showPrev() {
  const verify = verifyCurrentDivInputs();
  if (verify) {
    showPreviousQuestion(currentDivIndex - 1);
  } else {
    showErrorMessage("please input all fields");
  }
}

//function to actually show the previous question
function showPreviousQuestion(index) {
  const questionDivs = questionBox.querySelectorAll(".post-quiz-section");
  if (index < 0 || index >= questionDivs.length) return;

  questionDivs.forEach((div, i) => {
    div.style.display = i === index ? "flex" : "none";
  });
  currentDivIndex = index;
}

//question creation event listeners
nextBtn.addEventListener("click", showNext);
prevBtn.addEventListener("click", showPrev);
submitBtn.addEventListener("click", () => {
  const verify = verifyCurrentDivInputs();
  if (verify) {
    showVerifyForm();
    createVerirfyForm();
  } else {
    showErrorMessage("please input all fields");
  }
});

/*thi above section handeled the question box functionalities 
  the following function involves verifying question
*/
const submitTwo = verifyBox.querySelector(".submiting");
const backTwo = verifyBox.querySelector(".backing");

function createVerirfyForm() {
  const header = verifyBox.firstElementChild;
  const body = verifyBox.querySelector(".body ul");
  header.innerHTML = "";
  body.innerHTML = "";

  header.innerHTML = `
    <h2 class="heading">${subjectBox.querySelector("#topics").value}</h2>
      <h3 class="tally">${divCount} questions</h3>
      <h3 class="message">quiz setting is done</h3>
  `;

  allQuestions.forEach((question, q) => {
    const li = document.createElement("li");
    li.innerHTML = `
       <input type="hidden" id="submit-number" value="${q}">
       <span class="question">${
         question.querySelector(".main-question").value
       }</span>
       <span class="answer">${
         question.querySelector(".correct-answer").value
       }</span>  
        `;
    body.appendChild(li);
  });

  const lis = body.querySelectorAll("li");
  lis.forEach((li) => {
    li.addEventListener("click", function () {
      const index = this.querySelector("#submit-number").value;
      const interger = parseInt(index, 10);
      redirectToQuestion(interger);
    });
  });
}

//function to redirect to the question division
function redirectToQuestion(index) {
  showQuestionForm();
  const questionDivs = questionBox.querySelectorAll(".post-quiz-section");
  if (index < 0 || index >= questionDivs.length) return;

  questionDivs.forEach((div, i) => {
    div.style.display = i === index ? "flex" : "none";
  });
  currentDivIndex = index;
}

function generateQuizCode() {
  const random = Math.floor(Math.random() * 1000000);
  const param = "class=" + "" + "&subject=" + "";
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "questions.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      const found = response.find((q) => q.teacherCode === random);
      if (found) {
        generateQuizCode();
      } else {
        document.getElementById("quiz-code").textContent = random;
        const allInputs = questionBox.querySelectorAll(
          ".post-quiz-section .code"
        );
        allInputs.forEach((input) => {
          input.value = random;
        });

        showSubmitForm();
        const questionCount = submitBox.querySelector(".alah");
        questionCount.textContent = `${divCount} questions`;
        quizCode = random;
      }
    } else {
      console.log(xhr.status);
    }
  };
  xhr.send(param);
}

//event listeners
submitTwo.addEventListener("click", generateQuizCode);
backTwo.addEventListener("click", function () {
  showQuestionForm();
  redirectToQuestion(divCount - 1);
});

/*last step functions*/
const submitThree = submitBox.querySelector(".submit");
function lastStep() {
  const checkBox = submitBox.querySelector("input");
  if (checkBox.checked) {
    postQuiz();
  } else {
    showErrorMessage("please confirm question number");
  }
}

function postQuiz() {
  const quiz = new FormData(questionBox);
  const lastTopic = submitBox.querySelector("#last-topics");
  const duration = submitBox.querySelector("#duration");
  getUser((user) => {
    getTeachers((teachers) => {
      quiz.append("class", classSelect.value);
      quiz.append("stream", streamSelect.value);
      quiz.append("topics", lastTopic.value);
      quiz.append("subject", subjectSelect.value);
      quiz.append("duration", duration.value);
      quiz.append("tcode", user.code);
      quiz.append("type", "quiz");
      const xhr = new XMLHttpRequest();
      xhr.open("POSt", "postquiz.php", true);
      xhr.onload = () => {
        if (xhr.status == 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.type == true) {
              const teacher = teachers.find(t => t.teacherCode === user.code);
              console.log(teacher)
               const message = `${getGender(teacher.gender)} ${teacher.middlename} has just posted a quiz`;
               const destination = `student-${classSelect.value}`;
               const description = `${getGender(teacher.gender)} ${teacher.middlename} has just posted ${divCount} questions on ${lastTopic.value} topic`;
               const type = `educative-quiz-${quizCode}`
               const from = code;
               postFeedback(message,destination,from,description,type);
              if(response.message === "update success"){
                  showSuccessMessage("questions was updated succesfully")
              }else if(response.message === "insertion success"){
                  showSuccessMessage("questions added succesfully")
              }
          } else if (response.type == false) {
            showErrorMessage(response.message);
          }
        }
      };
      xhr.send(quiz);
    })
  })
}

//this sends a notification to all the class students
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

function getGender(gender){
  switch(gender){
    case "male":
      return "Mr";
    break;
    case "female":
      return "Mrs";
    break;   
    default : 
    return "Mr"; 
  }
}

submitThree.addEventListener("click", lastStep);

