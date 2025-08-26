const analysisBox = document.querySelector(".analysis-box");
const topThree = document.querySelector(".positions .position-box");
const subjectChampions = document.querySelector(".subject-champions");
const topTen = document.querySelector(".top-ten");
const statisticBox = document.querySelector(".statistic-report");

const centralisedChildren = Array.from(document.querySelector(".centralised").children);
centralisedChildren.map(child => child.style.display = "none");
analysisBox.style.display = "none";

const noresult = document.querySelector(".noresult");

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
const progressContainer = document.getElementById("container");

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

//ajax functions and class
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

//function to get teachers
async function getTeachers() {
  const user = await getUser();
  showLoader("fetching teachers,please wait...");
  try {
    const response = await fetch("teachers.php", {
      method: "POST",
    });
    const result = await response.json();
    const thisSchool = result.filter((t) => t.schoolId === user.schoolId);
    return thisSchool;
  } catch (error) {
    console.log("teachers error", error);
  }finally{
    removeLoader();
  }
}

//function to get teachers
async function getStudents() {
  const user = await getUser();
  showLoader("fetching student details...")
  try {
    const response = await fetch("students.php", {
      method: "POST",
    });
    const result = await response.json();
    const thisSchool = result.filter((s) => s.schoolId === user.schoolId);
    return thisSchool;
  } catch (error) {
    console.log("teachers error", error);
  } finally{
    removeLoader();
  }
}

//function to get marks
async function getMarks() {
  showLoader("fetching student marks...");
  const user = await getUser();
  const data = new FormData();
  data.append("class", "");
  data.append("exam", "");
  data.append("term", "");
  data.append("id", "");

  try {
    const response = await fetch("result.php", {
      method: "POST",
      body: data,
    });
    const result = await response.json();
    const schoolResult = result.filter((r) => r.schoolId === user.schoolId);
    return schoolResult;
  } catch (error) {
    console.log("marks error", error);
  } finally {
    removeLoader()
  }
}

async function getSetup() {
  showLoader("fetching school details...")
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
  const schoolStreams = getStream(setup[0].streams);

  classSelect.innerHTML = "";
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

  classSelect.addEventListener("change", () => {
    const classStreams = schoolStreams[classSelect.value];
    streamSelect.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "--select stream--";
    streamSelect.appendChild(defaultOption);

    classStreams.forEach((clas) => {
      const option = document.createElement("option");
      option.value = clas;
      option.textContent = clas;
      streamSelect.appendChild(option);
    });
  });
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

//main function start here

async function calculateAnalysis(){
  const filled = verifySelects([classSelect,termSelect,examSelect]);
  if(!filled) return;
  const allResults = await getMarks();
  const allStudents = await getStudents();

  let analysisData;
  let mode;

  if(filled && streamSelect.value !== ""){
    showSuccessMessage("stream mode activated");
    analysisData = allResults.filter(res => {
      const classMatch = normalise(classSelect.value) === normalise(res.class);
      const streamMatch = normalise(streamSelect.value) === normalise(res.stream);
      const termMatch = normalise(termSelect.value) === normalise(res.term);
      const examMatch = normalise(examSelect.value) === normalise(res.exam);

      return classMatch && streamMatch && termMatch && examMatch
    }); 
    mode = "stream";
  }else if(filled){
    showSuccessMessage("class mode activated");
    analysisData = allResults.filter(res => {
      const classMatch = normalise(classSelect.value) === normalise(res.class);
      const termMatch = normalise(termSelect.value) === normalise(res.term);
      const examMatch = normalise(examSelect.value) === normalise(res.exam);

      return classMatch && termMatch && examMatch
    }); 
    mode = "class";
  }else{
    analysisData = [];
  }

  if(analysisData){

    if(analysisData.length < 10){
      showLoader("oops data is below 10 students");
      setTimeout(() => {
        window.location.href = "exam.html";
      },4000)
    }

    const centralisedChildren = Array.from(document.querySelector(".centralised").children);
    centralisedChildren.map(child => child.style.display = "flex");
    analysisBox.style.display = "flex";
    noresult.style.display = "none";

    const counts = await getCounts(analysisData);
    const displayCounts = await displayGradeCounts(counts);
    const subjectChamps = await getSubjectChamp(analysisData);
    displayChamps(subjectChamps);
    await getTopTen(analysisData);
    await diplayTopTen(analysisData,mode);

     const data = {
      mode : mode,
      marks : analysisData
     }

     localStorage.setItem("data" , JSON.stringify(data));
  }
}

function getCounts(marks) {
  const grades = marks.map((m) => normalise(m.meanGrade));
  let a = 0;
  let b = 0;
  let c = 0;
  let d = 0;
  let e = 0;
  let total = 0;
  grades.forEach((element) => {
    total++;
    if (element === "a" || element === "a-") {
      a++;
    } else if (element === "b" || element === "b+" || element === "b-") {
      b++;
    } else if (element === "c" || element === "c+" || element === "c-") {
      c++;
    } else if (element === "d" || element === "d+" || element === "d-") {
      d++;
    } else if (element === "e") {
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

function displayGradeCounts(count) {
  const ul = document.querySelector(".analysis-box ul");
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

async function getSubjectChamp(marks){
  const result = {};
  for(const [idx , subj] of myDefaultSubjects.entries()){
     result[subj] = marks
     .find(r => r[`${subj}_position`] === "1");
  }
  return result;
}

async function displayChamps(champs) {
  const students = await getStudents();
  const schoolSubjects = await mySubjects();
  const tbody = subjectChampions.querySelector("tbody");
  tbody.innerHTML = "";
  Object.entries(champs).forEach(([subject , data], idx) => {
    const index = myDefaultSubjects.indexOf(subject);
    const subjects = schoolSubjects[index];
    const student = students.find(s => s.admission === data.admission);

    if(subjects){
    
    const tr = document.createElement("tr");
    tr.style.opacity = "0";
    tr.style.transform = "scale(.8)";
    tr.style.transitionDelay = `${2 * idx}s`;
    tr.style.transition = "opacity .5s linear,transform .5s linear";

    const name = `${student.firstname} ${student.middlename} ${student.lastname}`

    tr.innerHTML = `
       <td>${subjects}</td>
       <td>${student.admission}</td>
       <td>${name}</td>
       <td>${student.stream}</td>
       <td>${data[subject]}</td>
       <td>${getGrades(data[subject])}</td> 
    `;

    tbody.appendChild(tr);
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        tr.style.opacity = "1";
        tr.style.transform = "scale(1)";
      })
    })
    }

  })
}

async function getTopTen(marks){
  const marksArray = marks;
  marksArray.sort((a,b) => b.mean - a.mean);
  const students = await getStudents();

  let count = 0;
  topThree.innerHTML = "";
  marksArray.forEach(mark => {
    if(count < 3){
      const student = students.find(s => s.admission === mark.admission);

      const div = document.createElement("div");
      div.className = "box";

      const name = `${student.firstname} ${student.middlename} ${student.lastname}`;
      const image = student.profileImage || "./teachers/profileimage.png";

      div.innerHTML = `
         <div class="left">
            <img src="${image}" height="100px" width="100px" alt="">
         </div>
         <div class="right">
           <h3>${name}</h3>
           <h4>${student.class} ${student.stream}</h4>
           <h4>${mark.mean} ${getGrades(mark.mean)}</h4>
           <i class="fa fa-award"></i>
         </div>
      `;

      topThree.appendChild(div);

    }
    count++;
  })
}

async function diplayTopTen(marks,mode){
  const marksArray = marks;

  marksArray.sort((a,b) => b.mean - a.mean);
  const students = await getStudents();

  let count = 0;
  const tbody = topTen.querySelector("tbody");
  tbody.innerHTML = "";

  if(count < 10){
    marksArray.forEach((mark , idx) => {
      const tr = document.createElement("tr");
      const student = students.find(s => s.admission === mark.admission);
      let position;

      const name = `${student.firstname} ${student.middlename} ${student.lastname}`;

      if(mode === "class"){
         position = mark.meanPosition;  
      }else if(mode === "stream"){
         position = mark.streamPosition;
      }

      tr.innerHTML = `
        <td>${position}</td>
        <td>${student.admission}</td>
        <td>${name}</td>
        <td>${student.stream}</td>
        <td>${mark.mean}</td>
        <td>${getGrades(mark.mean)}</td>
      `;

      tbody.appendChild(tr);
    })
    count++;
  }
}

//aceesory functions
function showLoader(message){
  progressContainer.classList.remove("removes")
  progressContainer.classList.add("active");
  const messageText = progressContainer.querySelector(".text");
  messageText.textContent = message; 
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
    showErrorMessage("please fill in required fields");
    return false;
  }
}

function normalise(string) {
  return string.toLowerCase().trim().replace(" ", "");
}

function removeLoader(){
  progressContainer.classList.add("removes")
  progressContainer.classList.remove("active");
}

function getStream(rawStreams) {
  let result = {};
  const rawstreamArray = rawStreams.split("-");

  rawstreamArray.forEach((stream) => {
    const parts = stream.split(":");
    if (parts.length === 2) {
      const [clas, streams] = parts;
      result[clas] = streams.split("/");
    }
  });

  return result;
}

function getClass(rawClases) {
  const rawclasesArray = rawClases.split("-");
  const classArray = rawclasesArray.map((s) => {
    const [classes] = s.split("/");
    return classes;
  });
  return classArray;
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

//error functions
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
document.addEventListener("DOMContentLoaded" , async () => {
 const user = await getUser();
  if(user.from !== "admin"){
    showLoader("a non admin noted, redirecting...");

    setTimeout(() => {
      removeLoader();
      window.location.href = "main.html";
    },3000);
  }
})

classSelect.addEventListener("change" , calculateAnalysis);
streamSelect.addEventListener("change" , calculateAnalysis);
termSelect.addEventListener("change" , calculateAnalysis);
examSelect.addEventListener("change" , calculateAnalysis);

gender.addEventListener("click" , () => {
  window.location.href = "statistic.html"
})
//function class
updateSelects()