const streams = ["green", "blue", "red", "purple"];

const myQuizBox = document.querySelector(".myquiz-cont");
const ul = myQuizBox.querySelector("ul");
const resultDiv = myQuizBox.querySelector(".quiz-result");
const lis = ul.children;
const delay = 0.2;

const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");

let topicValue;

function getMyQuizes(callback) {
  const data = new FormData();
  data.append("class", "");
  data.append("subject", "");

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "questions.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Quix error", error);
    }
  };
  xhr.send(data);
}

function getQuizResult(callback) {
  const data = new FormData();
  data.append("admission", "");

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "quizresult.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Quix error", error);
    }
  };
  xhr.send(data);
}

function getStudents(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "students.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Student error", error);
    }
  };
  xhr.send();
}

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

function getTopics(clas, subject, callback) {
  const data = new FormData();
  data.append("class", clas);
  data.append("subject", subject);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "getTopics.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const reponse = JSON.parse(xhr.responseText);
        callback(reponse);
      }
    } catch (error) {
      console.log("Topic error", error);
    }
  };
  xhr.send(data);
}

function displayQuizBoxes() {
  getUser((user) => {
    getMyQuizes((allQuizes) => {
      const myQuizes = allQuizes.filter((quiz) => {
        return quiz.teacherCode === user.code;
      }); //gets users quizes

      if (myQuizes.length > 0) {
        ul.innerHTML = "";
        const groupedQuizes = groupMyQuiz(myQuizes);
        Object.values(groupedQuizes).forEach((quizInfo, idx) => {
          const li = document.createElement("li");
          li.style.transitionDelay = `${delay * idx}s`;

          li.innerHTML = `
              <h2>${quizInfo[0].topic}</h2>
              <h3>${quizInfo[0].subject}</h3>
              <h4>more information <i class="fa fa-caret-down"></i></h4>
            `;
          ul.appendChild(li);
          //after the doms have been loaded
          setInterval(() => {
            li.style.opacity = "1";
            li.style.transform = "scale(1)";
          }, 0);

          const innerLisData = getQuizData(quizInfo);

          li.addEventListener("click", (e) => {
            e.stopPropagation();

            if (li.classList.contains("opened")) return; //prevent reopening
            li.dataset.originalText = li.innerHTML; //store the li content
            li.style.height = "fit-content";
            li.innerHTML = "";

            li.classList.add("opened");

            const closeIcon = document.createElement("span"); //creates the closing icon
            closeIcon.innerHTML = "close <i class='fa fa-caret-up'></i>";
            closeIcon.className = "close-icon";
            li.appendChild(closeIcon); //appends it to each li

            closeIcon.addEventListener("click", (e) => {
              e.stopPropagation(); //to stop button rippling
              li.innerHTML = li.dataset.originalText || li.innerHTML;
              li.classList.remove("opened"); //this is to close the li
            });

            const innerUl = document.createElement("ul"); //cretes inner ul
            for (let x = 0; x < 6; x++) {
              //creates 6 inner lis
              const innerLi = document.createElement("li");
              //adds an increassing transition delay and assignes its data
              innerLi.style.transitionDelay = `${delay * x}s`;
              innerLi.innerHTML = innerLisData[x];
              innerUl.appendChild(innerLi);

              //after items have loaded it assignes the visoble styles which have a transition
              setInterval(() => {
                innerLi.style.opacity = "1";
                innerLi.style.transform = "scale(1)";
              }, 0);
            }
            li.appendChild(innerUl); //appends ech ul

            //this are the assignment functions
            const assignment = innerUl.querySelector(".fa-toggle-off");
            const editTopic = innerUl.querySelector(".fa-pen");
            const resultIcon = innerUl.querySelector(".fa-clipboard");
            const [type, clas, stream] = quizInfo[0].type;
            if (type) {
              //if it was an assignment
              //make the icon to be on
              assignment.classList.add("fa-toggle-on");
              assignment.classList.remove("fa-toggle-off");
            }

            //adds an event listener to the icon
            assignment.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (assignment.classList.contains("fa-toggle-off")) {
                //if off adds an assignemtn
                showAssignment(assignment, quizInfo);
              } else {
                //else removes the assignmnet
                postAssignmant("quiz", quizInfo, (message) => {
                  if (message.type) {
                    assignment.classList.remove("fa-toggle-on");
                    assignment.classList.add("fa-toggle-off");
                    showSuccessMessage("assignment was removed succesfully");
                  }
                });
              }
            });
            //asignemtn propagation end

            //topic change propagation start here
            editTopic.addEventListener("click", (e) => {
              e.stopPropagation();
              e.preventDefault();
              if (editTopic.classList.contains("opened")) return;
              changeTopic(quizInfo, editTopic);
            });
            //topic change propagation end here
            //rsult showing propagation start here
            const resultParent = resultIcon.parentElement;
            resultParent.addEventListener("click", (e) => {
              e.stopPropagation();
              ul.style.display = "none";
              resultDiv.style.display = "flex";
              showQuizResult(quizInfo[0]);
            });
            //rsult showing propagation end here
          });
        });
      }
    });
  });
}

//asignemnt function start here
function showAssignment(element, data) {
  const parent = element.parentElement;
  parent.dataset.originalText = parent.innerHTML;
  parent.innerHTML = "";
  parent.style.minHeight = "fit-content";
  parent.style.flexDirection = "column";
  parent.style.gap = "1rem";
  parent.style.padding = "1rem";
  //top section involves basic styles

  //this creates two selects and a default option for the class select
  const classSelect = document.createElement("select");
  const streamSelect = document.createElement("select");
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "--choose--";
  classSelect.appendChild(defaultOption); //appends the default option
  for (let x = 0; x < 4; x++) {
    //this loops four times to create the clas and stream inner options
    const classOption = document.createElement("option");
    classOption.value = x + 1;
    classOption.textContent = "form" + (x + 1);
    classSelect.appendChild(classOption);

    const streamOption = document.createElement("option");
    streamOption.value = `${x + 1}${x + 1}${x + 1}`;
    streamOption.textContent = streams[x];
    streamSelect.appendChild(streamOption);
  }
  parent.appendChild(classSelect);
  parent.appendChild(streamSelect);
  //appends all select fields on the parent

  //creates a done button
  const doneButton = document.createElement("button");
  doneButton.type = "button";
  doneButton.textContent = "done";

  [classSelect, streamSelect].forEach((select) => {
    select.addEventListener("change", () => {
      if (select.value !== "") {
        //if all selects are filled it shows the button
        parent.appendChild(doneButton);
        doneButton.onclick = (e) => {
          e.stopPropagation();
          const message =
            "assignment" + "-" + classSelect.value + "-" + streamSelect.value;
          postAssignmant(message, data, (message) => {
            if (message.type) {
              doneButton.textContent = "saved";
              //if the response was true :
              /* add a on icon
                 restore its innitail state
                 sow a succes message
              */
              parent.innerHTML =
                parent.dataset.originalText || parent.innerHTML;
              parent.style.flexDirection = "row";
              const icon = parent.querySelector(".fa-toggle-off");
              icon.classList.add("fa-toggle-on");
              icon.classList.remove("fa-toggle-off");

              showSuccessMessage("quiz assignment added succesfully");
            }
          });
        };
      }
    });
  });

  const children = parent.children;
  Array.from(children).forEach((child) => {
    child.addEventListener("click", (e) => {
      e.stopPropagation();
      //this stops ripple fromall elemnts f the assignemnt parent element
    });
  });
}
//asignemnt function end here

//change topic functions start here
function changeTopic(quizData, element) {
  const clas = quizData[0].class;
  const subject = quizData[0].subject;
  const topic = quizData[0].topic;
  getTopics(clas, subject, (topics) => {
    //this section hab=ndels clearing the div and saving its contents
    const parent = element.parentElement;
    parent.dataset.originalText = parent.innerHTML;
    parent.innerHTML = "";
    parent.style.padding = "1rem";
    parent.style.minHeight = "fit-content";

    const topicSelect = document.createElement("select");
    topics.sort((a, b) => Number(a.topic_number) - Number(b.topic_number));
    topics.forEach((topic) => {
      const option = document.createElement("option");
      option.value = topic.topic_tittle;
      option.textContent = topic.topic_tittle;
      topicSelect.appendChild(option);
    });

    topicSelect.value = topic;

    parent.appendChild(topicSelect);

    topicSelect.addEventListener("change", () => {
      const param = "";
      topicValue = topicSelect.value;
      postAssignmant("", quizData, (message) => {
        if (message.type) {
          parent.innerHTML = `<p>${topicSelect.value}</p><i class='fa fa-pen'></i>`;
          showSuccessMessage("topic was changed succesfully");
        }
      });
    });
  });
}
//change topic functions end here

//function to show sellected quiz result
function showQuizResult(quizData) {
  getQuizResult((quizResults) => {
    getStudents((students) => {
      const selectedCode = quizData.quizCode;
      const myQuizResults = quizResults.filter((result) => {
        return result.quizCode === selectedCode;
      });

        if (myQuizResults.length > 0) {
            //groupes the results inaccordance to the admission number 6219 : [results]
            const groupedResults = groupResultAdmission(myQuizResults);
            const table = resultDiv.querySelector("table")
            table.innerHTML = ""
            //this gets the values of the result object
            const studentReattemps = Object.values(groupedResults);
            //this reduce funcion gets the geatest length        
            const headTr = document.createElement("tr");
            
            const resultObject = studentReattemps[0];
            const results = studentReattemps[1];
            const greatest = studentReattemps[2];

            headTr.innerHTML = `
              <td>#</td>
              <td>A.D.N</td>
              <td>name</td>
              <td>class</td>
              <td>stream</td>
              <td colspan='${greatest}'>attempts</td>              
            `;

            table.appendChild(headTr)
            Object.entries(resultObject).forEach(([admission,values],i) => {
               const student = students.find(s => s.admission === admission);
               if(student){
                let count = 0;
                const tr = document.createElement("tr")
                for(let x = 0; x < (greatest + 5); x++){
                    const td =  document.createElement("td");
                    td.textContent = (i+1)
                    if(count == 1) td.textContent = student.admission;
                    if(count == 2){
                        td.textContent = 
                        student.firstname+" "+student.middlename+" "+student.lastname
                    }
                    if(count == 3){
                        td.textContent = "form"+student.class
                    }
                    if(count == 4){
                        td.textContent = convertStream(student.stream);
                    }
                    count++

                    if(count > 5){
                      td.textContent = results[i][x - 5] || "-";
                      const headTd = document.createElement("td");
                      headTd.textContent = "atm"+(x - 5);
                      headTd.innerHTML += headTd;
                    }
                    tr.appendChild(td)
                }
                table.appendChild(tr)
               }
            })
        } else {
            showErrorMessage("there are still no attempts");
        }
    });
  });
}

//this function groups questions according to the quiz codes
function groupMyQuiz(allQuizes) {
  let groupedQuizes = {};
  allQuizes.forEach((quiz) => {
    const code = quiz.quizCode;
    if (!groupedQuizes[code]) {
      groupedQuizes[code] = [];
    }
    groupedQuizes[code].push(quiz);
  });
  return groupedQuizes;
}

//this gets every quiz code data
function getQuizData(quizInfo) {
  const ref = quizInfo[0];
  return [
    `<p>${ref.topic}</p> <i class='fa fa-pen'></i>`,
    `${ref.quizCode}`,
    `${ref.subject}`,
    `${quizInfo.length} questions`,
    `assignment <i class='fa fa-toggle-off'></i>`,
    `result <i class='fa fa-clipboard'></i>`,
  ];
}

function groupResultAdmission(quizResults) {
  let studentResults = {};
  quizResults.forEach((quizResult) => {
    const admission = quizResult.admission;
    if (!studentResults[admission]) {
      studentResults[admission] = [];
    }
    studentResults[admission].push(quizResult.score);
  });
  const sameLengths = equaliseLengths(studentResults);
  return {
    object : studentResults,
    results : sameLengths,
    lengths : sameLengths[0].length
  }
}

function equaliseLengths(object){
    const values = Object.values(object);
    const countReattempts = values.map((d) => d.length);
    const greatest = countReattempts.reduce((current, val) => {
       return current > val ? current : val;
    }, 0);
    values.forEach(val => {
       for(let x = 0;x < greatest; x++){
        if(x >= val.length){
            val.push("-");
        }
       }
    })
    return values
}

function getStudentMarks(results,greatest){
   let count = 0;
//    results.forEach((res,i) => {
//     for(let x = 0; x < greatest; x++){
//         count++
//         if(count > res.length){
//             results[i].push("-");
//         }
//     }
//    })
   console.log(results)
}

//thsi posts the cahnges on the quiz
function postAssignmant(param, quizData, callback) {
  const code = quizData[0].quizCode;
  const topic = topicValue || quizData[0].topic;
  const data = new FormData();
  data.append("type", param);
  data.append("code[]", code);
  data.append("topic", topic);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "postquizchanges.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("post error", error);
    }
  };
  xhr.send(data);
}

function convertStream(rawStream){
    switch(rawStream){
        case "111":
            return"green";
        break;
        case "222":
            return "blue"; 
        break;   
        case "333":
            return "red";
         break;
        case "444":
            return "purple";    
         break;
         default :
         return "green";   
    }
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

displayQuizBoxes();

const back = resultDiv.querySelector(".btn .back");
back.addEventListener("click" , () => {
  ul.style.display = "flex";
  resultDiv.style.display = "none";
})