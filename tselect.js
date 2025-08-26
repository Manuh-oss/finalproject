const parent = document.querySelector(".grid-container");
const children = parent.children;
const subjectGrid = parent.querySelectorAll(".subject-grid");
const delay = 0.2;
const classSelect = document.getElementById("class");
const streamSelect = document.getElementById("stream");
const form = document.querySelector(".main");
const subjectContainers = document.querySelectorAll(".subject-all");
const tableContainers = document.querySelectorAll(".table");
const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");
const backBtn = document.querySelector(".back");
const array = [];
const submitBtn = document.querySelector(".submit-bt");
const progressContainer = document.getElementById("container");

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

const checkAllCheckbox = document.getElementById("checkAll");

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

//function to get teacher lessons
async function getLessons() {
  const user = await getUser();
  showLoader("fetching teacher lessons...")
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

async function postSelections(subject,array){
    showLoader("please wait as we save changes");
    const user = await getUser();
    const data = new FormData();
    array.forEach((object, index) => {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        data.append(`${key}[]`, object[key]);
      }
    }
   });
   data.append("subject" , subject);
   data.append("id" , user.schoolId);

   try{
     const response = await fetch("selection.php" , {
        method : 'POST',
        body : data
     })
     const result = await response.json();
     return result;
   }catch(error){
      console.log("posting error" , error);
   }finally{
    removeLoader()
   }
}

//main functions

async function displaySubjects(){
  const subjects = await mySubjects();
  parent.innerHTML = "";
  for(const [index , subject] of subjects.entries()){
    const div = document.createElement("div");
    div.className = "subject-grid";
    div.textContent = subject;

    //initial styles
    div.style.opacity = "0";
    div.style.transform = "scale(.8)";
    div.style.backgroundColor = colors[index];
    div.style.transitionDelay = `${delay * index}s`;
    
    parent.appendChild(div);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        div.style.opacity = "1";
       div.style.transform = "scale(1)";
      })
    })

    div.addEventListener("click" , async () => {
       const defaultSubject = myDefaultSubjects[index];
       const verified = await verifyTeacher(defaultSubject);
       const filled = verifySelects([classSelect, streamSelect]);
       if (!filled) showErrorMessage("please fill out all required fields!");
       if (!filled) return;

       if(verified){
         showSuccessMessage("access granted");
         parent.style.display = "none";
         document.querySelector(".select").style.display = "none";
         document.querySelector(".selection-table").style.display = "flex";
         backBtn.parentElement.style.display = "flex"
         await displayStudents(defaultSubject)
       }else{
        showErrorMessage("access denied");
       }

    })

  }
}

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

async function displayStudents(subject){
   const allStudents = await getStudents();
   let selectionArray = [];
   const tbody = document.querySelector("table tbody")
   tbody.innerHTML = "";
   for(const [idx,student] of allStudents.entries()){
    const name = `${student.firstname} ${student.middlename} ${student.lastname}`;
    const tr = document.createElement("tr");

    //initial styles
    tr.style.opacity = "0";
    tr.style.transform = "scale(.8)";
    tr.style.transition = "opacity .6s linear,transform .6s linear";
    tr.style.transitionDelay = `${delay * idx}s`;

    tr.innerHTML = `
       <td>
         <input type="checkbox" name="" class="itemCheckbox">
       </td>
       <td>${student.admission}</td>
       <td>${name}</td>
       <td class="remove">${student.class} </td>
       <td class="remove">${student.stream}</td>
       <td class="remove">${student.gender}</td>
       <td class='select-dis'>selected</td>
       <td class="hidden"><input type="text" name="selections[]" id="" class="selects"></td>
       <td class="hidden"><input type="text" name="admissions[]" id="" class="admission-inp"value="${student.admission}"></td>
       <td class="hidden"><input type="text" name="ids[]" id="" class="idz" value="${student.id}""></td>
    `;

    tbody.appendChild(tr)

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            tr.style.opacity = "1";
            tr.style.transform = "scale(1)";
        })
    })

   }

   //display all saved changes


   const alCheckBoxes = Array.from(document.querySelectorAll(".itemCheckbox"));
   const selectInputs = Array.from(document.querySelectorAll(".selects"));
   const selectDisplay = Array.from(document.querySelectorAll(".select-dis"));
   const admissionInputs = Array.from(document.querySelectorAll(".admission-inp"));
   const idInputs = Array.from(document.querySelectorAll(".idz"));

   alCheckBoxes.forEach(checkBox => {
    checkBox.addEventListener("change" , () => {
       const checked = checkBox.checked;
       const parent = checkBox.parentElement.parentElement;
       const text = parent.querySelector(".select-dis");
       const selectionInput = parent.querySelector(".selects");
       if(checked){
         text.innerHTML = "selected <i class='fa fa-check'><i>";
         text.style.color = "green";
         selectionInput.value = "selected";
       }else{
         text.innerHTML = "dropped <i class='fa fa-times'><i>";
         text.style.color = "red";
         selectionInput.value = "not-selected";
       }

       const allChecked = alCheckBoxes.every(s => s.checked);
       const someChecked = alCheckBoxes.some(s => s.checked);
       const allDropped = alCheckBoxes.every(s => !s.checked);
       
       checkAllCheckbox.checked = allChecked;
       checkAllCheckbox.indeterminate = !allChecked && someChecked;
       checkAllCheckbox.checked = !allDropped;
    })
   })

   alCheckBoxes.map(checkBox => checkBox.checked = true);
   selectInputs.map(input => input.value = "selected");
   selectDisplay.map(text => text.innerHTML = "selected <i class='fa fa-check'><i>");
   selectDisplay.map(text => text.style.color = "green");

   checkAllCheckbox.checked = true;

   checkAllCheckbox.addEventListener("change" , () => {
    alCheckBoxes.map(checkBox => checkBox.checked = checkAllCheckbox.checked);
    if(!checkAllCheckbox.checked){
        selectInputs.map(input => input.value = "not-selected");
        selectDisplay.map(text => text.innerHTML = "dropped <i class='fa fa-times'><i>");
        selectDisplay.map(text => text.style.color = "red"); 
    }else{
        selectInputs.map(input => input.value = "selected");
        selectDisplay.map(text => text.innerHTML = "selected <i class='fa fa-check'><i>");
        selectDisplay.map(text => text.style.color = "green");
    }
   })

   //show saved chnges


   const allTrs = Array.from(tbody.querySelectorAll("tr"));

   allTrs.map(tr => {
     const state = tr.querySelector(".selects");
     const admission = tr.querySelector(".admission-inp").value;
     const stateDisplay = tr.querySelector(".select-dis");
     const checkBox = tr.querySelector(".itemCheckbox");

     const student = allStudents.find(s => s.admission === admission);

     if(student[subject] !== "not-selected"){
        stateDisplay.style.color = "green";
        stateDisplay.innerHTML = "selected <i class='fa fa-check'><i>";
        state.value = "selected";
        checkBox.checked = true;
     }else{
        stateDisplay.style.color = "red"
        stateDisplay.innerHTML = "dropped <i class='fa fa-times'><i>";
        state.value = "dropped";
        checkBox.checked = false;
     }

   })
   
   submitBtn.addEventListener("click" , async () => {
     selectionArray = allTrs.map(tr => {
        const state = tr.querySelector(".selects").value;
        const admission = tr.querySelector(".admission-inp").value;

        return{
            admissions : admission,
            selections : state,
        }
     })
     
     const reponse = await postSelections(subject,selectionArray);
     if(reponse.type){
        showSuccessMessage("changes saved succesfully");
     }else{
        showErrorMessage("error saving changes");
        console.log(reponse);
     }
   })

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

function showLoader(message){
  progressContainer.classList.remove("removes")
  progressContainer.classList.add("active");
  const messageText = progressContainer.querySelector(".text");
  messageText.textContent = message; 
}

function removeLoader(){
  progressContainer.classList.add("removes")
  progressContainer.classList.remove("active");
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

backBtn.addEventListener("click", () => {
  window.location.reload();
});

backBtn.parentElement.style.display = "none"

//function  calls
updateSelects();
displaySubjects()
