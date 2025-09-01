const sortButton = document.querySelector(".sort .open");
const sortDropdown = document.querySelector(".sort .dropdown");
const sortDropdownButtons = document.querySelectorAll(".sort .dropdown button");
const sortDropdownInput = document.querySelector(".sort .dropdown input");
const headBtns = Array.from(document.querySelectorAll(".head .navigations button"));

const main = document.querySelector(".main");
let mode;

const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");
const progressContainer = document.getElementById("container");

const assignmentSection = document.querySelector(".right .lower .body");
const assignmentBtn = document.querySelector(".navigations .assignment");
const notesBtn = document.querySelector(".navigations .notes");

//functions section
function navigateButtons(e) {
  headBtns.forEach((headBtn) => {
    headBtn.style.borderBottom = "none";
  });
  e.target.style.borderBottom = "2px solid navy";
}

//function to get loged in user
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

//function to get avaiable assignment
async function getAssignments() {
  showLoader("fetching assignments, please wait...");
  const user = await getUser();  
  let code;
  if (user.from === "student") {
      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get("code");
      code = urlCode;
      mode = "from student";
  }else{
      code = user.code;
      mode = "from teacher";
  }
 
  try{
    const response = await fetch("getassign.php" , {
      method : 'POST'
    });
    const result = await response.json();
    const thisSchool = result.filter(assign => assign.schoolId === user.schoolId && assign.code === code);
    return thisSchool;
  }catch(error){
    console.log("getting assign error" , error);
  }finally{
    removeLoader();
  }

}

//function to get teachers
async function getTeachers() {
  const user = await getUser();
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

//function to display the assignments
async function displayAssignments() {
  const noresult = document.querySelector(".no-result")
  const ul = document.querySelector(".body ul");
  const myAssignments = await getAssignments();
  
  ul.innerHTML = "";

  if(myAssignments.length === 0){
     showNoresult("oopes you have no assignments");   
     return;
  }
  
  for(const [index , assignment] of myAssignments.entries()){

    const li = document.createElement("li");
    //initia; style
    li.style.opacity = "0";
    li.style.transform = "scale(.5)";
    li.style.transitionDelay = `${0.3 * index}s`
    
    //innert html according to the file type

    if(assignment.type === "document"){
      li.innerHTML = `
        <a href='${assignment.path}' download>
           <h3>${assignment.fileName.split(".")[0]}</h3>
           <h5>${assignment.subject}</h5>
        </a>   
      `
    }else if(assignment.type === "image"){
      li.innerHTML = `
        <h3>${assignment.fileName.split(".")[0]}</h3>
        <h5>${assignment.subject}</h5>
      `;
      li.addEventListener("click" , (e) => {
        e.stopPropagation();
        window.open(assignment.path , "_blank");
      })
    }

    ul.appendChild(li);
    console.log(li)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        li.style.opacity = "1";
        li.style.transform = "scale(1)";
      })
    })

  }
  
}

function showNoresult(message){
  const noResult = document.createElement("div");
  noResult.className = "noresult";

  //initial styles
  noResult.style.opacity = "0";
  noResult.style.transform = "scale(.8)";

  const body = document.querySelector(".lower .body");
  const ul = body.querySelector("ul");
  ul.style.display = "none"

  noResult.innerHTML = `
     <img src="./subjects/noassignment.avif" alt="">
     <h3>${message}</h3> 
  `; 

  body.appendChild(noResult);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      noResult.style.opacity = "1";
      noResult.style.transform = "scale(1)";
    })
  })
}

//function to get notes from database
async function getNotes() {
  showLoader("fetching teacher's notes,please wait...");
  const user = await getUser();
  let code;
  if (user.from === "student") {
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get("code");
    code = urlCode;
    mode = "from student";
  } else {
    code = user.code;
    mode = "from teacher";
  }
  
  try{
    const response = await fetch("getnotes.php" , {
      method : 'POST',
    })
    const result = await response.json();
    const myNotes = result.filter(note => note.teacherCode === code && note.schoolId === user.schoolId);
    return myNotes
  }catch(error){
     console.log("notes fetching error" , error);
  }finally{
    removeLoader();
  }

}

//function to display notes
async function displayNotes() {
  const notes = await getNotes()
  const ul = document.querySelector(".body ul");
  const noResult = document.querySelector(".body .noresult");
  const body = document.querySelector(".lower .body");
  const bodyChilren = Array.from(body.children);

  if(notes.length === 0){
    showNoresult("oops you have no notes");
    return;
  }
  ul.innerHTML = "";
  if(noResult) noResult.remove();
  for(const [index , note] of notes.entries()){
    const li = document.createElement("li");
    //initil styles
    li.style.opacity = "0";
    li.style.transform = "scale(.5)";
    li.style.transitionDelay = `${0.3 * index}s`;

    li.innerHTML = `
      <h3>${note.topic}</h3>
      <h4>${note.subject}</h4>
    `;

    ul.appendChild(li);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        li.style.opacity = "1";
        li.style.transform = "scale(1)";
      })
    })

    //add an event listener to view the clicked teacher notes
    li.addEventListener("click" , async (e) => {
       e.stopPropagation();
       bodyChilren.map(child => child.style.display = "none");
       const editorCon = document.createElement("div");
       editorCon.className = "editor";
       editorCon.innerHTML = note.notes;
       body.appendChild(editorCon);
       mode = "back to notes";
    })

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

//aceesory functions
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

function highlightButton(index){
  headBtns.forEach(child => child.style.borderBottom = "none");
  headBtns[index].style.borderBottom = "1.5px solid navy";
}

async function updateUser(){
  const url = new URLSearchParams(window.location.search);
  const code = url.get("code")
  const teachers = await getTeachers()
  const card = document.querySelector(".lower span");
  const image = document.getElementById("profile");
  const teacher = teachers.find(t => t.teacherCode === code);

  const profileImage = teacher.profileImage || "./teachers/profileimage.png";

  image.setAttribute('src' , profileImage);
  card.innerHTML = `
    <h3>${teacher.firstname} ${teacher.middlename} ${teacher.lastname}</h3>
    <h4>${teacher.rank}</h4>
  `;
}
updateUser();
displayNotes();

const backBtn = document.querySelector(".back");

backBtn.addEventListener("click" , (e) => {
  e.stopPropagation();

  if(mode === "from student"){
    window.location.href = "dashboard.html";
  }else if(mode === "back to notes"){
    const body = document.querySelector(".lower .body");
    const bodyChilren = Array.from(body.children);

    const editor = bodyChilren.find(child => child.classList.contains("editor"));
    console.log(editor)
    if (editor) editor.style.display = "none";

    bodyChilren
      .filter(child => !child.classList.contains("editor"))
      .forEach(child => child.style.display = "flex");

    displayNotes();
  
  }

})

headBtns[1].addEventListener("click" , (e) => {
  e.stopPropagation();
  highlightButton(1);
  displayAssignments();
})

headBtns[0].addEventListener("click" , (e) => {
  e.stopPropagation();
  highlightButton(0);
  displayNotes()
})