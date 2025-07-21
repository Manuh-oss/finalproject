const topicBox = document.querySelector(".topic-container");
const attemptBox = document.querySelector(".reattempt");
const quizBox = document.querySelector(".main-quiz-container");
const classSelect = document.querySelector("#class");
const subjectSelect = document.querySelector("#subject-one");
const nextBtn = quizBox.querySelector(".next");

const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");
const finishedBox = document.querySelector(".finished");
const back = document.querySelector(".button .back");
const reattempt = document.querySelector(".button .restart");

let thisTopicTittle;

const date = new Date();
const today =
  date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

let currentQuestionIndex = 0;
let score = 0;
let doneQuestions = [];
let thisQuestion;
let clearTimer;
let timeLeft;

let updated;

let topicList;
let doneQuizes = [];

//this function gets the user
function getUser(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "saved_user.php", true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      callback(response);
    }
  };
  xhr.send();
}

//function to getQuestions
function getQuizQuestions(callback) {
  const param = new FormData();
  param.append("class", classSelect.value);
  param.append("subject", subjectSelect.value);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "questions.php", true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      callback(response);
    }
  };
  xhr.send(param);
}

//function to organise questions
function organiseQuestions(questions) {
  let organised = [];
  questions.forEach((question) => {
    const code = question.quizCode;
    if (!organised[code]) {
      organised[code] = [];
    }
    organised[code].push(question);
  });
  return Object.entries(organised);
}

//function choose quiz
function chooseQuiz(organised) {
  if (doneQuizes.length >= organised.length) {
    return null; // all quizzes have been done
  }

  let choice;
  do {
    const random = Math.floor(Math.random() * organised.length);
    choice = organised[random];
  } while (doneQuizes.some((quiz) => quiz[0] === choice[0]));

  doneQuizes.push(choice);
  console.log(
    "from choose quiz",
    doneQuizes.some((quiz) => quiz[0] === choice[0])
  );
  console.log("donequizes", doneQuizes);
  console.log("choice", choice);
  return choice[1];
}

function selectCorrectTopic(organised, topic) {
  let topicQuiz = [];
  console.log(typeof topic);
  organised.forEach((quiz, q) => {
    if (quiz[q].topic === topic) {
      console.log(true);
    } else {
      console.log(false);
    }
  });
}

//function to getTopics
function getTopics(callback, clas, subject) {
  const param = new FormData();
  param.append("class", clas);
  param.append("subject", subject);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "getTopics.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Topic error", error);
    }
  };
  xhr.send(param);
}

//function todiplay topics
function displayTopics(clas, subject) {
  getTopics(
    (topics) => {
      const ul = topicBox.querySelector("ul");
      const noresult = topicBox.querySelector(".noresult");
      if (topics.length > 0) {
        if (noresult) noresult.style.display = "none";
        ul.style.display = "flex";
        ul.innerHTML = "";

        const h2 = topicBox.querySelector("h1");
        h2.textContent = subject;

        topics.forEach((topic) => {
          const li = document.createElement("li");
          li.innerHTML = `
              <h2 class="topic">topic ${topic.topic_number} : ${topic.topic_tittle}</h2>
              <p>${topic.topic_desc}</p>
                  <div class="btn">
                      <button type="button" class="attempt">attempt</button>
                  </div>
          `;
          ul.appendChild(li);

          li.addEventListener("click", (e) => {
            e.stopPropagation();
            topicBox.style.display = "none";
            attemptBox.style.display = "flex";
            quizBox.style.display = "none";

            thisTopicTittle = topic.topic_tittle;
            displayReattemp();
          });
        });
      } else {
        if (ul) ul.style.display = "none";
        ul.innerHTML = "";
        noresult.style.display = "flex";
        if (!noresult) {
          const noresultDiv = document.createElement("div");
          noresultDiv.className = "noresult";
          noresultDiv.innerHTML = `
           <img src="./subjects/noresultsix.jpeg" alt="">
           <h3>no results were found</h3>
           `;
          ul.parentElement.appendChild(noresultDiv);
        }
      }
    },
    clas,
    subject
  );
}

//function to fetch reattempts from database
function getQuizReattempts(callback, admission) {
  const param = new FormData();
  param.append("admission", admission);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "quizresult.php", true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      callback(response);
    }
  };
  xhr.send(param);
}

//function to display reattempts
function displayReattemp() {
  getQuizQuestions((rawQuestions) => {
    const thisTopicAndSubject = rawQuestions.filter(
      (questions) =>
        questions.subject === subjectSelect.value &&
        questions.topic.trim() === thisTopicTittle.trim()
    );
    const organised = organiseQuestions(thisTopicAndSubject); //this organises the question
    //const quizTopic = selectCorrectTopic(organised,number); //this selects according to topic
    console.log("organised", organised);
    const choice = chooseQuiz(organised); //this chooses the quiz
    if (choice) {
      //if there is an avaiable quiz
      if (choice.length > 0) {
        //this section checks and hides the finished box it also clears or empties the donequestions array
        const finished = quizBox.querySelector(".finished");
        if (finished) quizBox.removeChild(finished);
        if (finished) console.log("finished division noted");
        if (finished) doneQuestions = [];

        const children = quizBox.children;
        Array.from(children).forEach((child) => (child.style.display = "flex"));
        const duration = choice[0].duration; // this is from database
        const durationDisplay = attemptBox.querySelector("#duration");
        durationDisplay.textContent = "duration:" + duration;
        //this bellow section involves getting reattempts on the quiz
        getUser((admission) => {
          //this gets the admision of user
          getQuizReattempts((result) => {
            //this gets the reattempts
            const thisRattempt = result.filter(
              (r) => r.quizCode === choice[0].quizCode
            ); //filters the current quiz
            if (thisRattempt.length > 0) {
              const tableBody = attemptBox.querySelector(
                ".reattempt-table table tbody"
              );
              thisRattempt.forEach((attempt) => {
                const tableRow = document.createElement("tr");
                tableRow.innerHTML = `
                        <td>${attempt.attempt}</td>
                        <td>${attempt.score}</td>
                        <td>${attempt.date}</td>
                `;
                tableBody.appendChild(tableRow);
              });
            } else {
              //if no reattempta
              const body = attemptBox.querySelector(".reattempt-table");
              const noresult = body.querySelector(".noresult");
              const ul = body.querySelector("table tbody");
              ul.innerHTML = "";
              if (!noresult) {
                const div = document.createElement("div");
                div.className = "noresult";
                div.innerHTML = `
                            <img src="./subjects/noresultsix.jpeg" alt="">
                            <h3>no results were found</h3>
                       `;
                body.appendChild(div);
              }
            }
          }, admission.code);
        });
      }
      //event listener to start button to start the quiz
      const start = attemptBox.querySelector(".start");
      start.addEventListener("click", (e) => {
        e.stopPropagation();
        doneQuestions = [];
        startQuiz(choice);
        thisQuestion = choice;
        clearTimer = setInterval(startTimer, 1000); //this class start timer every i second
        updated = handleDuration(choice[0].duration);
        update(); //this updated the timer global
      });
    } else if (choice === null) {
      showErrorMessage("oops! there are no quizes");
      
      topicBox.style.display = "flex";
      attemptBox.style.display = "none";
      quizBox.style.display = "none";
      finishedBox.parentElement.style.display = "none";

      doneQuizes = [];
      doneQuestions = [];
    }
  });
}

//function to start the quiz
function startQuiz(quiz) {
  topicBox.style.display = "none";
  attemptBox.style.display = "none";
  quizBox.style.display = "flex";

  if (doneQuestions.length >= quiz.length) {
    showResult(score, thisQuestion);
    postQuizResults(
      doneQuestions[0].quizCode,
      (score / quiz.length) * 100 + "%",
      today
    );
    return;
  }

  nextBtn.textContent = "next";

  if (doneQuestions.length == quiz.length - 1) nextBtn.textContent = "finish";

  let currentQuestion;
  do {
    const randomIndex = Math.floor(Math.random() * quiz.length);
    currentQuestion = quiz[randomIndex];
  } while (doneQuestions.includes(currentQuestion));

  doneQuestions.push(currentQuestion);
  displayQuestion(currentQuestion);
}

//function to display the question

function displayQuestion(questions) {
  if (questions) {
    const question = questions.question;
    const answerArray = questions.answers;
    const shuffledAnswers = answerArray.sort(() => Math.random() - 0.5);

    const questionDisplay = quizBox.querySelector(".question h3");
    const answerDisplay = quizBox.querySelector(".answers");
    const solution = quizBox.querySelector(".solution p");

    const solutionParent = solution.parentElement;
    solutionParent.style.display = "none";

    nextBtn.style.display = "none";

    questionDisplay.innerHTML = "";
    answerDisplay.innerHTML = "";
    solution.innerHTML = "";

    questionDisplay.textContent = question;
    shuffledAnswers.forEach((answer) => {
      const button = document.createElement("button");
      button.textContent = answer;
      button.className = "btn";
      answerDisplay.appendChild(button);
    });
    solution.textContent = questions.solution;

    const buttons = answerDisplay.querySelectorAll("button");
    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        nextBtn.style.display = "inline-block";
        buttons.forEach((b) => (b.disabled = true));
        if (this.textContent === questions.correct) {
          score++;
          this.className = "correct";
          solution.parentElement.style.display = "none";
        } else {
          this.className = "wrong";
          solution.parentElement.style.display = "flex";

          buttons.forEach((b) => {
            if (b.textContent === questions.correct) {
              b.className = "correct";
            }
          });
        }
      });
    });
  } else {
    alert("no quiz");
  }
}

//this handes next button
nextBtn.addEventListener("click", function () {
  currentQuestionIndex++;
  startQuiz(thisQuestion);
});

//this function shoe=ws quiz result
function showResult(result, questions) {
  getUser((user) => {
    const children = quizBox.children;
    Array.from(children).forEach((child) => (child.style.display = "none"));
    finishedBox.parentElement.style.display = "flex";
    const resultBox = finishedBox.querySelector("ul");
    resultBox.innerHTML = `
        <li>
          <span>topic:</span>
          ${document.querySelector(".topic-heading").textContent}
        </li>
        <li>
          <span>score:</span>
          ${score}/${questions.length} 
          (${(score / questions.length) * 100}%)
        </li>
        <li>
          <span>remarks:</span>
           ${getRemarks((score / questions.length) * 100)}
        </li>
        <li>
           <span>date:</span> ${today}
        </li>
        <li>
          quiz was done and results for ${user.code}
          were submitted succesfully
        </li>
   `;
    back.style.display = "flex";
    reattempt.style.display = "flex";
  });
}

//this takes duration from databse and converts it ti secods
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

//this updates the global variables (timecount and update)
function update() {
  timeLeft = updated * 60;
}

//this handels the timer if time is over it submits the quiz
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
    showResult(score, thisQuestion);
  }
}

//function t post the quiz resullts to the database
function postQuizResults(quizCode, score, date) {
  getUser((user) => {
    getQuizReattempts((userReattempts) => {
      const myAttempts = userReattempts.filter(
        (att) => att.topic.trim() === thisTopicTittle.trim()
      );
      let attempt = 0;
      if (myAttempts.length === 0) {
        attempt = 1;
      } else {
        attempt = myAttempts.length + 1;
      }
      const quizResultForm = new FormData();
      quizResultForm.append("code", quizCode);
      quizResultForm.append("score", score);
      quizResultForm.append("date", date);
      quizResultForm.append("admission", user.code);
      quizResultForm.append("topic", thisTopicTittle);
      quizResultForm.append("attempt", attempt);

      const postXhr = new XMLHttpRequest();
      postXhr.open("POST", "postquizresult.php", true);
      postXhr.onload = () => {
        try {
          if (postXhr.status === 200) {
            const response = postXhr.responseText;
            console.log(response);
          }
        } catch (error) {
          console.log("POST Error", error);
        }
      };
      postXhr.send(quizResultForm);
    }, user.code);
  });
}

//function to getRemarks
function getRemarks(scores) {
  let remarks;
  if (scores > 0) {
    if (scores <= 30) {
      remarks = "poor";
    } else if (scores <= 49 && scores > 31) {
      remarks = "bellow average";
    } else if (scores < -60 && scores > 50) {
      remarks = "average";
    } else if (scores <= 75 && scores > 51) {
      remarks = "good";
    } else if (scores <= 100 && scores > 76) {
      remarks = "execellent";
    } else {
      remarks = "good";
    }
  } else {
    remarks = "poor";
  }
  return remarks;
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

//event listeners
classSelect.addEventListener("change", () => {
  displayTopics(classSelect.value, subjectSelect.value);
});
subjectSelect.addEventListener("change", () => {
  displayTopics(classSelect.value, subjectSelect.value);
});

reattempt.addEventListener("click", function () {
  displayReattemp();
  topicBox.style.display = "none";
  quizBox.style.display = "none";
  attemptBox.style.display = "flex";
  finishedBox.parentElement.style.display = "none";
  score = 0;
});

back.addEventListener("click", function () {
  window.location.reload();
});
//topic list event listeners
