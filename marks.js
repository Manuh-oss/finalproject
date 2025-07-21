const verifyBox = document.querySelector(".grid-container");
const children = verifyBox.children;
const subjectDivs = verifyBox.querySelectorAll(".subject-grid");
const marksTable = document.querySelector(".marks-table");
const classSelect = document.getElementById("class");
const streamSelect = document.getElementById("stream");
const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");
const selectBox = document.querySelector(".select");
const delay = 0.2;
const examSelect = marksTable.querySelector("#main-exam");
const termSelect = marksTable.querySelector("#main-term");
const centralised = document.querySelector(".centralise");
const form = document.querySelector(".means");
const submitBtn = document.querySelector("#submit-btn");
const backBtn = document.querySelector(".back");
let subject;

const progressContainer = document.getElementById("container");

let admissions;
let marks;
let totalsArray;
let meansArray;

const streams = ["111","222","333","444"];

const subjects = [
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
];

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

const comparingData = [
  "english",
  "kiswahili",
  "chemistry",
  "mathematics",
  "biology",
  "physics",
  "geography",
  "cre",
  "history",
  "agriculture",
  "french",
  "computer",
  "business",
  "mean",
];
	
//this sets a tranition delay to every child
for (let x = 0; x < children.length; x++) {
  children[x].style.transitionDelay = `${delay * x}` + "s";
  children[x].style.backgroundColor = colors[x];
  children[x].style.border = "none";
  children[x].textContent = children[x].querySelector(".text").textContent;
}

//this adds opacity one and a scle of i to ever box when the page reloads
window.addEventListener("load", function () {
  Array.from(children).forEach((element) => {
    element.style.opacity = "1";
    element.style.transform = "scale(1)";
  });
});

function getUser(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "saved_user.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
      }
    } catch (error) {
      console.log("login error", error);
    }
  };
  xhr.send();
}

function getStudents(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "students.php", true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      callback(response);
    }
  };
  xhr.send();
}

function getResults(callback) {
  const data = new FormData();
  data.append("class", "");
  data.append("term", "");
  data.append("exam", "");

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "result.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("result error", error);
    }
  };
  xhr.send(data);
}

//function to validate the user subject choosen
function validateTeacher(clas, subject, stream, code, callback) {
  const data = new FormData();
  data.append("class", clas);
  data.append("subject", subject);
  data.append("stream", stream);
  data.append("tcode", code);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "validate.php", true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      callback(response);
    }
  };
  xhr.send(data);
}

function verifySelects() {
  let allIsfiled = true;
  [classSelect, streamSelect].forEach((select) => {
    if (select.value === "") {
      allIsfiled = false;
    }
  });

  if (allIsfiled) {
    return true;
  } else {
    return false;
  }
}

/* marks function stat here validation posting all that shit */

function checkUser() {
  if (subject) {
    getUser((user) => {
      if (user.from !== "teacher") {
        showErrorMessage("user is no teacher");
        return;
      } else {
        validateTeacher(
          classSelect.value,
          subject,
          streamSelect.value,
          user.code,
          (validated) => {
            if (validated.type) {
              showSuccessMessage("access granted");
              hideSubject();
              selectBox.style.display = "none";
              displayStudent();
            } else {
              showErrorMessage("access denied");
            }
          }
        );
      }
    });
  } else {
    showErrorMessage("subject is null");
  }
}

function displayStudent() {
  getResults((studentsResults) => {
    getStudents((students) => {
      const selectedTerm = termSelect.value || "2";
      const selectedExam = examSelect.value || "22";
      const thisExamResults = studentsResults.filter((result) => {
        return (
          result.class === classSelect.value &&
          result.stream === streamSelect.value &&
          result.term === selectedTerm &&
          result.exam === selectedExam
        );
      });

      thisExamResults.sort((a, b) => Number(a.admission) - Number(b.admission));

      const noresult = document.querySelector(".noresult");
      const table = document.querySelector(".table table tbody");
      const Cont = document.querySelector(".table");

      if (thisExamResults.length > 0) {
        if (noresult) noresult.style.display = "none";
        document.querySelector(".subject-tittle").textContent = subject;
        table.innerHTML = "";

        thisExamResults.forEach((result) => {
          const studentDetails = students.find(
            (s) => s.admission === result.admission
          );

          if (studentDetails) {
            if (studentDetails[subject] !== "not-selected") {
              const tr = document.createElement("tr");
              const name =
                studentDetails.firstname +
                " " +
                studentDetails.middlename +
                " " +
                studentDetails.lastname;
              tr.innerHTML = `
                 <td>${studentDetails.admission}</td>
                 <td>${name}</td>
                 <td class="remove">form${studentDetails.class}</td>
                 <td class="remove">${convertStream(studentDetails.stream)}</td>
                 <td class="remove">${studentDetails.gender}</td>
                 <td><input type='text' value='${
                   result[subject]
                 }' class='marks-input'/></td>
                 <input type='hidden' value='${
                   studentDetails.admission
                 }' class='admissions'/>
               `;
              table.appendChild(tr);
            }
          }
        });
      } else {
        if (noresult) noresult.style.display = "flex";
        if (table) table.innerHTML = "";
      }

      const marksInput = table.querySelectorAll(".marks-input");
      marks = marksInput;
      admissions = table.querySelectorAll(".admissions");
      marksInput.forEach((input) => {
        input.addEventListener("input", (e) => {
          if (e.target.value > 99 || e.target.value < 0) {
            input.value = 0;
            showErrorMessage("error noted and corected");
          }
        });
      });
    });
  });
}

function uploadMarks() {
  const data = new FormData();

  if (marks.length > 0 && admissions.length > 0) {
    marks.forEach((m) => data.append("marks[]", m.value));
    admissions.forEach((a) => data.append("admissions[]", a.value));
    let subjectz;
    if (subject === "business") subjectz = "businessstudies";
    if (subject !== "business") subjectz = subject;
    data.append("subject", subjectz);
    data.append("class", classSelect.value);
    data.append("stream", streamSelect.value);
    data.append("term", termSelect.value);
    data.append("exam", examSelect.value);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "upload.php", true);

    progressContainer.classList.remove("removes");
    progressContainer.classList.add("active");
    progressContainer.querySelector("p").textContent = "Uploading marks, please wait...";

    xhr.onload = () => {
      try {
        if (xhr.status == 200) {
          const response = JSON.parse(xhr.responseText);
          if (response[0].type) {
            assignMeans();
          }
        }
      } catch (error) {
        console.log("Upload error", error);
      }finally{
        console.log(xhr.responseText)
      }
    };
    xhr.send(data);
  } else {
    console.log("marks and admission empty");
  }
}

function assignMeans() {
  getResults((results) => {
    getStudents((students) => {
      progressContainer.classList.remove("remove");
      progressContainer.classList.add("active");
      progressContainer.querySelector("p").textContent = "Updating means, please wait...";

      setTimeout(() => {
        results.forEach((result) => {
          const studentDetails = students.find((s) => s.admission === result.admission);
          if (!studentDetails) return;
          const subjectTaken = subjects.filter((s) => studentDetails[s] !== "not-selected");
          if (subjectTaken.length === 0) return;
          const totals = subjectTaken.reduce((a, b) => a + Number(result[b]), 0);
          const mean = totals / subjectTaken.length;

          const data = {
            mean: mean.toFixed(3),
            total: totals,
            grade: getGrades(mean),
            class: result.class,
            stream: result.stream,
            exam: result.exam,
            term: result.term,
            admission: studentDetails.admission,
          };

          postMeanForm(data);
        });

        assignPositions(); // continue
      }, 3000);
    });
  });
}


function postMeanForm(data) {
  const meanData = new FormData();
  meanData.append("class", data.class);
  meanData.append("stream", data.stream);
  meanData.append("exam", data.exam);
  meanData.append("term", data.term);
  meanData.append("admission", data.admission);
  meanData.append("mean", data.mean);
  meanData.append("total", data.total);
  meanData.append("grade", data.grade);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "totals.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
      }
    } catch (error) {
      console.log("Mean upload error", error);
    }
  };
  xhr.send(meanData);
}

let classPositions = [];

function assignPositions() {
  getResults((results) => {
    getStudents((students) => {
      // ✅ Show "Assigning positions"
      progressContainer.classList.remove("remove");
      progressContainer.classList.add("active");
      progressContainer.querySelector("p").textContent = "Assigning positions, please wait...";

      setTimeout(() => {
        for (let x = 1; x < 5; x++) {
          const thisClassValue = results.filter(res => 
            res.class === x.toString() && 
            res.exam === examSelect.value && 
            res.term === termSelect.value
          );

          for (let r = 0; r < comparingData.length; r++) {
            let subject = comparingData[r];
            thisClassValue.sort((a, b) => Number(b[subject]) - Number(a[subject]));
            let currentPosition = 1;
            let currentRank = 1;
            let previousMean = null;

            for (let i = 0; i < thisClassValue.length; i++) {
              const studentDetails = students.find(student => student.admission === thisClassValue[i].admission);
              if (!studentDetails) continue;

              if (studentDetails[subject] !== "not-selected" || subject === "mean") {
                const student = Number(thisClassValue[i][subject]);
                if (student) {
                  if (previousMean !== null && student !== previousMean) {
                    currentRank = currentPosition;
                  }
                  currentPosition++;
                  previousMean = student;

                  postStudentPositions({
                    admission: studentDetails.admission,
                    subject,
                    position: currentRank,
                    class: thisClassValue[i].class,
                    term: thisClassValue[i].term,
                    exam: thisClassValue[i].exam,
                    stream: thisClassValue[i].stream,
                  });
                }
              }
            }
          }
        }

        progressContainer.classList.add("remove");
        progressContainer.classList.remove("active");
        showSuccessMessage("marks updated sucessfully  ")
      }, 2000);
    });
  });
}


function postStudentPositions(data){
  const positionData = new FormData();
  positionData.append("class", data.class);
  positionData.append("stream", data.stream);
  positionData.append("exam", data.exam);
  positionData.append("term", data.term);
  positionData.append("admission", data.admission);
  positionData.append("subject", data.subject);
  positionData.append("position", data.position);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "totals.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
      }
    } catch (error) {
      console.log("Mean upload error", error);
    }
  };
  xhr.send(positionData);
  
}

//function to hise subject container
function hideSubject() {
  verifyBox.style.display = "none";
  selectBox.style.display = "none";
  marksTable.style.display = "flex";
  centralised.style.display = "none";
}

function convertStream(rawStream) {
  switch (rawStream) {
    case "111":
      return "green";
    case "222":
      return "blue";
    case "333":
      return "red";
    case "444":
      return "purple";
    default:
      return "unknown";
  }
}

function getGrades(marks) {
  let mark = Number(marks);
  let grade;
  if (mark <= 34 && mark > 0) {
    grade = "e";
  } else if (mark > 34 && mark <= 39) {
    grade = "d-";
  } else if (mark > 39 && mark <= 44) {
    grade = "d";
  } else if (mark > 44 && mark <= 49) {
    grade = "d+";
  } else if (mark > 49 && mark <= 54) {
    grade = "c-";
  } else if (mark > 54 && mark <= 59) {
    grade = "c";
  } else if (mark > 59 && mark <= 64) {
    grade = "c+";
  } else if (mark > 64 && mark <= 69) {
    grade = "b-";
  } else if (mark > 69 && mark <= 74) {
    grade = "b";
  } else if (mark > 74 && mark <= 79) {
    grade = "b+";
  } else if (mark > 79 && mark <= 84) {
    grade = "a-";
  } else if (mark > 84 && mark <= 99) {
    grade = "a";
  } else if (mark <= 0) {
    grade = "e";
  }
  return grade;
}

function shoProgressContainer(type,message){
  if(type){
    progressContainer.classList.add("active")
    const p = progressContainer.querySelector("p");
    p.textContent = message || "loading...";
    console.log("showing");
  }else{
    progressContainer.classList.remove("active");
    console.log("not showing")
  }
}

//error functions start here
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
subjectDivs.forEach((child) => {
  child.addEventListener("click", (e) => {
    e.stopPropagation();
    const filled = verifySelects();
    if (filled) {
      const text = child.textContent || null;
      subject = text;
      console.log(subject);
      checkUser();
    } else {
      showErrorMessage("please select class & stream");
    }
  });
});

termSelect.addEventListener("change", displayStudent);
examSelect.addEventListener("change", displayStudent);

submitBtn.addEventListener("click", uploadMarks);
backBtn.addEventListener("click" , (e) => {
  e.stopPropagation();
  window.location.reload();
})
