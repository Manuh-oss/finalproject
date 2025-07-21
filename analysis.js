const analysisBox = document.querySelector(".analysis-box");
const topThree = document.querySelector(".positions .position-box");
const subjectChampions = document.querySelector(".subject-champions");
const topTen = document.querySelector(".top-ten");
const statisticBox = document.querySelector(".statistic-report");

const statisticalReport = document.querySelector(".statistic-report");
let selectedStudentMarks;

//statistics button
const gender = document.querySelector(".gender-star");
const clas = document.querySelector(".class-star");
const subject = document.querySelector(".subject-star");

//input ans select values
const classSelect = document.querySelector("#class");
const termSelect = document.querySelector("#term");
const streamSelect = document.querySelector("#stream");
const examSelect = document.querySelector("#exam");

//error doms
const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");

//function section start here
function getStudents(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "students.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Student Error", error);
    }
  };
  xhr.send();
}

//function to getThere marks
function getMarks(callback) {
  const form = new FormData();
  form.append("class", classSelect.value);
  form.append("term", termSelect.value);
  form.append("exam", examSelect.value);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "result.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Resultt Error", error);
    }
  };
  xhr.send(form);
}

//function to count grades
function countgrades(raw) {
  let a = 0;
  let b = 0;
  let c = 0;
  let d = 0;
  let e = 0;
  let total = 0;
  raw.forEach((element) => {
    total++;
    if (element.meanGrade === "a" || element.meanGrade === "a-") {
      a++;
    } else if (
      element.meanGrade === "b" ||
      element.meanGrade === "b+" ||
      element.meanGrade === "b-"
    ) {
      b++;
    } else if (
      element.meanGrade === "c" ||
      element.meanGrade === "c+" ||
      element.meanGrade === "c-"
    ) {
      c++;
    } else if (
      element.meanGrade === "d" ||
      element.meanGrade === "d+" ||
      element.meanGrade === "d-"
    ) {
      d++;
    } else if (element.meanGrade === "e") {
      e++;
    }
  });
  return {
    aGrade: [a, (a / total) * 100 + "%"],
    bGrade: [b, (b / total) * 100 + "%"],
    cGrade: [c, (c / total) * 100 + "%"],
    dGrade: [d, (d / total) * 100 + "%"],
    eGrade: [e, (e / total) * 100 + "%"],
  };
}

//function to verify class inputs
function verifySelects() {
  if (
    examSelect.value === "" ||
    classSelect.value === "" ||
    termSelect.value === ""
  ) {
    return false;
  } else if (
    examSelect.value !== "" &&
    classSelect.value !== "" &&
    termSelect.value !== "" &&
    streamSelect.value === ""
  ) {
    return "classes";
  } else if (
    examSelect.value !== "" &&
    classSelect.value !== "" &&
    termSelect.value !== "" &&
    streamSelect.value !== ""
  ) {
    return "stream";
  }
}

//function sellect mode

//function to display the results
function diplayResults() {
  const verify = verifySelects();
  getStudents((students) => {
    getMarks((marks) => {
      const selectMode = verifySelects();
      //this checks for the select mode if it is class,stream and so on
      let analysisData = [];
      if(selectMode === "stream"){
        showSuccessMessage("stream mode activated");
        analysisData = marks.filter((res) => {
          return (
            res.class === classSelect.value &&
            res.stream === streamSelect.value &&
            res.exam === examSelect.value &&
            res.term === termSelect.value
          )
        })
      }else if(selectMode === "classes"){
        showSuccessMessage("class mode activated");
        analysisData = marks.filter((res) => {
          return (
            res.class === classSelect.value &&
            res.exam === examSelect.value &&
            res.term === termSelect.value
          )
        })
      }else{
        showErrorMessage("please fill up all select fields");
        return;
      }

      const gradeCounts = countgrades(analysisData);
      displayAnalysis(gradeCounts);

      getTopThree(analysisData , (topThree) => {
        displayTopThree(topThree);
      })
     
      getSubjectChampions(analysisData);

      getTopStudents(analysisData,10, (topStudents) => {
        displayTopStudents(topStudents,10)
      })

      const data = {
        marks: analysisData,
        mode: verifySelects()
      };

      gender.addEventListener("click", function () {
        const verify = verifySelects();
        if (verify === "stream" || verify === "classes") {
           localStorage.setItem("data" , JSON.stringify(data));
           window.location.href = "statistic.html";
        }
      });
     
    });
  });
}

//function to diplayAnalysis
function displayAnalysis(count) {
  const ul = analysisBox.querySelector("ul");
  ul.innerHTML = "";
  const inner = `
    <li>
       <p>A</p>
       <p class="tally">${count["aGrade"][0]}</p>
       <div class="progress"><div class="juice" style="width:${count["aGrade"][1]}; background-color:#28a745; height:100%;"></div></div>
   </li>
        <li>
        <p>B</p>
        <p class="tally">${count["bGrade"][0]}</p>
        <div class="progress"><div class="juice" style="width:${count["bGrade"][1]}; background-color:#14AAF5; height:100%;"></div></div>
    </li>
    <li>
        <p>C</p>
        <p class="tally">${count["cGrade"][0]}</p>
        <div class="progress"><div class="juice" style="width:${count["cGrade"][1]}; background-color:#FF9933; height:100%;"></div></div>
    </li>
    <li>
        <p>D</p>
        <p class="tally">${count["dGrade"][0]}</p>
        <div class="progress"><div class="juice" style="width:${count["dGrade"][1]}; background-color:#B8255F; height:100%;"></div></div>
    </li>
    <li>
        <p>E</p>
        <p class="tally">${count["eGrade"][0]}</p>
        <div class="progress"><div class="juice" style="width:${count["eGrade"][1]}; background-color:#DB4035; height:100%;"></div></div>
    </li>
    `;
  if (ul) {
    ul.innerHTML = inner;
  }
}

//function get Top three
function getTopThree(analysisData, callback) {
  getStudents((students) => {
    analysisData.sort((a,b) => b.mean - a.mean);
    const topThree = {};
    const objectKeys = ["first","second","third"];
    
    for(let i = 0; i < 3; i++){
      const studentData = students.find(s => s.admission === analysisData[i].admission);
      console.log(studentData)
      if(studentData){
          const profileImage = studentData.profileImage || "./teachers/profileimage.png";
          topThree[objectKeys[i]] = {
            image : profileImage,
            class : studentData.class,
            stream : studentData.stream,
            score : analysisData[i].mean,
            name : studentData.firstname+" "+studentData.middlename+" "+studentData.lastname
          }
      }
    }

    callback(topThree)

  })  
}

//function to diplay Top three
function displayTopThree(students) {
  const children = Array.from(topThree.children);
  console.log(children)
  
  const objectKeys = ["first","second","third"];

  objectKeys.forEach((key , idx) => {
     children[idx].innerHTML = `
        <div class="left">
          <img src="${students[key].image}" height="100px" width="100px" alt="">
        </div>
        <div class="right">
          <h3>${students[key].name}</h3>
          <h4>form${students[key].class} ${covertStream(students[key].stream)}</h4>
          <h4>${students[key].score} ${getGrade(students[key].score)}</h4>
          <i class="fa fa-award"></i>
        </div>  
     `;
  })

}

//function to getSubject champions
function getSubjectChampions(raw) {
  const subjectChamps = {};
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
    "agriculture",
    "business",
    "computer",
    "french",
  ];
  getStudents((students) => {
     for(let subj = 0; subj < subjects.length; subj++){
      raw.sort((a,b) => Number[b[subjects[subj]]] - Number(a[subjects[subj]]));
      const studentDetails = students.find(s => s.admission === raw[0].admission);
      if(studentDetails){
        subjectChamps[subjects[subj]] = {
          name : studentDetails.firstname+" "+studentDetails.middlename+" "+studentDetails.lastname,
          admission : studentDetails.admission,
          stream : studentDetails.stream,
          mark : raw[0][subjects[subj]],
          grade : getGrade(raw[0][subjects[subj]]),
        } 
      }
    }

    displaySubjectChampions(subjectChamps);
  });
}

//function to display subject champions
function displaySubjectChampions(students) {
  const tableBody = subjectChampions.querySelector("table tbody");
  tableBody.innerHTML = "";
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
    "agriculture",
    "business",
    "computer",
    "french",
  ];
  for (let s = 0; s < subjects.length; s++) {
    if(students[subjects[s]]){
           const tr = document.createElement("tr");
    tr.innerHTML = `
         <td>${subjects[s]}</td>
         <td>${students[subjects[s]].admission}</td>
         <td>${students[subjects[s]].name}</td>
         <td>${covertStream(students[subjects[s]].stream)}</td>
         <td>${students[subjects[s]].mark}</td>
         <td>${students[subjects[s]].grade}</td>
    `;
    tableBody.appendChild(tr);
    }
  }
}

//function to getGrades
function getGrade(marks) {
  let mark = parseInt(marks);
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

//function to get The top students
function getTopStudents(analysisData, number, callback) {
  getStudents((students) => {
      analysisData.sort((a,b) => Number(b.mean) - Number(a.mean));
      const topStudents = {};
      for(let x = 0; x < number; x++){
        const student = students.find(s => s.admission === analysisData[x].admission);
        topStudents["position"+(x+1)] = {
          name : student.firstname+" "+student.middlename+" "+student.lastname,
          score : analysisData[x].mean,
          grade : getGrade(analysisData[x].mean),
          admission : student.admission,
          class : "form"+student.class+" "+covertStream(student.stream),
          pos : analysisData[x].meanPosition
        }
      }
      callback(topStudents);
  })
}

//function to display top students
function displayTopStudents(students, number) {
  const tbody = topTen.querySelector("table tbody");
  tbody.innerHTML = "";
  for(let r = 0; r< number; r++){
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${students["position"+(r+1)].pos}</td>
      <td>${students["position"+(r+1)].admission}</td>
      <td>${students["position"+(r+1)].name}</td>
      <td style='text-align:left;'>${students["position"+(r+1)].class}</td>
      <td>${students["position"+(r+1)].score}</td>
      <td>${students["position"+(r+1)].grade}</td>
    `;
    tbody.appendChild(tr)
    console.log(tr)
  }
}

//function to convert streeam
function covertStream(rawStream) {
  switch (rawStream) {
    case "111":
      return "green";
      break;
    case "222":
      return "blue";
      break;
    case "333":
      return "red";
      break;
    case "444":
      return "purle";
      break;
    default:
      return "green";
  }
}

//errro functions
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

//event listeners
classSelect.addEventListener("change", diplayResults);
streamSelect.addEventListener("change", diplayResults);
examSelect.addEventListener("change", diplayResults);
termSelect.addEventListener("change", diplayResults);


statisticBox.style.display = "none";
//console.log(statement);
//console.log(recomend);
