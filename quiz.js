const topicBox = document.querySelector(".topic-container");
const attemptBox = document.querySelector(".reattempt");
const quizBox = document.querySelector(".main-quiz-container");
const classSelect = document.querySelector("#class");
const subjectSelect = document.querySelector("#subject-one");
const nextBtn = quizBox.querySelector(".next");

const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");
const finishedBox = document.querySelector(".finished-box");
const back = document.querySelector(".button .back");
const reattempt = document.querySelector(".button .restart");
const noresult = document.querySelector(".noresult");

const progressContainer = document.getElementById("container");

let thisTopicTittle;
let allQuestions;
let score = 0;
const date = new Date()
const today =
  date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
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

//ajax functions
//function to get quiz questions

async function getUser() {
  try {
    const response = await fetch("saved_user.php", {
      method: "GET",
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("login error", error);
  }
}

async function getQuestions() {
   const user = await getUser();
   const data = new FormData();
   data.append("class" , "");
   data.append("subject" , "");
   data.append("id" , user.schoolId);

   try{
    const response = await fetch("questions.php" , {
      method : 'POST',
      body : data
    })
    const result = await response.json();
    const schoolQuiz = result.filter(q => q.schoolId === user.schoolId);
    return result;
   }catch(error){
     console.log("questions error" , error);
   }
}

//function to get students
async function getStudents() {
  const user = await getUser();
  showLoader("fetching student details...");
  try {
    const response = await fetch("students.php", {
      method: "POST",
    });
    const result = await response.json();
    const thisSchool = result.filter((s) => s.schoolId === user.schoolId);
    return thisSchool;
  } catch (error) {
    console.log("teachers error", error);
  } finally {
    removeLoader();
  }
}

//function to get topics
async function getTopics(){
  const user = await getUser();
  showLoader("fetching topics, please wait...");
  const data = new FormData();
  data.append("class" , classSelect.value);
  data.append("subject" , subjectSelect.value);
  try {
    const response = await fetch("getTopics.php", {
      method : "POST",
      body : data
    });
    const result = await response.json();
    const thisSchool = result.filter((s) => s.schoolId === user.schoolId);
    return thisSchool;
  } catch (error) {
    console.log("teachers error", error);
  } finally {
    removeLoader();
  }
}

//function to get quiz reaatempts
async function getQuizAttempts(){
  const user = await getUser();
  showLoader("fetching quiz attempts, please wait...");
  const data = new FormData();
  data.append("admission", user.code);
  data.append("id", user.schoolId);
  try {
    const response = await fetch("quizresult.php", {
      method : "POST",
      body : data
    });
    const result = await response.json();
    const thisSchool = result.filter((s) => s.schoolId === user.schoolId);
    return thisSchool;
  } catch (error) {
    console.log("teachers error", error);
  } finally {
    removeLoader();
  }
}

//function to get school setup
async function getSetup() {
  showLoader("fetching school details...");
  try {
    const user = await getUser();
    const response = await fetch("getsetup.php", {
      method: "POST",
    });
    const result = await response.json();
    const thisSchool = result.filter((s) => s.schoolId === user.schoolId);
    return thisSchool;
  } catch (error) {
    console.log("setup error", error);
  } finally {
    removeLoader();
  }
}

async function updateSelects() {
  const setup = await getSetup();
  if (setup.length === 0) return;
  const schoolClases = getClass(setup[0].clases);

  classSelect.innerHTML = "";
  subjectSelect.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "--select class--";
  classSelect.appendChild(defaultOption);

  schoolClases.forEach((clas) => {
    const option = document.createElement("option");
    option.value = clas;
    option.textContent = clas;
    classSelect.appendChild(option);
  });

  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "--select stream--";
  subjectSelect.appendChild(defaultOpt)

  const schoolSubjects = await mySubjects();
  schoolSubjects.forEach((clas , idx) => {
    const option = document.createElement("option");
    option.value = myDefaultSubjects[idx];
    option.textContent = clas;
    subjectSelect.appendChild(option);
  });
}

//error handling
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

//acessory functions
function showLoader(message) {
  progressContainer.classList.remove("removes");
  progressContainer.classList.add("active");
  const messageText = progressContainer.querySelector(".text");
  messageText.textContent = message;
}

function removeLoader() {
  progressContainer.classList.add("removes");
  progressContainer.classList.remove("active");
}

async function mySubjects() {
  const setup = await getSetup();
  if (setup.length === 0) return;
  const schoolSubjects = getSubject(setup[0].subjects);

  return schoolSubjects;
}

function getSubject(rawSubjects) {
  const rawstreamArray = rawSubjects.split("-");
  const streamArray = rawstreamArray.map((s) => {
    const [classes] = s.split("/");
    return classes;
  });
  return streamArray;
}

function getClass(rawClases) {
  const rawclasesArray = rawClases.split("-");
  const classArray = rawclasesArray.map((s) => {
    const [classes] = s.split("/");
    return classes;
  });
  return classArray;
}

function verifySelects(array) {
  let allFilled = true;
  array.forEach((select) => select.classList.remove("errors"));
  array.forEach((select) => {
    if (select.value == -"") {
      select.classList.add("errors");
      allFilled = false;
    }
  });

  if (allFilled) {
    return true;
  } else {
    return false;
  }
}

function handleDuration(duration) {
  let updated;
  switch (duration) {
    case "off":
      updated = 0;
      break;
    case "15min":
      updated = 15;
      break;
    case "30min":
      updated = 30;
      break;
    case "45min":
      updated = 45;
      break;
    case "1hr":
      updated = 60;
      break;
    case "1hr 3omin":
      updated = 90;
      break;
    case "2hrs":
      updated = 120;
      break;
    case "2hrs 3omin":
      updated = 150;
      break;
    case "3hrs":
      updated = 180;
      break;
    default:
      updated = 0;
  }
  return updated;
}

let doneQuizes = [];
function getPercentage(score){
  return ((Number(score) / Number(doneQuestions.length)) * 100).toFixed(1);
}

function normalise(string) {
  return string.toLowerCase().trim().replace(" ", "");
}

updateSelects();

//main function start here

async function mainQuizFunction(){
  const fillled = verifySelects([classSelect,subjectSelect]);

  if(fillled){
     const topics = await getTopics();
     const ul = topicBox.querySelector("ul");
     if(topics.length > 0){ //if topics exist then show them 
        noresult.style.display = "none";
        ul.innerHTML = "";
        ul.style.display = "flex";


        for(const [index , topic] of topics.entries()){
          const li = document.createElement("li");
          li.style.opacity = "0";
          li.style.transform = "scale(.8)";
          li.style.transitionDelay = `${0.2 * index}s`;

          li.innerHTML = `
            <h2 class="topic">topic ${topic.topic_number} : ${topic.topic_tittle}</h2>
            <p>${topic.topic_desc}</p>
            <div class="btn">
              <button type="button" class="attempt">attempt</button>
            </div>
          `;

          ul.appendChild(li);

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              li.style.opacity = "1";
              li.style.transform = "scale(1)";
            })
          })

          const btn = li.querySelector(".attempt");
          btn.addEventListener("click" , async () => {
            const response = await getQuiz(topic.topic_tittle);
            thisTopicTittle = topic.topic_tittle;
            if(!response.type){
              showErrorMessage(response.message);
            }
          })
        }

     }else{
      showErrorMessage("no result was found");
      ul.style.display = "none";
      noresult.style.display = "flex"
       noresult.innerHTML = `
         <img src="./subjects/noresultfour.jpeg" alt="" />
         <h3>oops , seems there are no topics</h3>
       `;
     }
  }else{
    showErrorMessage("please fill in all required fields");
  }
}

async function getQuiz(topic){
  const allQuestions = await getQuestions();
  const sortedQuestions = await sortQuizes(topic,allQuestions);
  const sortedObject = Object.entries(sortedQuestions);
 
  if(sortedObject.length === 0){
    return {
      message : "no quizes",
      type : false
    }
  }

  const remainingQuizzes = sortedObject.filter(
    ([quizCode, questions]) => !doneQuizes.includes(quizCode)
  );

  if(remainingQuizzes.length === 0){
    return {
      message : "quiz exhausted",
      type : false
    }
  }

  const random = Math.floor(Math.random() * remainingQuizzes.length);
  const choice = remainingQuizzes[random];

  doneQuizes.push(choice[0]) //push the quiz code instead

  const data = {
    type: true,
    quizCode: choice[0],
    questions: choice[1],
  }

  displayReattempt(data,topic);

  return {
    type : true
  }
}

function sortQuizes(topic,questions){
  const topicQuizes = questions.filter(ques => {
    return normalise(ques.topic) === normalise(topic)
  });
  const quizObject = {};

   topicQuizes.forEach(quiz => {
    if (!quizObject[quiz.quizCode]) {
      quizObject[quiz.quizCode] = [];
    }
    quizObject[quiz.quizCode].push(quiz);
  });
  return quizObject;
}

//function to display reattempts
async function displayReattempt(data,topic){
  const durationDisplay = attemptBox.querySelector("#duration");
  const topicDisplay = attemptBox.querySelector(".topic-heading");
  const start = attemptBox.querySelector(".start");
  const myAttempData = await getQuizAttempts();
  const questions = data.questions;
  const quizCode = data.quizCode;

  durationDisplay.textContent = "Duration:"+" "+questions[0].duration;
  topicDisplay.textContent = topic;

  if(data.type){
    topicBox.style.transform = "scale(.5)";
    topicBox.style.opacity = "0";
    attemptBox.style.transform = "scale(1)";
    attemptBox.style.opacity = "1";

    setTimeout(async () => {
      attemptBox.style.display = "flex";
      topicBox.style.display = "none";
      if(myAttempData.length > 0) await displayTable(myAttempData); 
    }, 1000);

    start.addEventListener("click" , async () => {
      const totalDuration = handleDuration(questions[0].duration);
      attemptBox.style.transform = "scale(.8)";
      attemptBox.style.opacity = "0"; 

      setTimeout(() => {
        attemptBox.style.display = "none";
        quizBox.style.display = "flex";

        setTimeout(() => {
          quizBox.style.transform = "scale(1)";
          quizBox.style.opacity = "1"; 
        },1000);

        allQuestions = questions;
        displayQuestions(questions);
        updateTimer(totalDuration);
      }, 1000);
    })
  }else{
    showErrorMessage("an internal error occured");

    setTimeout(() => {
      window.location.reload();
    },2000);
  }

}

//function to diaply reaatmpt tanle
function displayTable(data){

}

let updated;
let timeLeft;
function updateTimer(duration){
  updated = duration;
  timeLeft = updated * 60;
  setInterval(() => {
     startTimer();
  }, 1000);
}

//questions functions
let doneQuestions = [];

async function displayQuestions(questions) {
   const nextBtn = quizBox.querySelector("#next");

    const remainingQuestions = questions.filter(q => 
        !doneQuestions.some(doneQ => doneQ.question === q.question)
    );

    if (remainingQuestions.length === 0) {
        showSuccessMessage("Quiz done");
        setTimeout(() => {
            showResult();
        }, 2000);
        return;
    }

    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    const currentQuestion = remainingQuestions[randomIndex];

    doneQuestions.push(currentQuestion);

    if (remainingQuestions.length === 1) {
        nextBtn.textContent = "Finish";
    }

    showQuestion(currentQuestion);
}

function showQuestion(questions){
  console.log(questions)
   const question = questions.question;
    const answerArray = questions.answers;
    const solution = questions.solution;
    const shuffledAnswers = answerArray.sort(() => Math.random() - 0.5);

    const questionDisplay = quizBox.querySelector(".question h3");
    const answerDisplay = quizBox.querySelector(".answers");
    const solutionDis = quizBox.querySelector(".solution p");
    const nextBtn = quizBox.querySelector(".next");
    const correct = questions.correct;

    nextBtn.style.display = "none";

    questionDisplay.textContent = question;
    answerDisplay.innerHTML = "";
    solutionDis.textContent = solution;
    solutionDis.parentElement.style.display = "none";

    shuffledAnswers.forEach((answer , idx) => {
      const button = document.createElement("button");
      button.textContent = answer;
      button.className = "btn";

      button.style.opacity = "0";
      button.style.transform = "scale(.8)";
      button.style.transitionDelay = `${0.2 * idx}s`; 

      answerDisplay.appendChild(button);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          button.style.opacity = "1";
          button.style.transform = "scale(1)";
        })
      })

      button.addEventListener("click" , () => {
        const btns = Array.from(answerDisplay.querySelectorAll(".btn"));
        btns.map(btn => btn.disabled = true);
        nextBtn.style.display = "flex";
        if(normalise(button.textContent) === normalise(correct)){
           button.className = "correct";
           score++
        }else{
           const correctBtn = btns.filter(btn => normalise(btn.textContent) === normalise(correct));
           correctBtn[0].className = "correct";
           button.className = "wrong";
           solutionDis.parentElement.style.display = "flex";
        }
      })

    })

    nextBtn.addEventListener("click" , async () => {
       displayQuestions(allQuestions)
    })
}

function startTimer() {
  const timeDisplay = document.getElementById("timeDisplay");
  const progressCircle = document.querySelector(".progress");

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  progressCircle.style.strokeDasharray = `${circumference}`;

  if (timeLeft <= 0) return;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  const offset = circumference * (1 - timeLeft / (updated * 60));
  progressCircle.style.strokeDashoffset = `${offset}`;

  if (timeLeft > 0) {
    timeLeft--;
  } else {
    clearInterval(clearTimer);
  }
}

async function showResult(){
  quizBox.style.opacity = "0";
  quizBox.style.transform = "scale(.8)";

  setTimeout(() => {
   finishedBox.style.display = "flex";
   quizBox.style.display = "none";
  },1000);

  const text = finishedBox.querySelector(".text");
  text.innerHTML = `
      <h2>you scored</h2>
      <h3>${score}/${doneQuestions.length}</h3>
      <h1>${getPercentage(score)}%</h1>
      <h4>quiz result was submitted succesfully</h4>
  `;

  const status = await postQuizResult();
  if(status.type){
    showSuccessMessage("quiz result were submitted succesfully");
    doneQuestions = [];
  }
}

async function postQuizResult(){
  showLoader("posting results, please wait");
  const myAttempData = await getQuizAttempts();
  const user = await getUser()
  const myAttempts = myAttempData .filter(
        (att) => normalise(att.topic) === normalise(thisTopicTittle)
   );
  let attempt = 0;
  if (myAttempts.length === 0) {
    attempt = 1;
   } else {
    attempt = myAttempts.length + 1;
  } 
  const data = new FormData();
  data.append("code", doneQuestions[0].quizCode);
  data.append("score", getPercentage(score));
  data.append("date", today);
  data.append("admission", user.code);
  data.append("topic", thisTopicTittle);
  data.append("attempt", attempt);
  data.append("id", user.schoolId);
 
  try{
    const response = await fetch("postquizresult.php" , {
      method : 'POST',
      body : data
    })
    const result = await response.json();
    return result;
  }catch(error){
    console.log("posting error" , error);
  }finally {
    removeLoader();
  }
}

classSelect.addEventListener("change" , mainQuizFunction)
subjectSelect.addEventListener("change" , mainQuizFunction)

const restartPage = finishedBox.querySelector(".restart");
const reattemptQuiz = finishedBox.querySelector(".reattempting");
restartPage.addEventListener("click" , () => {
  window.location.reload();
});

reattemptQuiz.addEventListener("click" , async () => {
   doneQuestions = [];
   const response = await getQuiz(thisTopicTittle);
   finishedBox.style.display = "none";
   console.log(response)
   if(!response.type){
      showErrorMessage(response.message);
      doneQuizes = [];
      setTimeout(() => {
        window.location.reload();
      }, 3000);
   }
})

