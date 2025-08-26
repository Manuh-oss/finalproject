const parent = document.querySelector(".grid-container");
const parentTwo = document.querySelector(".teacher-container");
const button = document.querySelector(".submit-btn");
const subjectInput = document.querySelector(".subject-input");
const codeInput = document.querySelector(".code-input");
const submitBtn = document.querySelector(".submit-btn .submit");
const backBtn = document.querySelector(".submit-btn .back");
const requiredInputs = document.querySelectorAll(".required");
const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");
const form = document.querySelector(".centralise");
const newForm = document.querySelector(".select");

const children = parent.children;

const subjectGrid = parent.querySelectorAll(".subject-grid");

const teacherGrid = parent.querySelectorAll(".teacher-box");

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

let delay = 0.2;

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

loadSchoolData((schoolData) => {
   const schoolSubjects = schoolData.subjects;
   parent.innerHTML = ""
   schoolSubjects.forEach((subj , idx) => {
    const div = document.createElement("div");
    div.textContent = subj;
    div.className = "subject-grid";
    div.style.opacity = "0";
    div.style.transform = "scale(0.8)";
    div.style.transitionDelay = `${delay * idx}s`;
    div.style.backgroundColor =  colors[idx];

    parent.appendChild(div);
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        div.style.opacity = "1";
        div.style.transform = "scale(1)";
      })
    })

    div.addEventListener("click" , (e) => {
      e.stopPropagation();
      const divValue = div.textContent.trim();
      const index = schoolSubjects.indexOf(divValue);
      const subject = myDefaultSubjects[index];
      if(validateInputs()){
         displayTeachers(subject);
      }
    })

   })
})

function validateInputs() {
  let allIsfilled = true;
  requiredInputs.forEach((required) => required.classList.remove("errors"));
  requiredInputs.forEach((input) => {
    if (input.value.trim() === "") {
      allIsfilled = false;
      input.classList.add("errors");
    } else {
      allIsfilled = true;
    }
  });

  if (allIsfilled) {
    return true;
  } else {
    showErrorMessage("all input fields are required");
     return false;
  }
}

function getTeachers(callback) {
  getUser((user) => {
  const allSubjects = [];
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "teachers.php", true);
  xhr.onload = () => {
     try{
       if(xhr.status == 200){
         const response = JSON.parse(xhr.responseText);
         const schoolteachers = response.filter(t => t.schoolId === user.schoolId);
         callback(schoolteachers);
       }
     }catch(error){
       console.log("teacher error", error);
     }
  };
  xhr.send();
  })
}

function getLessonsTaught(callback) {
  getUser((user) => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "lesson.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        const thisSchool = response.filter(s => s.schoolId === user.schoolId);
        callback(thisSchool);
      }
    } catch (error) {
      console.log("lesson Error", error);
    }
  };
  xhr.send();
  })
}

function displayTeachers(subject) {
  loadSchoolData((schoolData) => {
  const subjects = schoolData.subjects;
  getTeachers((teachers) => {
    getLessonsTaught((lessons) => {
       const thisSubjectTeachers = teachers.filter(t => {
        return (
          t.subjectOne === subject ||
          t.subjectTwo === subject
        )
       });
       if(thisSubjectTeachers.length > 0){
        hideSubjects();
        submitBtn.disabled = true;
        parentTwo.innerHTML = "";
        const classSelect = document.querySelector("#class")
        const streamSelect = document.querySelector("#stream")
        
        thisSubjectTeachers.forEach((teacher , idx) => {
           const profileImage = teacher.profileImage || "./teachers/profileimage.png";
           const myLessons = lessons.filter(t => t.teacherCode === teacher.teacherCode);

           const teacherDiv = document.createElement("div");
           teacherDiv.className = "box";
           teacherDiv.style.transitionDelay = `${delay * idx}` + "s";
           teacherDiv.style.opacity = "0";
           teacherDiv.style.transform = "scale(0.8)";

           const subjectOneIdx = myDefaultSubjects.indexOf(teacher.subjectOne);
           const subjectTwoIdx = myDefaultSubjects.indexOf(teacher.subjectTwo);

           teacherDiv.innerHTML = `
              <div class="upper">
                  <div class="image">
                     <img src="${profileImage}" alt="${teacher.firstname}">
                 </div>
              </div>
              <div class="lower">
                  <h3 class="name">${teacher.firstname} ${teacher.middlename}</h3>
                  <p>${teacher.rank}</p>
                  <div class="subjects">
                    <span>${subjects[subjectOneIdx]}</span>
                    <span>${subjects[subjectTwoIdx]}</span>
                  </div>
                  <h4>teaching ${myLessons.length} lessons</h4>
              </div>
              <i style="display:none;" class="fas fa-check"></i>
           `;
           parentTwo.appendChild(teacherDiv);

           requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              teacherDiv.style.opacity = "1";
              teacherDiv.style.transform = "scale(1)";
            })
           })

           teacherDiv.addEventListener("click" , (e) => {
            e.stopPropagation();
            const icon = teacherDiv.querySelector(".fa-check");
            const icons = parentTwo.querySelectorAll(".fa-check");
            icons.forEach(icon => icon.style.display = "none"); //hide all icons when one is selected
            icon.style.display = "grid";

            submitBtn.disabled = false;

            showSuccessMessage(`${teacher.firstname} selected succesfully`)

            let teacherData = {
              subject : subject,
              class : classSelect.value,
              stream : streamSelect.value,
              code : teacher.teacherCode,
            }

            submitBtn.addEventListener("click" , () => {
              submitTeacher(teacherData);
            })
            
           })

        })

       }else{
        showErrorMessage("no subject teachers were found");
       }
    })
  }) 
}) 
}

function submitTeacher(data) {
  getUser((user) => {
  const formData = new FormData();
  formData.append("id" , user.schoolId)
  formData.append("teacher-code" , data.code)
  formData.append("class" , data.class)
  formData.append("subject" , data.subject)
  formData.append("stream" , data.stream)
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "submit.php", true);
  submitBtn.textContent = "submiting please wait...";
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        if (response.type) {
          showSuccessMessage("teacher added succesfully");
          submitBtn.disabled = true;
          submitBtn.textContent = "submit";
          const icons = parentTwo.querySelectorAll(".fa-check");
          icons.forEach(icon => icon.style.display = "none"); //hide all icons when one is selected
        } else if (response.message == false) {
          showErrorMessage("error adding teacher");
        }
      }
    } catch (error) {
      console.log("submit error" , error)
    } finally {
      console.log(xhr.responseText);
    }
  };
  xhr.send(formData);
  })
}

function hideSubjects() {
  parentTwo.style.display = "grid";
  parent.style.display = "none";
  submitBtn.parentElement.style.display = "flex";
}

function hideTeachers() {
  parentTwo.style.display = "none";
  parent.style.display = "grid";
  submitBtn.parentElement.style.display = "none";
  requiredInputs.forEach((required) => required.value = "");
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

backBtn.addEventListener("click", hideTeachers);
