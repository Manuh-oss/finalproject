const profilePhoto = document.getElementById("profile-image");
const nameSection = document.querySelector(".links");
const more = document.querySelector(".the-icon .fa-ellipsis-h");
const name = document.querySelector(".down .name h3");
const profileBox = document.getElementById("profile-box");
const tbody = document.querySelector(".displinary-action tbody");
const displinaryBox = document.querySelector(".displinary-action");
const recordsBtn = document.querySelector(".change");
const children = recordsBtn.children;
const displineRecord = document.getElementById("record");
const backBtn = displinaryBox.querySelector(".back");
const parent = document.getElementById("parent");
const approvalBox = document.getElementById("enrolled-classes");
const enrollButton = document.getElementById("classes");
const back = approvalBox.querySelector(".back");

displinaryBox.style.display = "none";
approvalBox.style.display = "none";
profileBox.style.minWidth = "100%";
profileBox.style.display = "flex";
//this function gets the current loged in user
function getUser(callback){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'saved_user.php' , true);
    xhr.onload = () => {
        if(xhr.status === 200){
            const response = JSON.parse(xhr.responseText);
            callback(response);
        }
    }
    xhr.send();
}

//function to fetch parent detalis

function getParentDetails(callback){
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'parents.php' , true);
    xhr.onload = () => {
        if(xhr.status === 200){
            getUser((user) => {
                const response = JSON.parse(xhr.responseText);
                const student = response.find(s => s.admission === user.code);
                callback(student);
            })
        }
    }
    xhr.send(); 
}

//function fetch details

function getDetails(){
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'students.php' , true);
    xhr.onload = () => {
        if(xhr.status === 200){
            getUser((user) => {
                const response = JSON.parse(xhr.responseText);
                const student = response.find(s => s.admission === user.code);
                getDisplinaryRecord(student);
            })
        }
    }
    xhr.send(); 
}

//function get teachers 
function getTeachers(callback){
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'teachers.php' , true);
    xhr.onload = () => {
        try{
             if(xhr.status === 200){
               const response = JSON.parse(xhr.responseText);
               callback(response)
             }
        }catch(error){
            console.log("teacher error" , error);
        }
    }
    xhr.send(); 
}

//function get displinary record
function getDisplinaryRecord(studentProfile){
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'getrecords.php' , true);
    xhr.onload = () => {
        if(xhr.status === 200){
            getUser((user) => {
                const response = JSON.parse(xhr.responseText);
                const student = response.filter(s => s.admission === user.code);
                displayStudent(studentProfile,student)
            })
        }
    }
    xhr.send(); 
}

console.log(children)

//function diplay student

function displayStudent(student , record){
    const subjects = ['english','mathematics','kiswahili','chemistry','biology','physics','geography','history','cre','business','agriculture','computer','french'];
    const tbodies = approvalBox.querySelector("tbody")
    tbody.innerHTML = "";
    getParentDetails((parent) => {
        tbody.innerHTML = "";
        const profileImage = student.profileImage || "./teachers/profileimage.png";
        const noresult = displinaryBox.querySelector(".no-result");
        profilePhoto.setAttribute('src' , profileImage);
        name.textContent = `${student.firstname} ${student.middlename}`;
        nameSection.innerHTML = ""
        nameSection.innerHTML = `
         <div class="box">
           <i class="fa fa-user"></i>
            <span>
              <h3>parent</h3>
              <h4>${parent.firstname} ${parent.middlename}</h4>
            </span>
          </div>
          <div class="box">
            <i class="fa fa-map-marker-alt"></i>
            <span>
                <h3>address</h3>
                <h4>${student.address} ${student.location}</h4>
            </span>
          </div>
          <div class="box">
            <i class="fa fa-phone"></i>
            <span>
                <h3>phone</h3>
                <h4>${parent.phone}</h4>
            </span>
           </div>
           <div class="box">
             <i class="fa fa-envelope"></i>
             <span>
                <h3>email</h3>
                <h4>${student.email}</h4>
             </span>
           </div>
        `;
       if(record.length > 0){
        noresult.style.display = "none";
        Array.from(record).forEach(element => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                      <td>${element.date}</td>
                      <td>${element.incident}</td>
                      <td>${element.location}</td>
                      <td>${element.teacher}</td>
                      <td>${element.action}</td>
            `
            tbody.appendChild(tr);
            console.log(tr)
        });
       }else{
         noresult.style.display = "flex";
       }

       for(let x =0; x < subjects.length; x++){
        const trs = document.createElement("tr");
        trs.innerHTML = `
           <td>${x+1}</td>
           <td>${subjects[x]}</td>
           <td>${getDepartments(subjects[x])}</td>
           <td><span>${checkApproval(student[subjects[x]])}</span></td>
        `;
        tbodies.appendChild(trs);
       }

    })
}

//function diplay parent details

function displayParent(){
    getParentDetails((parent) => {
        const profileImage = parent.profileImage || "./teachers/profileimage.png";
        profilePhoto.setAttribute('src' , profileImage);
        name.textContent = `${parent.firstname} ${parent.middlename}`;
        name.nextElementSibling.textContent = parent.parentType
        nameSection.innerHTML = ""
        nameSection.innerHTML = `
         <div class="box">
           <i class="fa fa-user"></i>
            <span>
              <h3>parent</h3>
              <h4>${parent.firstname} ${parent.middlename}</h4>
            </span>
          </div>
          <div class="box">
            <i class="fa fa-map-marker-alt"></i>
            <span>
                <h3>address</h3>
                <h4>${parent.address} ${parent.location}</h4>
            </span>
          </div>
          <div class="box">
            <i class="fa fa-phone"></i>
            <span>
                <h3>phone</h3>
                <h4>0${parent.phone}</h4>
            </span>
           </div>
           <div class="box">
             <i class="fa fa-envelope"></i>
             <span>
                <h3>email</h3>
                <h4>${parent.email}</h4>
             </span>
           </div>
        `;
    })
}

//function add contact parent function

function contactParent(){
    const changeArray = Array.from(children);
    getParentDetails((parent) => {
        const atag = document.createElement("a");
        atag.style.textDecoration = "none"
        atag.href = `tel:+254${parent.phone}`;
        atag.className = "box";
        atag.id = "contact";
        atag.innerHTML = `
         <div class="icon"><i class="fa fa-phone"></i></div>
         <div style="color:black;" class="text">contact parent</div>
        `;
        const oldElement = changeArray[3];
        oldElement.parentNode.replaceChild(atag , oldElement)
    })
}

//function to mark approved or dropped
function checkApproval(value){
  //let subject = value.toLowerCase();
  let approval;
  if(value){
    if(value === "selected" || value === ""){
        approval = "approved";
      }else if(value === "not-selected"){
        approval = "dropped";
      }
  }else{
    approval = "approved"
  }
  return approval;
}

//function to get departments
function getDepartments(value){
    let department;
    let subject = value.toLowerCase();

    const scienceSubjects = ["biology", "chemistry", "physics"];
    const humanitySubjects = ["geography", "history", "cre"];
    const technicalSubjects = ["business", "agriculture", "french", "computer"];

    if (subject === "english" || subject === "kiswahili") {
    department = "language";
    } else if (scienceSubjects.includes(subject)) {
    department = "science";
    } else if (subject === "mathematics") {
    department = "mathematics";
    } else if (humanitySubjects.includes(subject)) {
    department = "humanity";
    } else if (technicalSubjects.includes(subject)) {
    department = "technicals";
    }
    return department;
}


function directToclassTeacher(){
  getTeachers((teachers) => {
    getUser((user) => {
        const changeArray = Array.from(children);
        const classTeacher = teachers.find(t => t.classTeacher === (user.class+"-"+user.stream));
        const atag = document.createElement("a");
        atag.href = `tadminprofile.html?code=${classTeacher.teacherCode}`;
        atag.className = "box";
        atag.innerHTML = `
         <div class="icon">
           <i class="fas fa-chalkboard-teacher"></i>
         </div>
         <div class="text">classteacher details</div>
        `;
        const oldElement = changeArray[2];
        oldElement.parentNode.replaceChild(atag , oldElement);
    })
  })
}

//function calling
getDetails();
contactParent();
directToclassTeacher()
//contactParent();

//event listeners
displineRecord.addEventListener("click" , function () {
    displinaryBox.style.display = "flex";
    profileBox.style.minWidth = "100%";
    profileBox.style.display = "none";
})

backBtn.addEventListener("click" , function () {
    displinaryBox.style.display = "none";
    profileBox.style.minWidth = "100%";
    profileBox.style.display = "flex";
})

enrollButton.addEventListener("click" , function () {
    displinaryBox.style.display = "none";
    approvalBox.style.display = "flex";
    profileBox.style.minWidth = "100%";
    profileBox.style.display = "none";
});

back.addEventListener("click" , function () {
    displinaryBox.style.display = "none";
    approvalBox.style.display = "none";
    profileBox.style.minWidth = "100%";
    profileBox.style.display = "flex";
})

parent.addEventListener("click" , displayParent);
