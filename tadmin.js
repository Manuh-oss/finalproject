const aboutMe = document.querySelector(".about-me .text");
const editAbout = aboutMe.querySelector(".fa-pen");
const headButtons = document.querySelectorAll(".btn");
const headBtn = Array.from(headButtons);
const bodz = document.querySelector(".notes-quiz .body");
const right = document.querySelector(".right");
const back = right.querySelector(".back-btn");

const assignment = document.querySelector(".assignment");
const quiz = document.querySelector(".quiz");
const notesbtn = document.querySelector(".notes");

const subjectIcons = {
  english: "fa-book",
  kiswahili: "fa-language",
  mathematics: "fa-calculator",
  chemistry: "fa-flask",
  biology: "fa-leaf",
  physics: "fa-atom",
  geography: "fa-globe",
  history: "fa-landmark",
  cre: "fa-church",
  business: "fa-chart-line",
  agriculture: "fa-tractor",
  computer: "fa-desktop",
  french: "fa-flag",
};

//function section start here
//function to get logged in user
function getUser(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "saved_user.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("login error", error);
    }
  };
  xhr.send();
}

//function to getTeachers
function getTeacherDetails(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "teachers.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Teacher errror", error);
    }
  };
  xhr.send();
}

//function to get notes
function getNotes(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "getnotes.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Notes errror", error);
    }
  };
  xhr.send();
}

//function to get assignments
function getAssignments(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "getassign.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Notes errror", error);
    }
  };
  xhr.send();
}

//function to get quizes
function getQuiz(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "questions.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Notes errror", error);
    }
  };
  xhr.send();
}

//function to get quiz results
function getQuizResult(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "quizresult.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Notes errror", error);
    }
  };
  xhr.send();
}

/* display functions stsrt here*/

//function displayTeacher basics
function displayTeacherProfile() {
  getUser((user) => {
    getTeacherDetails((teachers) => {
      const tcode = getTeacherCode(user);
      const myDetails = teachers.find((t) => t.teacherCode === tcode);
      const profileImage =
        myDetails.profileImage || "./teachers/profileimage.png";
      //profile image display
      const profileBox = document.querySelectorAll(".profilez");
      profileBox.forEach((box) => box.setAttribute("src", profileImage));

      const nameSection = document.querySelector(".lower .box");
      nameSection.innerHTML = `
        <h3>${getGender(myDetails.gender)} ${myDetails.firstname}</h3>
        <h4>${myDetails.rank}</h4>
      `;

      //name and rank display
      const personalDetails = document.querySelector(".personal-details .body");
      personalDetails.innerHTML = `
        <div class="pleft">
          <div class="box">
            <i class="fa fa-user"></i>
            <span>
              <h3>name:</h3>
              <h4>${myDetails.firstname} ${myDetails.middlename}
                  ${myDetails.lastname}
              </h4>
            </span>
          </div>
          <div class="box">
            <i class="fa fa-phone"></i>
            <span>
              <h3>phone:</h3>
              <h4>0${myDetails.phone}</h4>
            </span>
          </div>
          <div class="box">
            <i class="fa fa-envelope"></i>
            <span>
              <h3>email:</h3>
              <h4>${myDetails.email}</h4>
            </span>
          </div>
        </div>

        <div class="prigth">
          <div class="box">
            <i class="fa fa-key"></i>
            <span>
              <h3>identification:</h3>
              <h4>${myDetails.identification}</h4>
            </span>
          </div>
          <div class="box">
            <i class="fa-solid fa-book"></i>
            <span>
              <h3>subjects:</h3>
              <h4>${myDetails.subjectOne} &
                  ${myDetails.subjectTwo}
              </h4>
            </span>
          </div>
          <div class="box">
            <i class="fa fa-building"></i>
            <span>
              <h3>department:</h3>
              <h4>${assignDepartment(
                myDetails.subjectOne,
                myDetails.subjectTwo
              )}</h4>
            </span>
          </div>
        </div>
      `;
    });
  });
}

function editAboutMe() {
  getUser((user) => {
    getTeacherDetails((teachers) => {
      const tcode = getTeacherCode(user)
      const myDetails = teachers.find((t) => t.teacherCode === tcode);
      const aboutMeText =
        `<p>
         ${myDetails.aboutMe} <i class="fas fa-pen" style="cursor:pointer;"></i>
      </p>` ||
        `
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. 
          Excepturi, natus hic quos rerum reiciendis ducimus. 
          Ea voluptate repellat cum dolor, id quos molestias doloremque saepe vitae, 
          minima dolorum nisi velit? 
          <i class="fas fa-pen" style="cursor:pointer;"></i>
        </p>
      `;
      aboutMe.innerHTML = aboutMeText;

      const icon = aboutMe.querySelector(".fa-pen");
      if (icon) {
        icon.addEventListener("click", () => edit(aboutMe, myDetails));
      }
    });
  });
}

function edit(container, myDetails) {
  const p = container.querySelector("p");
  if (!p) return;

  const textarea = document.createElement("textarea");
  textarea.className = "textarea";
  textarea.value = p.innerText.replace(/\s*\n?\s*<i.*<\/i>/, "").trim(); // remove icon if present
  container.replaceChild(textarea, p);

  textarea.addEventListener("change", () => {
    saveChanges(textarea.value, myDetails.teacherCode);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "enter") {
      saveChanges(textarea.value, myDetails.teacherCode);
    }
  });
}

//function saveChanges
function saveChanges(value, code) {
  const data = new FormData();
  data.append("aboutMe", value);
  data.append("code", code);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "postaboutme.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        if (response.type) {
          window.location.reload();
        } else {
          alert("error occured");
          console.log(response.errorInfo);
        }
      }
    } catch (error) {
      console.log("changes error", error);
    }
  };
  xhr.send(data);
}

function assignDepartment(one, two) {
  let department = "";

  const scienceSubjects = ["biology", "chemistry", "physics"];
  const humanitySubjects = ["geography", "history", "cre"];
  const technicalSubjects = ["business", "agriculture", "french", "computer"];

  if (one === "english" || two === "english") {
    department = "english";
  } else if (scienceSubjects.includes(one) || scienceSubjects.includes(two)) {
    department = "science";
  } else if (one === "mathematics" || two === "mathematics") {
    department = "mathematics";
  } else if (humanitySubjects.includes(one) || humanitySubjects.includes(two)) {
    department = "humanity";
  } else if (
    technicalSubjects.includes(one) ||
    technicalSubjects.includes(two)
  ) {
    department = "techinals";
  }

  return department;
}

//function of notes assignment and quiz
function displayNotes() {
  getUser((code) => {
    getNotes((notes) => {
      const tcode = getTeacherCode(code);
      const myNotes = notes.filter((note) => note.teacherCode === tcode);
      const ul = bodz.querySelector("ul")
      if (myNotes.length > 0) {
        ul.innerHTML = "";
        myNotes.forEach((note) => {
          const li = document.createElement("li");
          li.innerHTML = `
            <div class="icon">
              <i class="fas ${subjectIcons[note.subject]}"></i>
            </div>${note.topic}
            `;
          ul.appendChild(li);

          li.addEventListener("click", () => {
            const children = right.children;
            Array.from(children).forEach(
              (child) => (child.style.display = "none")
            );

            const notesBox = document.createElement("div");
            back.style.display = "flex";
            notesBox.className = "ql-editor";
            notesBox.style.fontSize = "1.5rem";
            notesBox.style.lineHeight = "2.5rem";
            notesBox.innerHTML = note.notes;
            right.appendChild(notesBox);
          });
        });
      }
    });
  });
}

//function to display assif=gnemts
function displayAssignments() {
  getUser((user) => {
    getAssignments((assignments) => {
      const tcode = getTeacherCode(user)
      const myAssignments = assignments.filter((a) => a.code === tcode);
      const ul = bodz.querySelector("ul");
      if (myAssignments.length > 0) {
        ul.innerHTML = "";
        console.log(ul)
        myAssignments.forEach((assign) => {
          const li = document.createElement("li");

          if (assign.type === "image") {
            li.innerHTML = `
                  <div class="icon">
                    <i class="fas ${subjectIcons[assign.subject]}"></i>
                  </div>${assign.fileName}
                `;
            li.addEventListener("click", () => {
              window.open(assign.path, "_blank");
            });
          } else if (assign.type === "document") {
            li.innerHTML = `
              <a href="${assign.path}" "_blank"> 
                <div class="icon">
                  <i class="fas ${subjectIcons[assign.subject]}"></i>
                </div>${assign.fileName}
              </a>  
              `;
          }
          ul.appendChild(li);
        });
      } else {
        console.log("no image found")
      }
    });
  });
}

function getTeacherCode(user){
  if(user.from !== "teacher"){
    const param = new URLSearchParams(window.location.search);
    const code = param.get("code");
    return code;
  }else{
    return user.code;
  }
}

function getGender(rawGender){
  switch(rawGender){
    case "male":
      return "Mr";
    break;
    case "female":
      return "Mrs";  
  }
}

//function calls
displayTeacherProfile();
editAboutMe();
displayNotes();
//event listeners
const button = back.querySelector("button");
button.addEventListener("click", function () {
  window.location.reload();
});

notesbtn.addEventListener("click" , () => {
  displayNotes();
  notesbtn.style.borderBottom = "1.5px solid navy";
  assignment.style.borderBottom = "none";
  quiz.style.borderBottom = "none";
})

assignment.addEventListener("click" , () =>{
  displayAssignments();
  assignment.style.borderBottom = "1.5px solid navy";
  notesbtn.style.borderBottom = "none";
  quiz.style.borderBottom = "none";
});

quiz.addEventListener("click" , (e) => {
  e.stopPropagation();
  window.location.href = "quizresult.html";
})