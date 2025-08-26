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
let marksInput = [];
let admissionInputs = [];

const progressContainer = document.getElementById("container");

let admissions;
let marks;
let totalsArray;
let meansArray;

const streams = ["111", "222", "333", "444"];

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

//ajax functions

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
  } finally {
    removeLoader();
  }
}

//function to get teachers
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

//function to get teacher lessons
async function getLessons() {
  const user = await getUser();
  showLoader("fetching teacher lessons...");
  try {
    const response = await fetch("lesson.php", {
      method: "POST",
    });
    const result = await response.json();
    const thisSchool = result.filter((t) => t.schoolId === user.schoolId);
    return thisSchool;
  } catch (error) {
    console.log("lessons error", error);
  } finally {
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
    removeLoader();
  }
}

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

//function upload marks
async function uploadMarks() {
  showLoader("uploading marks, please wait...");
  const user = await getUser();
  const data = new FormData();
  let subjectz;
  if (subject === "business") subjectz = "businessstudies";
  if (subject !== "business") subjectz = subject;
  data.append("subject", subjectz);
  data.append("class", classSelect.value);
  data.append("stream", streamSelect.value);
  data.append("term", termSelect.value);
  data.append("exam", examSelect.value);
  data.append("id", user.schoolId);

  marksInput.forEach((student) => {
    data.append("marks[]", student.mark);
    data.append("admissions[]", student.admission);
  });

  try {
    const response = await fetch("upload.php", {
      method: "POST",
      body: data,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("upload error", error);
  }
}

//function to upload means

async function postMeans(array) {
  showLoader("updating means, please wait...");
  const meanData = new FormData();
  array.forEach((student) => {
    meanData.append("mean[]", student.mean);
    meanData.append("admission[]", student.admission);
    meanData.append("id[]", student.id);
    meanData.append("total[]", student.total);
    meanData.append("grade[]", student.grade);
  });

  meanData.append("class" , classSelect.value);
  meanData.append("stream" , streamSelect.value);
  meanData.append("term" , termSelect.value);
  meanData.append("exam" , examSelect.value);

  try {
    const response = await fetch("totals.php", {
      method: "POST",
      body: meanData,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("mean error", error);
  }
}

//function t0 post positions
async function postPositions(array) {
  showLoader("assigning positions,please wait...");
  const user = await getUser();
  const data = new FormData();
  array.forEach((object) => {
    for (const key in object) {
      if (key !== "id" && key !== "admission" && key !== "streamPosition") {
        data.append("position[]", object[key]);      // subject position
        data.append("subject[]", key);               // subject name
        data.append("admission[]", object.admission);
        data.append("id[]", object.id);
        data.append("streamPosition[]", object.streamPosition);
      }
    }
  });

  try {
    const response = fetch("position.php", {
      method: "POST",
      body: data,
    });
    const result = (await response).json();
    return result;
  } catch (error) {
    console.log("error assigning positions", error);
  } finally {
    removeLoader();
  }
}
//main functions

//function to load submitted subjects
document.addEventListener("DOMContentLoaded", async () => {
  const schoolSubjects = await mySubjects();
  if (schoolSubjects.length > 0) {
    verifyBox.innerHTML = "";

    for (let x = 0; x < schoolSubjects.length; x++) {
      const div = document.createElement("div");
      div.className = "subject-grid";
      div.textContent = schoolSubjects[x];

      //styles for each div
      div.style.backgroundColor = colors[x];
      div.style.transitionDelay = `${delay * x}s`;
      div.style.opacity = "0";
      div.style.transform = "scale(0.8)";

      verifyBox.appendChild(div);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          div.style.opacity = "1";
          div.style.transform = "scale(1)";
        });
      });

      div.addEventListener("click", async () => {
        const defaultSubject = myDefaultSubjects[x];
        const verified = await verifyTeacher(defaultSubject);
        const filled = verifySelects([classSelect, streamSelect]);
        if (!filled) showErrorMessage("please fill out all required fields!");
        if (!filled) return;
        if (verified) {
          showSuccessMessage("access granted");
          subject = defaultSubject;

          hideSubject();
          selectBox.style.display = "none";
          displayStudents();
        } else {
          showErrorMessage("access denied");
        }
      });
    }
  } else {
    showErrorMessage("no subject found for our school");
  }
});

async function verifyTeacher(subject) {
  const user = await getUser();
  const allLessons = await getLessons();

  const subjectTeacherCode = allLessons
    .filter((t) => {
      return (
        normalise(t.class) === normalise(classSelect.value) &&
        normalise(t.stream) === normalise(streamSelect.value) &&
        normalise(t.subject) === normalise(subject)
      );
    })
    .map((t) => t.teacherCode);

  if (user.code === subjectTeacherCode[0]) {
    return true;
  } else {
    return false;
  }
}

async function displayStudents() {
  const allMarks = await getMarks();
  const allStudents = await getStudents();
  const myStudentsMarks = allMarks
    .filter((s) => {
      const classMatch = normalise(s.class) === normalise(classSelect.value);
      const streamMatch = normalise(s.stream) === normalise(streamSelect.value);

      const selectedExam = examSelect.value || "22";
      const selectedTerm = termSelect.value || "2";

      const examMatch = normalise(s.exam) === normalise(selectedExam);
      const termMatch = normalise(s.term) === normalise(selectedTerm);

      return classMatch && streamMatch && examMatch && termMatch;
    })
    .sort((a, b) => Number(a.admission) - Number(b.admission));

  const tbody = marksTable.querySelector("tbody");
  const noresult = document.querySelector(".noresult");

  tbody.innerHTML = "";
  if (noresult) {
    noresult.style.display = "none";
  }

  if (myStudentsMarks.length > 0) {
    //if found student marks data
    for (let x = 0; x < myStudentsMarks.length; x++) {
      const studentMark = myStudentsMarks[x];
      const tr = document.createElement("tr");
      const student = allStudents.find(
        (s) =>
          s.admission === studentMark.admission && s[subject] !== "not-selected"
      );
      //default tr styles
      tr.style.opacity = "0";
      tr.style.transform = "scale(.7)";
      tr.style.transition = "opacity .6s linear,transform .6s linear";
      tr.style.transitionDelay = `${delay * x}s`;

      if (student) {
        const name = `${student.firstname} ${student.middlename} ${student.lastname}`;
        tr.innerHTML = `
        <td>${student.admission}</td>
        <td>${name}</td>
        <td class="remove">${student.class}</td>
        <td class="remove">${student.stream}</td>
        <td class="remove">${student.gender}</td>
        <td>
           <input type='text' value='${studentMark[subject]}'class='marks-input'/>
        </td>
        <input type='hidden'
               value='${student.admission}'
               class='admissions'/>
        `;

        tbody.appendChild(tr);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            tr.style.opacity = "1";
            tr.style.transform = "scale(1)";
          });
        });
      }
    }

    const marksvalues = Array.from(tbody.querySelectorAll(".marks-input"));
    const studentsData = Array.from(tbody.querySelectorAll("tr")).map((row) => {
      return {
        mark: row.querySelector(".marks-input")?.value || "",
        admission: row.querySelector(".admissions")?.value || "",
      };
    });

    marksInput = studentsData;

    marksvalues.forEach((input, index) => {
      input.addEventListener("input", (e) => {
        const value = Number(e.target.value);
        if (isNaN(value) || value < 0 || value > 100) {
          input.value = "";
          showErrorMessage("Please enter a number between 0 and 100.");
        } else {
          marksInput[index].mark = value;
          console.log(marksInput[index]);
        }
      });
    });
  } else {
    //else if not found
    noresult.style.display = "flex";
    if (tbody) tbody.innerHTML = "";
  }
}

//function to calculate mean
async function getMeans() {
  let meanArray = [];
  const allResults = await getMarks();
  const selectedExam = examSelect.value || "22";
  const selectedTerm = termSelect.value || "2";

  const classResults = allResults.filter((mark) => {
    const classMatch = normalise(mark.class) === normalise(classSelect.value);
    const examMatch = normalise(mark.exam) === normalise(selectedExam);
    const termMatch = normalise(mark.term) === normalise(selectedTerm);
    return classMatch && examMatch && termMatch;
  });

  const students = await getStudents();

  for (const result of classResults) {
    const student = students.find((s) => s.admission === result.admission); //fetch his/her details
    const mySubjects = myDefaultSubjects.filter((subj) => {
      return student[subj] !== "not-selected";
    }); //filter out the unwanted or dropped subjects
    //loop through each subject geting the result from result variable and adding them toether to find the total
    const totalMarks = mySubjects.reduce(
      (total, subj) => total + Number(result[subj]),
      0
    );
    //get mean my diving the toal by the total subjects done
    const mean = totalMarks / mySubjects.length;

    const data = {
      mean: mean.toFixed(3),
      total: totalMarks,
      grade: getGrades(mean),
      id: result.id,
      admission: student.admission,
    };

    if (
      !meanArray.some(
        (s) => s.mean === data.mean && s.admission === data.admission
      )
    ) {
      meanArray.push(data);
    }
  }
  return meanArray;
}

//function to assign positions
async function assignPositions() {
  let positionArray = [];
  const allResults = await getMarks();
  const allStudents = await getStudents();
  const selectedExam = examSelect.value || "22";
  const selectedTerm = termSelect.value || "2";
  //get the calss array
  const classResults = allResults.filter((mark) => {
    const classMatch = normalise(mark.class) === normalise(classSelect.value);
    const examMatch = normalise(mark.exam) === normalise(selectedExam);
    const termMatch = normalise(mark.term) === normalise(selectedTerm);
    return classMatch && examMatch && termMatch;
  });
  //get stream array
  const streamResults = allResults.filter((mark) => {
    const classMatch = normalise(mark.class) === normalise(classSelect.value);
    const streamMatch =
      normalise(mark.stream) === normalise(streamSelect.value);
    const examMatch = normalise(mark.exam) === normalise(selectedExam);
    const termMatch = normalise(mark.term) === normalise(selectedTerm);
    return classMatch && examMatch && termMatch && streamMatch;
  }).map(s => { 
    return {
        mean : s.mean,
        admission : s.admission
    }
  });
  
  const comparingData = myDefaultSubjects;
  comparingData.push("mean");
  const studentData = {};
  //this gets stream result
  const sortedStreamResult = streamResults
  .map(res => {
     return {
      mark : res.mean,
      id : res.id,
      admission : res.admission
     }    
   })
  .sort((a,b) => b.mark - a.mark); 

   for(const data of comparingData){
    //this stores sorted class result
      const sortedClassResult = classResults
        .map(res => {
          const student = allStudents.find(s => res.admission === s.admission);
          if(student && student[data] !== "not-selected"){
             return {
               mark : res[data],
               admission : student.admission,
               subject : data,
               id : res.id
             }
          }
          return null
        })
        .filter(Boolean)
        .sort((a,b) => b.mark - a.mark);

         let currentRank = 1;
         let currentPosition = 1;
         let previousMean = null;

         for(const position of sortedClassResult){
           if(position && position.mark){
             if(previousMean !== null && previousMean === position.mark){

             }else{
              currentRank = currentPosition;
             }

             currentPosition++;
             previousMean = position.mark;

             if(!studentData[position.admission]) studentData[position.admission] = {};
             studentData[position.admission][data] = currentRank;
             studentData[position.admission]["id"] = position.id;
             studentData[position.admission]["admission"] = position.admission;
           }
         }

   }

   let currentRank = 1;
   let currentPosition = 1;
   let previousMark = 1;
   for(const position of sortedStreamResult){
     if(position && position.mark){
       if(previousMark !== null && position.mark === previousMark){

       }else{
        currentRank = currentPosition;
       }

       currentPosition++;
       previousMark = position.mark;

       studentData[position.admission].streamPosition = currentRank;
     }
   }
   
   Object.entries(studentData).forEach(([admis,data]) => {
     if(!positionArray.some(s => s.admission === admis)){
       positionArray.push(data);
     }
   })

  return positionArray;
}

//accesory functions

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

function normalise(string) {
  return string.toLowerCase().trim().replace(" ", "");
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

//function to hise subject container
function hideSubject() {
  verifyBox.style.display = "none";
  selectBox.style.display = "none";
  marksTable.style.display = "flex";
  centralised.style.display = "none";
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

//function class

updateSelects();

//event listeners
submitBtn.addEventListener("click", async () => {
  try{
    const result = await uploadMarks();
    if (result.type) {
      const meansArray = await getMeans();
      const positionArray = await assignPositions();
      console.log(await postMeans(meansArray));
      await postPositions(positionArray); 
    }
  }catch(error){
    console.log("submiting error" , error);
  }
});

termSelect.addEventListener("change" , displayStudents)
examSelect.addEventListener("change" , displayStudents)

backBtn.addEventListener("click" , () => {
  window.location.reload();
})
