const studentsButton = document.querySelector(".students");
const parentsButton = document.querySelector(".parents");
const teachersButton = document.querySelector(".teachers");
const studentsTable = document.querySelector(".students-table table tbody");
const studentsTableHead = document.querySelector(".students-table table thead");
const allNavigationButtons = document.querySelectorAll(
  ".buttons-navigation button"
);
const expandCollapse = document.querySelector(".expand");
const expandBox = document.querySelector(".select");
const caretUp = document.querySelector(".expand .fa-angle-down");
const main = document.querySelector(".main-main .main .centralise");
const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");

function openSelectField() {
  if (expandCollapse.classList.contains("expand")) {
    expandBox.style.display = "none";
    expandCollapse.innerHTML = "expand <i class='fa fa-angle-down'></i>";
    expandCollapse.classList.add("collapse");
    expandCollapse.classList.remove("expand");
  } else {
    expandBox.style.display = "flex";
    expandCollapse.innerHTML = "collapse <i class='fa fa-angle-up'></i>";
    expandCollapse.classList.remove("collapse");
    expandCollapse.classList.add("expand");
  }
}

allNavigationButtons.forEach((allNavigationButton) => {
  allNavigationButton.addEventListener("click", function () {
    allNavigationButtons.forEach((alnavbtn) => {
      alnavbtn.style.border = "none";
      alnavbtn.style.color = "black";
    });
    this.style.borderBottom = "2px solid navy";
    this.style.color = "navy";
  });
});
//event listeners

expandCollapse.addEventListener("click", openSelectField);

//consoles
console.log(expandCollapse);

//funtion to handle students like a champ

const sortButton = document.querySelector(".sort .open");
const sortDropdown = document.querySelector(".sort .dropdown");

sortButton.addEventListener("click", function () {
  if (sortButton.classList.contains("opened")) {
    sortDropdown.style.height = "12rem";
    sortDropdown.style.overflow = "auto";
    sortButton.classList.remove("opened");
  } else {
    sortDropdown.style.height = "0";
    sortDropdown.style.overflow = "hidden";
    sortButton.classList.add("opened");
  }
});

const inputValue = "";

sortDropdownButtons.forEach((sortDropdownButton) => {
  sortDropdownButton.addEventListener("click", function getSortValue() {
    sortButton.innerHTML = `${this.textContent} <i class="fa fa-sort"></i>`;
    sortDropdownInput.value = this.textContent;
    inputValue = sortDropdownInput.value;
  });
});

//ajax

const newArray = Array.from(sortDropdownButtons);

// all students display

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
      console.log("STUDENT ERROR", error);
    }
  };
  xhr.send();
}

function getTeachers(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "teachers.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("STUDENT ERROR", error);
    }
  };
  xhr.send();
}

//function to display the students
function displayStudents() {
  getTeachers((teachers) => {
    studentsTable.innerHTML = "";
    getStudents((students) => {
      const tableHead = studentsTable.previousElementSibling;
      tableHead.innerHTML = `
        <tr>
          <th>A.D.N</th>
          <th>profile</th>
          <th>Name</th>
          <th>class</th>
          <th>stream</th>
          <th>gender</th>
          <th>classteacher</th>
          <th>action</th>
        </tr>  
      `;
      students.forEach((student) => {
        const profileImage =
          student.profileImage || "./teachers/profileimage.png";
        const tr = document.createElement("tr");
        const foundTeacher = teachers.find(
          (t) => t.classTeacher === student.class + "-" + student.stream
        );
        const teacherName = foundTeacher ? foundTeacher.firstname : "Z";
        const initial = foundTeacher ? foundTeacher.gender : "male";
        tr.innerHTML = `
         <td>${student.admission}</td>
         <td><div class="image"><img src="${profileImage}"/></div></td>
         <td>${student.firstname} ${student.middlename} ${student.lastname}</td>
         <td>form${student.class}</td>
         <td style="text-align:left;">${convertStream(student.stream)}</td>
         <td style="text-align:left;">${student.gender}</td>
         <td style="text-align:left;">${getGenderInitial(
           initial
         )} ${teacherName}</td>
         <td>
            <div class="btn">
             <button type="button" onclick="editStudent(${
               student.admission
             })" class="edit">edit</button>
             <button type="button" class="delete">delete</button>
            </div>
         </td>
        `;
        studentsTable.appendChild(tr);
      });
    });
  });
}

//function to edit the student
function editStudent(admission) {
  getStudents((students) => {
    const foundStudent = students.find((s) => s.admission == admission);
    if (foundStudent) {
      const mainChildren = main.children; //this gets all the contents of the main division
      Array.from(mainChildren).forEach(
        (child) => (child.style.display = "none")
      ); //this adds a didplay of none to all the main children
      main.style.border = "none";
      main.style.backgroundColor = "#f8f9fb";
      main.style.padding = "0";

      const profileImage =
        foundStudent.profileImage || "./teachers/profileimage.png";

      const editForm = document.createElement("form");
      editForm.className = "main";
      editForm.style.backgroundColor = "#f8f9fb";
      editForm.style.padding = "0";
      editForm.innerHTML = `
      <div class="upper">
          <div class="head">
             <h2>student details</h2>
          </div>
          <div class="body">
            <!--profile image start here-->
            <div class="profile-image-container">
              <div class="profile-image-box">
                <div class="image">
                  <img src="${profileImage}" alt="">
                </div>
                <div class="text">
                  <label for="input-file">choose file</label>
                  <input style="display: none;" type="file" name="profile-image" id="input-file">
                  <button type="button" class="remove">remove</button>
                </div>
              </div>
            </div>
            <!--profile image ends here-->
            <div class="main-body">
              <!--name section start here-->
              <div class="name-section">
                <div class="name-section-one">
                  <span>
                    <h3>firstname <sup>*</sup></h3>
                    <input type="text" name="firstname" id="" class="required" value="${
                      foundStudent.firstname
                    }">
                  </span>
                  <span>
                    <h3>middlename <sup>*</sup></h3>
                    <input type="text" name="middlename" id="" class="required" value="${
                      foundStudent.middlename
                    }">
                  </span>
                </div>
                <div class="name-section-one">
                  <span>
                    <h3>lastname <sup>*</sup></h3>
                    <input type="text" name="lastname" id="" class="required" value="${
                      foundStudent.lastname
                    }">
                  </span>
                  <span>
                    <h3>othername <sup>*</sup></h3>
                    <input type="text" name="othername" id="" class="" value="${
                      foundStudent.othername
                        ? foundStudent.othername
                        : "not provided"
                    }">
                  </span>
                </div>
              </div>
              <!--name section end here-->
              <!--phone and identification number-->
              <div class="phone-identification">
                <div class="left">
                  <h3>date of birth & place<sup>*</sup></h3>
                  <span>  
                    <input type="text" name="date-of-birth" id="" class="required" value="${
                      foundStudent.date
                    }">
                    <input type="text" name="residence" id="" class="required" value="${
                      foundStudent.location
                    }">
                  </span>
                </div>
                <div class="right">
                  <h3>email <sup>*</sup></h3>
                  <span>
                    <input type="email" name="email" id="" class="required" value="${
                      foundStudent.email
                    }">
                  </span>
                </div>
              </div>
              <!--phone and identification number end here-->
              <!--date of birth and gender-->
              <div class="phone-identification gender-date">
                <div class="left">
                  <h3>admission & gender<sup>*</sup></h3>
                  <span>  
                    <input type="number" name="admission" id="admission-number" class="required" value="${
                      foundStudent.admission
                    }">
                    <select name="gender" id="" class="required">
                      <option value="">--chooose gender--</option>
                      <option value="male" ${
                        foundStudent.gender === "male" ? "selected" : ""
                      }>${
        foundStudent.gender === "male" ? foundStudent.gender : "male"
      }</option>
                      <option value="female" ${
                        foundStudent.gender === "female" ? "selected" : ""
                      }>${
        foundStudent.gender === "female" ? foundStudent.gender : "female"
      }</option>
                    </select>
                  </span>
                  <h3>class & stream <sup>*</sup></h3>
                  <span>  
                    <select name="class" id="class" class="required">
                      <option value="">--select class--</option>
                      <option value="1" ${
                        foundStudent.class === "1" ? "selected" : ""
                      }>${
        foundStudent.class === "1" ? "form" + foundStudent.class : "form1"
      }</option>
                      <option value="2" ${
                        foundStudent.class === "2" ? "selected" : ""
                      }>${
        foundStudent.class === "2" ? "form" + foundStudent.class : "form2"
      }</option>
                      <option value="3" ${
                        foundStudent.class === "3" ? "selected" : ""
                      }>${
        foundStudent.class === "3" ? "form" + foundStudent.class : "form3"
      }</option>
                      <option value="4" ${
                        foundStudent.class === "4" ? "selected" : ""
                      }>${
        foundStudent.class === "4" ? "form" + foundStudent.class : "form4"
      }</option>
                    </select>
                    <select name="stream" id="stream" class="required">
                      <option value="">--choose stream--</option>
                      <option value="111" ${
                        foundStudent.stream === "111" ? "selected" : ""
                      }>${
        foundStudent.stream === "111"
          ? convertStream(foundStudent.stream)
          : "green"
      }</option>
                      <option value="222" ${
                        foundStudent.stream === "222" ? "selected" : ""
                      }>${
        foundStudent.stream === "222"
          ? convertStream(foundStudent.stream)
          : "blue"
      }</option>
                      <option value="333" ${
                        foundStudent.stream === "333" ? "selected" : ""
                      }>${
        foundStudent.stream === "333"
          ? convertStream(foundStudent.stream)
          : "red"
      }</option>
                      <option value="444" ${
                        foundStudent.stream === "444" ? "selected" : ""
                      }>${
        foundStudent.stream === "444"
          ? convertStream(foundStudent.stream)
          : "purple"
      }</option>
                    </select>
                  </span>
                </div>
                <div class="right">
                  <h3>address <sup>*</sup></h3>
                  <span>
                    <textarea name="address" id="">${
                      foundStudent.address
                    }</textarea>
                  </span>
                </div>
              </div>
  
            </div>
          </div>
        </div>

         <div class="submit-button-box">
          <button type="reset">reset</button>
          <button class="submit" type="button">submit</button>
        </div>
      `;
      main.appendChild(editForm);

      const submitForm = editForm.querySelector(".submit-button-box .submit");
      const allStudentFormInputs = editForm.querySelectorAll(".required");
      const inputFile = editForm.querySelector(".text input");
      const profileImageSrc = editForm.querySelector(
        ".profile-image-container .image img"
      );

      inputFile.addEventListener("change", uploadProfilePhoto);
      submitForm.addEventListener("click", () => {
        postStudentForm('enrol.php',allStudentFormInputs,editForm,"","","");
      });
    } else {

    }
  });
}

//function to display teachers
function displayTeachers() {
  getTeachers((teachers) => {
    studentsTable.innerHTML = "";
    const tableHead = studentsTable.previousElementSibling;
    tableHead.innerHTML = `
      <tr>
        <th>#</th>
        <th>profile</th>
        <th>Name</th>
        <th>Teacher code</th>
        <th>Department</th>
        <th>rank</th>
        <th>gender</th>
        <th>action</th>
      </tr>  
    `;
    teachers.forEach((teacher, idx) => {
      const profileImage =
        teacher.profileImage || "./teachers/profileimage.png";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td><div class="image"><img src="${profileImage}"/></div></td>
        <td>${teacher.firstname} ${teacher.middlename} ${
        teacher.middlename
      }</td>
        <td>${teacher.teacherCode}</td>
        <td>${teacher.department}</td>
        <td>${teacher.rank}</td>
        <td>${teacher.gender}</td>
        <td>
            <div class="btn">
             <button type="button" onclick="editTeacher('${
               teacher.teacherCode
             }')" class="edit">edit</button>
             <button type="button" class="delete">delete</button>
            </div>
        </td>
      `;
      studentsTable.appendChild(tr);
    });
  });
}

//function to edit teachers details
function editTeacher(tcode) {
  getTeachers((teachers) => {
    const foundTeacher = teachers.find((t) => t.teacherCode === tcode);
    if (foundTeacher) {
      const mainChildren = main.children; //this gets all the contents of the main division
      Array.from(mainChildren).forEach(
        (child) => (child.style.display = "none")
      ); //this adds a didplay of none to all the main children
      main.style.border = "none";
      main.style.backgroundColor = "#f8f9fb";
      main.parentElement.parentElement.style.backgroundColor = "#f8f9fb";
      main.style.padding = "0";

      const profileImage =
        foundTeacher.profileImage || "./teachers/profileimage.png";
      const othername = foundTeacher.othername || "not provided";
      const [clas, stream] = foundTeacher.classTeacher.split('-');
      console.log(clas,stream)
      console.log(foundTeacher.classTeacher)

      const editForm = document.createElement("form");
      editForm.className = "main";
      editForm.style.backgroundColor = "#f8f9fb";
      editForm.innerHTML = `
          <div class="upper">
          <div class="head">
             <h2>personal details</h2>
          </div>
          <div class="body">
            <!--profile image start here-->
            <div class="profile-image-container">
              <div class="profile-image-box">
                <div class="image">
                  <img src="${profileImage}" alt="">
                </div>
                <div class="text">
                  <label for="input-file">choose file</label>
                  <input style="display: none;" type="file" name="profile-image" id="input-file">
                  <button type="button" class="remove">remove</button>
                </div>
              </div>
            </div>
            <!--profile image ends here-->
            <div class="main-body">
              <!--name section start here-->
              <div class="name-section">
                <div class="name-section-one">
                  <span>
                    <h3>firstname <sup>*</sup></h3>
                    <input type="text" name="firstname" id="" value="${
                      foundTeacher.firstname
                    }" class="required">
                  </span>
                  <span>
                    <h3>middlename <sup>*</sup></h3>
                    <input type="text" name="middlename" id="" value="${
                      foundTeacher.middlename
                    }" class="required">
                  </span>
                </div>
                <div class="name-section-one">
                  <span>
                    <h3>lastname <sup>*</sup></h3>
                    <input type="text" name="lastname" value="${
                      foundTeacher.lastname
                    }" id="" class="required">
                  </span>
                  <span>
                    <h3>othername <sup>*</sup></h3>
                    <input type="text" name="othername" value="${othername}" id="" class="required">
                  </span>
                </div>
              </div>
              <!--name section end here-->
              <!--phone and identification number-->
              <div class="phone-identification">
                <div class="left">
                  <h3>phone & identification number<sup>*</sup></h3>
                  <span>  
                    <input type="number" name="phone" id=""  value="${
                      foundTeacher.phone
                    }"class="required">
                    <input type="number" name="identification" value="${
                      foundTeacher.identification
                    }" id="" class="required">
                  </span>
                </div>
                <div class="right">
                <h3>email <sup>*</sup></h3>
                  <span>
                    <input type="email" name="email" id="" value="${
                      foundTeacher.email
                    }" class="required">
                  </span>
                </div>
              </div>
              <!--phone and identification number end here-->
              <!--date of birth and gender-->
              <div class="phone-identification gender-date">
                <div class="left">
                  <h3>date of birth & gender<sup>*</sup></h3>
                  <span>  
                    <input type="text" name="date-of-birth" id="" value="${
                      foundTeacher.dob
                    }" class="required">
                    <select name="gender" id="" class="required">
                      <option value="">--choose gender--</option>
                      <option value="male" ${
                        foundTeacher.gender === "male" ? "selected" : ""
                      }>${
        foundTeacher.gender === "male" ? foundTeacher.gender : "male"
      }</option>
                      <option value="female" ${
                        foundTeacher.gender === "female" ? "selected" : ""
                      }>${
        foundTeacher.gender === "female" ? foundTeacher.gender : "female"
      }</option>
                    </select>
                  </span>
                </div>
                <div class="right">
                  <h3>place of birth & rank <sup>*</sup></h3>
                  <span>
                    <input type="text" name="place-of-birth" value="${
                      foundTeacher.pob
                    }" id="" class="required">
                    <input type="text" id="rank" value="${foundTeacher.rank}" />
                  </span>
                </div>
              </div>
              <!--date of birth and gender end here-->

              <!--subjects taught and address-->
              <div class="phone-identification gender-date" style="gap:1rem;">
                <div class="left">
                  <h3>subjects <sup>*</sup></h3>
                  <span>  
                    <select name="subject-one" id="subject-one" class="required">
                      <option value="">--choose subject--</option>
                      <option value="english" ${
                        foundTeacher.subjectOne === "english" ? "selected" : ""
                      }>${
        foundTeacher.subjectOne === "english"
          ? foundTeacher.subjectOne
          : "english"
      }</option>
                      <option value="kiswahili" ${
                        foundTeacher.subjectOne === "kiswahili"
                          ? "selected"
                          : ""
                      }>${
        foundTeacher.subjectOne === "kiswahili"
          ? foundTeacher.subjectOne
          : "kiswahili"
      }</option>
                      <option value="mathematics" ${
                        foundTeacher.subjectOne === "mathematics"
                          ? "selected"
                          : ""
                      }>${
        foundTeacher.subjectOne === "mathematics"
          ? foundTeacher.subjectOne
          : "mathematics"
      }</option>
                      <option value="chemistry" ${
                        foundTeacher.subjectOne === "chemistry"
                          ? "selected"
                          : ""
                      }>${
        foundTeacher.subjectOne === "chemistry"
          ? foundTeacher.subjectOne
          : "chemistry"
      }</option>
                      <option value="biology" ${
                        foundTeacher.subjectOne === "biology" ? "selected" : ""
                      }>${
        foundTeacher.subjectOne === "biology"
          ? foundTeacher.subjectOne
          : "biology"
      }</option>
                      <option value="physics" ${
                        foundTeacher.subjectOne === "physics" ? "selected" : ""
                      }>${
        foundTeacher.subjectOne === "physics"
          ? foundTeacher.subjectOne
          : "physics"
      }</option>
                      <option value="geography" ${
                        foundTeacher.subjectOne === "geography"
                          ? "selected"
                          : ""
                      }>${
        foundTeacher.subjectOne === "geography"
          ? foundTeacher.subjectOne
          : "geography"
      }</option>
                      <option value="history" ${
                        foundTeacher.subjectOne === "history" ? "selected" : ""
                      }>${
        foundTeacher.subjectOne === "history"
          ? foundTeacher.subjectOne
          : "history"
      }</option>
                      <option value="cre" ${
                        foundTeacher.subjectOne === "cre" ? "selected" : ""
                      }>${
        foundTeacher.subjectOne === "cre" ? foundTeacher.subjectOne : "cre"
      }</option>
                      <option value="business" ${
                        foundTeacher.subjectOne === "business" ? "selected" : ""
                      }>${
        foundTeacher.subjectOne === "business"
          ? foundTeacher.subjectOne
          : "business"
      }</option>
                      <option value="agriculture" ${
                        foundTeacher.subjectOne === "agriculture"
                          ? "selected"
                          : ""
                      }>${
        foundTeacher.subjectOne === "agriculture"
          ? foundTeacher.subjectOne
          : "agriculture"
      }</option>
                      <option value="french" ${
                        foundTeacher.subjectOne === "french" ? "selected" : ""
                      }>${
        foundTeacher.subjectOne === "french"
          ? foundTeacher.subjectOne
          : "french"
      }</option>
                      <option value="computer" ${
                        foundTeacher.subjectOne === "computer" ? "selected" : ""
                      }>${
        foundTeacher.subjectOne === "computer"
          ? foundTeacher.subjectOne
          : "computer"
      }</option>
                    </select>
                    <select name="subject-two" id="subject-two" class="required">
                      <option value="">--choose subject--</option>
                      <option value="english" ${
                        foundTeacher.subjectTwo === "english" ? "selected" : ""
                      }>${
        foundTeacher.subjectTwo === "english"
          ? foundTeacher.subjectTwo
          : "english"
      }</option>
                      <option value="kiswahili" ${
                        foundTeacher.subjectTwo === "kiswahili"
                          ? "selected"
                          : ""
                      }>${
        foundTeacher.subjectTwo === "kiswahili"
          ? foundTeacher.subjectTwo
          : "kiswahili"
      }</option>
                      <option value="mathematics" ${
                        foundTeacher.subjectTwo === "mathematics"
                          ? "selected"
                          : ""
                      }>${
        foundTeacher.subjectTwo === "mathematics"
          ? foundTeacher.subjectTwo
          : "mathematics"
      }</option>
                      <option value="chemistry" ${
                        foundTeacher.subjectTwo === "chemistry"
                          ? "selected"
                          : ""
                      }>${
        foundTeacher.subjectTwo === "chemistry"
          ? foundTeacher.subjectTwo
          : "chemistry"
      }</option>
                      <option value="biology" ${
                        foundTeacher.subjectTwo === "biology" ? "selected" : ""
                      }>${
        foundTeacher.subjectTwo === "biology"
          ? foundTeacher.subjectTwo
          : "biology"
      }</option>
                      <option value="physics" ${
                        foundTeacher.subjectTwo === "physics" ? "selected" : ""
                      }>${
        foundTeacher.subjectTwo === "physics"
          ? foundTeacher.subjectTwo
          : "physics"
      }</option>
                      <option value="geography" ${
                        foundTeacher.subjectTwo === "geography"
                          ? "selected"
                          : ""
                      }>${
        foundTeacher.subjectTwo === "geography"
          ? foundTeacher.subjectTwo
          : "geography"
      }</option>
                      <option value="history" ${
                        foundTeacher.subjectTwo === "history" ? "selected" : ""
                      }>${
        foundTeacher.subjectTwo === "history"
          ? foundTeacher.subjectTwo
          : "history"
      }</option>
                      <option value="cre" ${
                        foundTeacher.subjectTwo === "cre" ? "selected" : ""
                      }>${
        foundTeacher.subjectTwo === "cre" ? foundTeacher.subjectTwo : "cre"
      }</option>
                      <option value="business" ${
                        foundTeacher.subjectTwo === "business" ? "selected" : ""
                      }>${
        foundTeacher.subjectTwo === "business"
          ? foundTeacher.subjectTwo
          : "business"
      }</option>
                      <option value="agriculture" ${
                        foundTeacher.subjectTwo === "agriculture"
                          ? "selected"
                          : ""
                      }>${
        foundTeacher.subjectTwo === "agriculture"
          ? foundTeacher.subjectTwo
          : "agriculture"
      }</option>
                      <option value="french" ${
                        foundTeacher.subjectTwo === "french" ? "selected" : ""
                      }>${
        foundTeacher.subjectTwo === "french"
          ? foundTeacher.subjectTwo
          : "french"
      }</option>
                      <option value="computer" ${
                        foundTeacher.subjectTwo === "computer" ? "selected" : ""
                      }>${
        foundTeacher.subjectTwo === "computer"
          ? foundTeacher.subjectTwo
          : "computer"
      }</option>
                    </select>
                  </span>
                  <h3>classteacher <sup>*</sup></h3>
                   <span>  
                    <select name="class" id="class">
                      <option value="">--select class--</option>
                      <option value="1" ${clas === "1" ? "selected" : ""}>${
        clas === "1" ? "form" + clas : "form1"
      }</option>
                      <option value="2" ${clas === "2" ? "selected" : ""}>${
        clas === "2" ? "form" + clas : "form2"
      }</option>
                      <option value="3" ${clas === "3" ? "selected" : ""}>${
        clas === "3" ? "form" + clas : "form3"
      }</option>
                      <option value="4" ${clas === "4" ? "selected" : ""}>${
        clas === "4" ? "form" + clas : "form4"
      }</option>
                    </select>
                    <select name="stream" id="stream">
                      <option value="">--choose stream--</option>
                      <option value="111" ${
                        stream === "111" ? "selected" : ""
                      }>${
        stream === "111" ? convertStream(stream) : "green"
      }</option>
                      <option value="222" ${
                        stream === "222" ? "selected" : ""
                      }>${
        stream === "222" ? convertStream(stream) : "blue"
      }</option>
                      <option value="333" ${
                        stream === "333" ? "selected" : ""
                      }>${
        stream === "333" ? convertStream(stream) : "red"
      }</option>
                      <option value="444" ${
                        stream === "444" ? "selected" : ""
                      }>${
        stream === "444" ? convertStream(stream) : "purple"
      }</option>
                    </select>
                  </span>
                </div>
                <div class="right">
                <h3>address <sup>*</sup></h3>
                  <span>
                    <textarea name="address" id="">${
                      foundTeacher.address
                    }</textarea>
                  </span>
                </div>
              </div>
              <!--date of birth and gender end here-->

            </div>
          </div>
        </div>

         <div class="lower">
          <div class="head">
            <h2>educational details</h2>
          </div>
          <div class="body">

            <div class="box-one">
              <span>
                <h3>degree <sup>*</sup></h3>
                <input type="text" name="degree" value="${
                  foundTeacher.degree
                }" id="" class="required">
              </span>
              <span>
                <h3>university <sup>*</sup></h3>
                <input type="text" name="university" value="${
                  foundTeacher.university
                }" id="" class="required">
              </span>
            </div>

            <div class="box-one">
              <span>
                <h3>start date</h3>
                <input type="text" value="${
                  foundTeacher.std
                }"  name="start-date" id="" class="">
              </span>
              <span>
                <h3>end date</h3>
                <input type="text" value="${
                  foundTeacher.endDate
                }" name="end-date" id="" class="">
                <input type="hidden" name="department" value="${
                  foundTeacher.department
                }" id="department">
                <input type="hidden" name="teacher-code" value="${
                  foundTeacher.teacherCode
                }" id="teacher-code">
              </span>
            </div>

          </div>
        </div>

         <div class="submit-button-box">
          <button type="reset">reset</button>
          <button class="submit" type="button">submit</button>
        </div>
      `;
      const subjectOne = editForm.querySelector("#subject-one");
      const subjectTwo = editForm.querySelector("#subject-two");
      const allReqiredInputs = editForm.querySelectorAll(".required");
      const inputFile = editForm.querySelector(".text input");
      const submitBtn = editForm.querySelector(".submit-button-box .submit");
      const classSelect = editForm.querySelector("#class");
      const streamSelect = editForm.querySelector("#stream");
      const rank = editForm.querySelector("#rank");
      const departmentInput = editForm.querySelector("#department");
      const teacherCodeInput = editForm.querySelector("#teacher-code");
      
      submitBtn.addEventListener("click" , () => {
        postStudentForm('tenrol.php',allReqiredInputs,editForm,classSelect.value,streamSelect.value,rank.value);
      })
      inputFile.addEventListener("change", uploadProfilePhoto);
      subjectOne.addEventListener("change" , () => {
       const department = assignDepartment(subjectOne.value,subjectTwo.value);
       departmentInput.value = department; //this assigns the department
       let match; // this stores if their is a match
       let newTcode;       
       do{
         newTcode = assingTeacherCode(department); //this section checks if there is a similar tcode and assigns a new one
         match = teachers.find(t => t.teacherCode === newTcode);
       }while(match)

       teacherCodeInput.value = newTcode; 
       updateLessons(foundTeacher.tcode)
      })
      subjectTwo.addEventListener("change" , () => {
       const department = assignDepartment(subjectOne.value,subjectTwo.value);
       departmentInput.value = department;
       let match;
       let newTcode;       
       do{
         newTcode = assingTeacherCode(department);
         match = teachers.find(t => t.teacherCode === newTcode);
       }while(match)

       teacherCodeInput.value = newTcode; 
       updateLessons(foundTeacher.tcode)      
      })
      main.appendChild(editForm);
    } else {
      showErrorMessage("❌ Teacher not found. Please try again.");
    }
  });
}

function verifyInputs(inputs) {
  inputs.forEach((input) => input.classList.remove("errors"));
  let allIsFilled = true;
  inputs.forEach((input) => {
    if (input.value === "") {
      input.classList.add("errors");
      allIsFilled = false;
    }
  });

  if (allIsFilled) {
    return true;
  } else {
    return false;
  }
}

function convertStream(rawStream) {
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
      return "purple";
      break;
    default:
      return "green";
  }
}

function getGenderInitial(gender) {
  if (gender === "male") {
    return "Mr";
  } else if (gender === "female") {
    return "Mrs";
  }
}

function uploadProfilePhoto() {
  if (this.files.length > 0) {
    const uploadedFile = inputFile.files[0];
    if (uploadedFile.type.startsWith("image/")) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        profileImageSrc.setAttribute("src", event.target.result);
      };
      fileReader.readAsDataURL(uploadedFile);
      showSuccessMessage("✅ Profile photo uploaded successfully!");
    } else {
      showErrorMessage("🚫 Please select a valid image file ");
    }
  } else {
    inputFile.value = "";
  }
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
  } else if (technicalSubjects.includes(one) || technicalSubjects.includes(two)) {
    department = "techinals";
  }
  
  return department;
}

function generateSixDigit() {
  return Math.floor(1000 + Math.random() * 9000);
}

function assingTeacherCode(department) {
  let credentials = "";

  switch (department) {
    case "english":
      credentials = "EL";
      break;
    case "mathematics":
      credentials = "MD";
      break;
    case "science":
      credentials = "SD";
      break;
    case "humanities":
      credentials = "HM";
      break;
    case "technicals":
      credentials = "TC";
      break;
    default:
      credentials = "HM";
  }

  const six = generateSixDigit();

  const teacherCode = "T" + "/" + `${credentials}` + "/" + `${six}`;

  return teacherCode;
}

function postStudentForm(url,inputs,editForm,clas,stream,rank) {
  const verified = verifyInputs(inputs);
  if (verified) {
    const formData = new FormData(editForm);
    if(url === 'tenrol.php'){
      formData.append("class" , clas);
      formData.append("stream" , stream);
      formData.append("rank" , rank);
    }
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url , true);
    xhr.onload = () => {
      try {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.type === true) {
            if (response.message === "update success") {
              showSuccessMessage("changes applied succesfully");
              console.log(response.from);
            }
          } else {
            console.log(response.errorInfo);
            showErrorMessage(response.message);
          }
        }
      } catch (error) {
        console.log("Posting Error", error);
      }finally{
        console.log(xhr.responseText)
      }
    };
    xhr.send(formData);
  } else {
    showErrorMessage("⚠️ Please fill in all required fields.");
  }
}

function updateLessons(tcode){
  const xhr = new XMLHttpRequest();
  const data = new FormData();
  data.append("code" , tcode)
  xhr.open('POST' , 'deletelessons.php',true);
  xhr.onload = () => {
    try{
     if(xhr.status == 200){
      const response = JSON.parse(xhr.responseText);
      if(response.type === true){
        showSuccessMessage("lessons deleted succesfully");
      }else{
        showErrorMessage(response.message);
        console.log(response.errorInfo);
      }
     }
    }catch(error){
      console.log("Deletion error" , error);
    }
  }
  xhr.send(data)
}

//errro handling functions
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
displayStudents();

//event listeners
allNavigationButtons[1].addEventListener("click", displayTeachers);
