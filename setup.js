//variables
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

document.addEventListener("DOMContentLoaded", async () => {
  const allTeachers = await getTeachers();
  const allStudents = await getStudents();
  const allParents = await getParents();
  const setup = await getSetup();

  document.querySelector(".student-count").textContent = allStudents.length;
  document.querySelector(".teacher-count").textContent = allTeachers.length;
  document.querySelector(".parent-count").textContent = allParents.length;
  document.querySelector(".badge img").setAttribute("src", setup[0].badge);
  document.querySelector(".text h1").textContent = setup[0].schoolName;
  document.querySelector(".text h2").textContent = setup[0].adress;

  const other = document.querySelectorAll(".term-student-upgrade .box");

  other.forEach((box) => {
    box.style.opacity = "1";
    box.style.transform = "translateY(0)";
  });
});

//document variables
const setupButtons = Array.from(document.querySelectorAll(".links .box"));
const subjectContainer = document.querySelector(".subject-container");
const classContainer = document.querySelector(".class-container");
const streamContainer = document.querySelector(".stream-container");
const backBtn = document.querySelector(".btn-section .back");
const applyBtn = document.querySelector(".btn-section .apply");
let mode;
let subjectSpans = [];
let classSpans = [];
let streamSpans = [];
const delay = 0.3; //aniamtion delay

const progressContainer = document.getElementById("container");
const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");

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

async function getSliders() {
  showLoader("feching slishow values,please wait");
  const user = await getUser();
  try {
    const response = await fetch("getSlidesho.php", {
      method: "POST",
    });
    const result = await response.json();
    const thisSchool = result.filter((s) => s.schoolId === user.schoolId);
    return thisSchool;
  } catch (error) {
  } finally {
    removeLoader();
  }
}

//function to get teacher lessons
async function getLessons(code) {
  const user = await getUser();
  showLoader("fetching teacher lessons...");
  try {
    const response = await fetch("lesson.php", {
      method: "POST",
    });
    const result = await response.json();
    const thisSchool = result.filter(
      (t) => t.schoolId === user.schoolId && t.teacherCode === code
    );
    return thisSchool;
  } catch (error) {
    console.log("lessons error", error);
  } finally {
    removeLoader();
  }
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

async function getParents() {
  const user = await getUser();
  showLoader("fetching teachers,please wait...");
  try {
    const response = await fetch("parents.php", {
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

/* main function start here*/

//subject setup functions start here

async function displaySavedLessons(type = false) {
  mode = "subject setup";
  backBtn.parentElement.style.display = "flex"; //show back and save buttons;
  const setup = await getSetup();
  const schoolSubjects = setup[0].subjects; //load subjects from database
  const subjectSetup = await getSubjectSetup(schoolSubjects);

  if (type) hideAllChildren("subject-container");

  const h1 = document.createElement("h1");
  h1.textContent = "my subjects";
  subjectContainer.appendChild(h1);

  for (const [category, subject] of Object.entries(subjectSetup)) {
    //this lopps through each category
    const categoryBox = document.createElement("div");
    categoryBox.className = "category"; //create ctegory box

    const h2 = document.createElement("h2");
    h2.textContent = category; //diaply tthe category in a h2 tag

    const body = document.createElement("div");
    body.className = "body"; //the body to hold every class span

    subject.forEach((subj, idx) => {
      //lopp through eac subject and diplay it
      try {
        const span = document.createElement("span");
        span.dataset.text = `${subj}/${getReverseCategory(category)}`;
        span.id = "span" + category + idx;

        //initial span styles
        span.style.opacity = "0";
        span.style.transform = "scale(.5)";
        span.style.transitionDelay = `${delay * idx}s`;

        span.innerHTML = `
          <i class="fa fa-pen"></i>
          <i class="fa-solid fa-calculator"></i>
          <h3>${subj}</h3>
       `;

        body.appendChild(span);

        if (!subjectSpans.some((spn) => spn.id === span.id)) {
          subjectSpans.push(span);
        }

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            span.style.opacity = "1";
            span.style.transform = "scale(1)";
          });
        });

        const editIcon = span.querySelector(".fa-pen");
        editIcon.addEventListener("click", (e) => {
          e.stopPropagation();
          editSpan(span);
        });

        span.addEventListener("dblclick", (e) => {
          e.stopPropagation();
          deleteSpan(span, true);
        });
      } catch (error) {
        console.log("error inserting span", error);
      }
    });

    const addSpan = document.createElement("span");
    addSpan.className = "subject";
    addSpan.innerHTML = "<i class='fa fa-add'></i>";
    body.appendChild(addSpan);

    addSpan.querySelector(".fa-add").addEventListener("click", (e) => {
      e.stopPropagation();
      addNewSpan(body, category);
    });

    categoryBox.appendChild(h2);
    categoryBox.appendChild(body);
    subjectContainer.appendChild(categoryBox);
  }
}

//subject accesory functions

async function getSubjectSetup(subjects) {
  const rawSubjectArr = subjects.split("-"); //gets raw subject arry console it for more visula info
  const subjectSetup = {};

  rawSubjectArr.forEach((rawSubject) => {
    const [subject, cat] = rawSubject.split("/");
    const category = subjectCategory(cat);
    if (!subjectSetup[category]) subjectSetup[category] = [];
    subjectSetup[category].push(subject);
  });
  return subjectSetup;
}

//functiont get subject category
function subjectCategory(category) {
  switch (category) {
    case "c":
      return "compulsory / language";
    case "s":
      return "science";
    case "t":
      return "technicals";
    case "h":
      return "humanities";
    default:
      return "uncategorised";
  }
}

//function getReverse subject category
function getReverseCategory(category) {
  switch (category) {
    case "compulsory / language":
      return "c";
    case "science":
      return "science";
    case "technicals":
      return "t";
    case "humanities":
      return "h";
    default:
      return "u";
  }
}

//subject fuction cals
setupButtons[0].addEventListener("click", () => {
  displayClassSetup();
  displayStreamSetup();
  displaySavedLessons(true);
});

//subject setup function end here

//class setup function start here
let classSetup;

const toggleIcon = classContainer.querySelector(".mode i");

function handleClassModes() {
  classContainer.querySelector(".clases-div").innerHTML = "";
  classSpans = [];
  if (toggleIcon.classList.contains("fa-toggle-off")) {
    classSetup = {
      preprimary: ["playgroup", "pp1", "pp2"],
      lowerprimary: [
        "grade 1",
        "grade 2",
        "grade 3",
        "grade 4",
        "grade 5",
        "grade 6",
      ],
      juniorsecondary: ["grade 7", "grade 8", "grade 9"],
      seniorsecondary: ["grade 10", "grade 11", "grade 12"],
      system: "n",
    };
    toggleIcon.classList.add("fa-toggle-on");
    toggleIcon.classList.remove("fa-toggle-off");
    displayClassSetup();
  } else if (toggleIcon.classList.contains("fa-toggle-on")) {
    classSetup = {
      highschool: ["form1", "form2", "form3", "form4"],
      system: "0",
    };
    toggleIcon.classList.remove("fa-toggle-on");
    toggleIcon.classList.add("fa-toggle-off");
    displayClassSetup();
  }
}

async function displayClassSetup(type = false) {
  const schoolSetup = await getSetup();
  const rawClasses = schoolSetup[0].clases;

  if (!classSetup) classSetup = getClassSetup(rawClasses);

  if (type) hideAllChildren("class-container .clases-div");
  if (type) classContainer.style.display = "flex";

  updateSystem(classSetup.system);

  for (const [category, classes] of Object.entries(classSetup)) {
    if (category !== "system") {
      //this lopps through each category
      const categoryBox = document.createElement("div");
      categoryBox.className = "category"; //create ctegory box

      const h2 = document.createElement("h2");
      h2.textContent = category; //diaply tthe category in a h2 tag

      const body = document.createElement("div");
      body.className = "body"; //the body to hold every class span

      classes.forEach((classValue, idx) => {
        try {
          const span = document.createElement("span");
          span.dataset.text = `${classValue}/${
            classSetup.system
          }/${getReverseClassCategory(category)}`;
          span.id = "span" + category + idx;

          //initial span styles
          span.style.opacity = "0";
          span.style.transform = "scale(.5)";
          span.style.transitionDelay = `${delay * idx}s`;

          span.innerHTML = `
          <i class="fa fa-pen"></i>
          <i class="fa-solid fa-calculator"></i>
          <h3>${classValue}</h3>
       `;

          body.appendChild(span);

          if (!classSpans.some((spn) => spn.id === span.id)) {
            classSpans.push(span);
          }

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              span.style.opacity = "1";
              span.style.transform = "scale(1)";
            });
          });

          const editIcon = span.querySelector(".fa-pen");
          editIcon.addEventListener("click", (e) => {
            e.stopPropagation();
            editSpan(span, "class");
          });
        } catch (error) {
          console.log("error class inserting span", error);
        }
      });
      categoryBox.appendChild(h2);
      categoryBox.appendChild(body);
      classContainer.querySelector(".clases-div").appendChild(categoryBox);
    }
  }
}

function getClassSetup(rawClases) {
  const rawClassArr = rawClases.split("-"); //get the raw class array log it for more info
  const classSetup = {};
  for (const rawClass of rawClassArr) {
    const [classValue, system, cat] = rawClass.split("/");
    //the classvalue the system(old or new) and the class caategory
    const category = getClassCateogory(cat);
    classSetup["system"] = system; //displays the system
    if (!classSetup[category]) classSetup[category] = [];

    classSetup[category].push(classValue);
  }
  return classSetup;
}

toggleIcon.addEventListener("click", handleClassModes);

function updateSystem(system) {
  const icon = classContainer.querySelector(".mode i");
  if (system === "n") {
    icon.classList.add("fa-toggle-on");
    icon.classList.remove("fa-toggle-off");
  } else if (system === "0") {
    icon.classList.remove("fa-toggle-on");
    icon.classList.add("fa-toggle-off");
  }
}

//class accesory function start here
function getClassCateogory(category) {
  switch (category) {
    case "pp":
      return "preprimary";
    case "p":
      return "upperprimary";
    case "j":
      return "juniorsecondary";
    case "s":
      return "seniorsecondary";
    case "h":
      return "highschool";
    default:
      return "uncategorised";
  }
}

function getReverseClassCategory(category) {
  switch (category) {
    case "preprimary":
      return "pp";
    case "upperprimary":
      return "p";
    case "juniorsecondary":
      return "j";
    case "seniorsecondary":
      return "s";
    case "highschool":
      return "h";
    default:
      return "u";
  }
}
//class accesory function end here

//class setup event listeners
setupButtons[1].addEventListener("click", () => {
  displaySavedLessons();
  displayStreamSetup();
  displayClassSetup(true);
});

//class setup function end here

//stream functions start here
async function displayStreamSetup(type = false) {
  const schoolSetup = await getSetup();
  const myStreams = getStream(schoolSetup[0].streams);
  const clases = getClass(schoolSetup[0].clases);
  let streamSetup;

  if (type) hideAllChildren("stream-container");

  if (Object.entries(getStreamSetup(myStreams)).length === 0) {
    streamSetup = await getDefaultStreamSetup();
  } else if (
    !clases.includes(Object.entries(getStreamSetup(myStreams))[0][0])
  ) {
    streamSetup = await getDefaultStreamSetup();
  } else {
    streamSetup = getStreamSetup(myStreams);
  }

  console.log(streamSetup);

  for (const [category, classObject] of Object.entries(streamSetup)) {
    //this lopps through each category
    const categoryBox = document.createElement("div");
    categoryBox.className = "stream-category"; //create ctegory box

    const h2 = document.createElement("h2");
    h2.textContent = category; //diaply tthe category in a h2 tag

    const body = document.createElement("div");
    body.className = "body"; //the body to hold every class span

    for (const [classValue, streams] of Object.entries(classObject)) {
      const classSpan = document.createElement("span");
      const classDisplay = document.createElement("div"); //this diaplys the class
      classDisplay.className = "head";
      classDisplay.innerHTML = `
        <i class="fa fa-chalkboard"></i>
        <h3>${classValue}</h3>
      `;

      classSpan.id = `${category}-${classValue}`;

      const streamDiv = document.createElement("div");
      streamDiv.className = "streams"; //this is going to hold every particular stream span element;
      streams.forEach((stream, idx) => {
        try {
          const span = document.createElement("span");
          classSpan.dataset.text = `${classValue}:${streams.join("/")}`;

          if (!streamSpans.some((span) => span.id === classSpan.id)) {
            streamSpans.push(classSpan);
          }

          //initial span styles for a smooth transition
          span.style.opacity = "0";
          span.style.transform = "scale(.5)";
          span.style.transitionDelay = `${delay * idx}s`;

          span.innerHTML = `
           <i class="fa fa-pen"></i>
           <h4>${stream}</h4>
         `;
          streamDiv.appendChild(span);

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              span.style.opacity = "1";
              span.style.transform = "scale(1)";
            });
          });

          const editIcon = span.querySelector(".fa-pen");
          editIcon.addEventListener("click", (e) => {
            e.stopPropagation();
            editStreamSpan(span, classSpan);
          });

          span.addEventListener("dblclick", (e) => {
            e.stopPropagation();
            deleteStreamSpan(span, classSpan);
          });
        } catch (error) {
          console.log("stream manufacturing error", error);
        }
      });

      const addSpan = document.createElement("span");
      addSpan.className = "subject";
      addSpan.innerHTML = "<i class='fa fa-add'></i>";
      streamDiv.appendChild(addSpan);
      classSpan.appendChild(classDisplay); //append it to the class span element
      classSpan.appendChild(streamDiv);
      body.appendChild(classSpan);

      addSpan.querySelector(".fa-add").addEventListener("click", (e) => {
        e.stopPropagation();
        addStreamSpan(streamDiv, classSpan);
      });
    }

    categoryBox.appendChild(h2);
    categoryBox.appendChild(body);
    streamContainer.appendChild(categoryBox);
  }
}

async function getDefaultStreamSetup() {
  const setup = await getSetup();
  const classes = await getClass(setup[0].clases);
  const streams = ["green", "red", "blue", "purple"];
  const streamSetup = {};

  for (const classValue of classes) {
    const [classVal, system, cat] = classValue.split("/");
    const category = findCategory(classVal);
    if (!streamSetup[category]) streamSetup[category] = {};
    if (!streamSetup[category][classValue])
      streamSetup[category][classValue] = [];

    streams.forEach((stream) => {
      if (!streamSetup[category][classValue].some((str) => str === stream)) {
        streamSetup[category][classValue].push(stream);
      }
    });
  }

  return streamSetup;
}

function getStreamSetup(streams) {
  const streamSetup = {};

  for (const [classValue, streamArr] of Object.entries(streams)) {
    const category = findCategory(classValue);
    if (!streamSetup[category]) streamSetup[category] = {};
    streamSetup[category][classValue] = streamArr;
  }

  return streamSetup;
}

function findCategory(classValue) {
  const classSetup = {
    preprimary: ["playgroup", "pp1", "pp2"],
    lowerprimary: [
      "grade 1",
      "grade 2",
      "grade 3",
      "grade 4",
      "grade 5",
      "grade 6",
    ],
    juniorsecondary: ["grade 7", "grade 8", "grade 9"],
    seniorsecondary: ["grade 10", "grade 11", "grade 12"],
    highschool: ["form 1", "form 2", "form 3", "form 4"],
  };
  for (const [category, classes] of Object.entries(classSetup)) {
    if (classes.includes(classValue)) {
      return category;
    }
  }
  return "uncategorised";
}

//stream accesory functions
let addedStreams = 0;
async function addStreamSpan(parent, classSpan) {
  mode = "edit mode";
  const setup = await getSetup();
  const allStreams = getStream(setup[0].streams);

  const [classValue, stream] = classSpan.dataset.text.trim().split(":");

  const defaultStreams = stream.split("/");
  const span = document.createElement("span");
  if (defaultStreams.length + addedStreams === 6) {
    showErrorMessage("maximum number of streams per class is 6");
    span.remove();
    return;
  }

  const input = document.createElement("input");
  span.style.opacity = "0";
  span.style.transform = "scale(0)";
  input.value = "stream" + (defaultStreams.length + addedStreams + 1);
  span.appendChild(input);

  const lastChild = parent.lastElementChild;

  parent.insertBefore(span, lastChild);

  input.focus();

  input.addEventListener("change", () => {
    const foundSubj = defaultStreams.find((subj) => subj === input.value);
    if (foundSubj) {
      showErrorMessage("one cannot add an existing stream");
      return;
    }
    defaultStreams.push(input.value);
    classSpan.dataset.text = `${classValue}:${defaultStreams.join("/")}`;
    span.innerHTML = `
      <i class="fa fa-pen"></i>
      <h3>${input.value}</h3>
    `;
    input.remove();
    const editicon = span.querySelector(".fa-pen");
    editicon.addEventListener("click", () => {
      editStreamSpan(span, classSpan);
    });
  });

  requestAnimationFrame(() => {
    span.style.opacity = "1";
    span.style.transform = "scale(1)";
  });

  span.addEventListener("dblclick", () => {
    deleteStreamSpan(span, classSpan);
  });

  addedStreams++;
}

function editStreamSpan(span, classSpan) {
  mode = "edit mode";
  const streamValue = span.textContent.trim();
  const [classValue, stream] = classSpan.dataset.text.trim().split(":");
  const streamArr = stream.split("/");
  const index = streamArr.indexOf(streamValue);

  const input = document.createElement("input");
  input.value = streamValue;
  span.innerHTML = "";
  span.appendChild(input);
  input.focus();

  input.addEventListener("change", () => {
    const existingStream = streamArr.find((str) => str === input.value);
    if (existingStream) {
      showErrorMessage("one cannot add an existing stream");
      return;
    } else {
      streamArr.splice(index, 1, input.value);
      classSpan.dataset.text = `${classValue}:${streamArr}`;
      input.remove();
      span.innerHTML = `
        <i class='fa fa-pen'></i>
        <h3>${input.value}</h3>
      `;

      const editIcon = span.querySelector(".fa-pen");
      editIcon.addEventListener("click", () => {
        editStreamSpan(span, classSpan);
      });
    }
  });
}

function deleteStreamSpan(span, classSpan) {
  span.style.transform = "rotate(360deg) scale(.1)";
  span.style.opacity = "0";
  const streamvalue = span.textContent.trim();

  const [classValue, stream] = classSpan.dataset.text.trim().split(":");

  const defaultStreams = stream.split("/");
  const index = defaultStreams.indexOf(streamvalue);

  if (index === -1) {
    showErrorMessage("error deleting stream");
    return;
  }

  defaultStreams.splice(index, 1);

  classSpan.dataset.text = `${classValue}:${defaultStreams.join("/")}`;

  setTimeout(() => {
    span.style.display = "none";
    showSuccessMessage("stream removed succesfully");
  }, 500);
}

//event listeners
setupButtons[2].addEventListener("click", () => {
  displayStreamSetup(true);
  displaySavedLessons();
  displayClassSetup();
});

//stream functions end here

//admisn and h.o.ds functions start here

async function displayHeadOfDepartments() {
  const allTeachers = await getTeachers();
  const user = await getUser();
  const subjects = await mySubjects();
  applyBtn.style.display = "none";

  hideAllChildren("department-container");
  const adminUsers = allTeachers.filter((t) => t.rank === "admin"); //to filter out dmin users
  const hodUsers = allTeachers.filter((t) => {
    const [head, subject] = t.rank.split("-");

    return head === "H.O.D";
  }); //tofilter out head of departmeans teachers
  const normalTeachers = allTeachers.filter((t) => {
    const [head] = t.rank.split("-");
    return t.rank !== "admin" && head !== "H.O.D";
  }); //to filter out notrmal teachers

  const categoryBox = document.createElement("div");
  categoryBox.className = "teachers";
  const h2 = document.createElement("h2");
  h2.textContent = "my admin users";
  categoryBox.appendChild(h2);
  const teacherCont = document.createElement("div");
  teacherCont.className = "teacher-container";
  for (const [index, teacher] of adminUsers.entries()) {
    const teacherDiv = document.createElement("div");
    teacherDiv.className = "boxes";
    //initial styles
    teacherDiv.style.opacity = "0";
    teacherDiv.style.transform = "scale(.6)";
    teacherDiv.style.transitionDelay = `${delay * index}s`;

    const profileImage = teacher.profileImage || "./teachers/profileimage.png";
    const subjectOneIdx = myDefaultSubjects.indexOf(teacher.subjectOne);
    const subjectTwoIdx = myDefaultSubjects.indexOf(teacher.subjectTwo);
    const myLessons = await getLessons(teacher.teacherCode);

    let rank;

    if (user.code === teacher.teacherCode) {
      rank = `${teacher.rank} (me)`;
    } else {
      rank = teacher.rank;
    }

    teacherDiv.innerHTML = `
      <div class="upper">
        <div class="image">
         <img src="${profileImage}" alt="${teacher.firstname}">
       </div>
      </div>
      <div class="lower">
        <h3 class="name">${teacher.firstname} ${teacher.middlename}</h3>
        <p>${rank}</p>
        <div class="subjects">
            <span>${subjects[subjectOneIdx]}</span>
            <span>${subjects[subjectTwoIdx]}</span>
        </div>
            <h4>teaching ${myLessons.length} lessons</h4>
      </div>
      <i style="display:none;" class="fas fa-check"></i>
    `;

    teacherCont.appendChild(teacherDiv);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        teacherDiv.style.opacity = "1";
        teacherDiv.style.transform = "scale(1)";
      });
    });

    teacherDiv.addEventListener("dblclick", () => {
      if (user.code === teacher.teacherCode) {
        showErrorMessage("one cannot delete himself");
        return;
      }

      teacherDiv.style.opacity = "0";
      teacherDiv.style.transform = "rotate(360deg) scale(.2)";

      setTimeout(async () => {
        teacherDiv.style.display = "none";
        const res = await postTeacherChanges(teacher.teacherCode, "normal");
        if (res.type) {
          showSuccessMessage("changes saved succesfully");
          displayHeadOfDepartments();
        }
      }, 1000);
    });
  }
  categoryBox.appendChild(teacherCont);
  document.querySelector(".department-container").appendChild(categoryBox);

  //tis is  to display head teachers
  const categoryBoxs = document.createElement("div");
  categoryBoxs.className = "teachers";
  const h2s = document.createElement("h2");
  h2s.textContent =
    "my H.O.D users " +
    ((hodUsers.length / subjects.length) * 100).toFixed(1) +
    "%";
  categoryBoxs.appendChild(h2s);
  const teacherConts = document.createElement("div");
  teacherConts.className = "teacher-container";

  for (const [index, teacher] of hodUsers.entries()) {
    const teacherDiv = document.createElement("div");
    teacherDiv.className = "boxes";
    //initial styles
    teacherDiv.style.opacity = "0";
    teacherDiv.style.transform = "scale(.6)";
    teacherDiv.style.transitionDelay = `${delay * index}s`;

    const profileImage = teacher.profileImage || "./teachers/profileimage.png";
    const subjectOneIdx = myDefaultSubjects.indexOf(teacher.subjectOne);
    const subjectTwoIdx = myDefaultSubjects.indexOf(teacher.subjectTwo);
    const myLessons = await getLessons(teacher.teacherCode);

    let rank;

    if (user.code === teacher.teacherCode) {
      rank = `${teacher.rank} (me)`;
    } else {
      rank = teacher.rank;
    }

    teacherDiv.innerHTML = `
      <div class="upper">
        <div class="image">
         <img src="${profileImage}" alt="${teacher.firstname}">
       </div>
      </div>
      <div class="lower">
        <h3 class="name">${teacher.firstname} ${teacher.middlename}</h3>
        <p>${rank}</p>
        <div class="subjects">
            <span>${subjects[subjectOneIdx]}</span>
            <span>${subjects[subjectTwoIdx]}</span>
        </div>
            <h4>teaching ${myLessons.length} lessons</h4>
      </div>
      <i style="display:none;" class="fas fa-check"></i>
    `;

    teacherConts.appendChild(teacherDiv);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        teacherDiv.style.opacity = "1";
        teacherDiv.style.transform = "scale(1)";
      });
    });

    teacherDiv.addEventListener("dblclick", () => {
      const options = document.createElement("div");
      teacherDiv.style.maxHeight = "none";
      teacherDiv.style.height = "fit-content";
      options.className = "options";
      options.innerHTML = `
        <button type='button' class='normal'>normal</button>
        <button type='button' class='admin'>admin</button>
      `;
      const lower = teacherDiv.querySelector(".lower");
      lower.appendChild(options);

      const normalBtn = options.querySelector(".normal");
      normalBtn.addEventListener("click", () => {
        //function to normalise head teacher
        teacherDiv.style.transform = "scale(.5)";
        teacherDiv.style.opacity = "0";

        setTimeout(async () => {
          teacherDiv.style.display = "none";
          const res = await postTeacherChanges(teacher.teacherCode, "normal");

          if (res.type) {
            showSuccessMessage("changes saved succefully");
            displayHeadOfDepartments();
          }
        }, 1000);
      });

      const adminBtn = options.querySelector(".admin");
      adminBtn.addEventListener("click", () => {
        teacherDiv.style.transform = "scale(1.3)";

        setTimeout(async () => {
          teacherDiv.style.display = "none";
          const res = await postTeacherChanges(teacher.teacherCode, "admin");

          if (res.type) {
            showSuccessMessage("changes saved succefully");
            displayHeadOfDepartments();
          }
        }, 1000);
      });
    });
  }

  categoryBoxs.appendChild(teacherConts);
  document.querySelector(".department-container").appendChild(categoryBoxs);

  //tis is  to display normal teachers
  const categoryBox2 = document.createElement("div");
  categoryBox2.className = "teachers";
  const h22 = document.createElement("h2");
  h22.textContent = "my normal teacers";
  categoryBox2.appendChild(h22);
  const teacherCont2 = document.createElement("div");
  teacherCont2.className = "teacher-container";

  for (const [index, teacher] of normalTeachers.entries()) {
    const teacherDiv = document.createElement("div");
    teacherDiv.className = "boxes";
    //initial styles
    teacherDiv.style.opacity = "0";
    teacherDiv.style.transform = "scale(.6)";
    teacherDiv.style.transitionDelay = `${delay * index}s`;

    const profileImage = teacher.profileImage || "./teachers/profileimage.png";
    const subjectOneIdx = myDefaultSubjects.indexOf(teacher.subjectOne);
    const subjectTwoIdx = myDefaultSubjects.indexOf(teacher.subjectTwo);
    const myLessons = await getLessons(teacher.teacherCode);

    let rank;

    if (user.code === teacher.teacherCode) {
      rank = `${teacher.rank} (me)`;
    } else {
      rank = teacher.rank;
    }

    teacherDiv.innerHTML = `
      <div class="upper">
        <div class="image">
         <img src="${profileImage}" alt="${teacher.firstname}">
       </div>
      </div>
      <div class="lower">
        <h3 class="name">${teacher.firstname} ${teacher.middlename}</h3>
        <p>${rank}</p>
        <div class="subjects">
            <span>${subjects[subjectOneIdx]}</span>
            <span>${subjects[subjectTwoIdx]}</span>
        </div>
            <h4>teaching ${myLessons.length} lessons</h4>
      </div>
      <i style="display:none;" class="fas fa-check"></i>
    `;

    teacherCont2.appendChild(teacherDiv);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        teacherDiv.style.opacity = "1";
        teacherDiv.style.transform = "scale(1)";
      });
    });

    teacherDiv.addEventListener("dblclick", () => {
      const options = document.createElement("div");
      teacherDiv.style.maxHeight = "none";
      teacherDiv.style.height = "fit-content";
      options.className = "options";
      options.innerHTML = `
        <button type='button' class='subject'>H.O.D-${subjects[subjectOneIdx]}</button>
        <button type='button' class='subject'>H.O.D-${subjects[subjectTwoIdx]}</button>
        <button type='button' class='admin'>admin</button>
      `;
      const lower = teacherDiv.querySelector(".lower");
      lower.appendChild(options);

      const adminBtn = options.querySelector(".admin");
      adminBtn.addEventListener("click", () => {
        teacherDiv.style.transform = "scale(1.3)";

        setTimeout(async () => {
          teacherDiv.style.display = "none";
          const res = await postTeacherChanges(teacher.teacherCode, "admin");

          if (res.type) {
            showSuccessMessage("changes saved succefully");
            displayHeadOfDepartments();
          }
        }, 1000);
      });

      const subjectBtns = Array.from(options.querySelectorAll(".subject"));
      for (const btn of subjectBtns) {
        btn.addEventListener("click", () => {
          const foundHead = allTeachers.find((t) => {
            const [head, subject] = t.rank.split("-");
            return subject === btn.textContent.trim().split("-")[1];
          });

          teacherDiv.style.transform = "scale(1.4)";

          setTimeout(async () => {
            teacherDiv.style.display = "none";
            const res = await postTeacherChanges(
              teacher.teacherCode,
              `H.O.D-${btn.textContent.trim().split("-")[1]}`
            );
            if (res.type) {
              if (foundHead) {
                const res2 = await postTeacherChanges(
                  foundHead.teacherCode,
                  "normal"
                );
                if (res2.type) {
                  showSuccessMessage("updated subject head succesfully");
                }
              } else {
                showErrorMessage("subject head added succesfully");
              }
            }
          }, 1500);
        });
      }
    });
  }

  categoryBox2.appendChild(teacherCont2);
  document.querySelector(".department-container").appendChild(categoryBox2);
}

setupButtons[3].addEventListener("click", displayHeadOfDepartments);

//layout functions start here
const layoutCont = document.querySelector(".main-page-editing");
async function displaySchoolLayout() {
  const setup = await getSetup();
  const layout = setup[0].layout;
  const layoutSetup = getLayoutCategory(layout);

  hideAllChildren("main-page-editing", true);

  await showAllSliders();

  const schoolInfoDivs = Array.from(
    layoutCont.querySelectorAll(".school-name textarea")
  );
  const schoolLinkDivs = Array.from(
    layoutCont.querySelectorAll(".social-media-div input")
  );

  for (const info of layoutSetup.info) {
    const textArea = schoolInfoDivs.find(
      (tArea) => tArea.id === info.split("-")[0]
    );
    if (textArea) {
      textArea.value = info.split("-")[1];
    }
  }

  for (const link of layoutSetup.links) {
    const input = schoolInfoDivs.find(
      (tArea) => tArea.className === link.split("-")[0]
    );
    if (input) {
      input.value = link.split("-")[1];
    }
  }
}

let slideShow;
async function showAllSliders() {
  mode = "layout mode";
  const sliders = await getSliders();
  slideShow = sliders.filter((slide) => slide.type === "slider");
  const slideHead = sliders.filter((slide) => slide.type === "head");
  showSlideShow(slideShow);
  sliderInterval = setInterval(() => {
    showSlideShow(slideShow);
  }, 4000);
}

//left document
const left = layoutCont.querySelector(".slideshow-container .left .body");
const leftImage = left.querySelector(".image");
//right part of the slideshow
const right = layoutCont.querySelector(".slideshow-container .right");
const rightImage = right.querySelector(".slide-show-box");
const imageText = right.querySelector(".dots h3");
const tittle = left.querySelector(".tittle");
const desc = left.querySelector(".desc");
const dotsSection = document.querySelector(".dots-section");
const text = document.querySelector(".right .text");

const newSlider = document.getElementById("new-slide");
const deleteSlider = document.querySelector(".head .delete");
const removeSlider = document.querySelector(".btn .remove");
const applySlider = document.querySelector(".btn .apply");
let sliderInterval;
let slideshowId;
let currentSliderIndex = 0;
function showSlideShow(slideShows) {
  if (slideShows.length === 0) {
    leftImage.style.backgroundImage = `url(./subjects/noresultfour.jpeg)`;
    rightImage.style.backgroundImage = `url(./subjects/noresultfour.jpeg)`;
    imageText.textContent = "no sliders were found";

    requestAnimationFrame(() => {
      leftImage.style.transform = "translateY(0)";
      rightImage.style.transform = "translateY(0)";
      leftImage.style.opacity = "1";
      rightImage.style.opacity = "1";
    });

    return;
  }

  if (currentSliderIndex >= slideShows.length) {
    currentSliderIndex = 0;
  }

  const currentSlider = slideShows[currentSliderIndex];
  dotsSection.innerHTML = "";
  for (const [index, span] of slideShows.entries()) {
    const dot = document.createElement("span");
    dotsSection.appendChild(dot);

    dot.addEventListener("click", () => {
      clearInterval(sliderInterval);
      currentSliderIndex = index;
      showSlideShow(slideShow);
      setInterval(() => {
        showSlideShow(slideShow);
      }, 4000);
    });
  }

  Array.from(dotsSection.children)[currentSliderIndex].classList.add("active");

  // 1. Set hidden state first
  leftImage.style.transform = "translateY(100%)";
  rightImage.style.transform = "translateY(100%)";
  leftImage.style.opacity = "0";
  rightImage.style.opacity = "0";

  // 2. Force a reflow so browser "commits" the hidden state
  void leftImage.offsetWidth;

  // 3. Now update content
  leftImage.style.backgroundImage = `url(${currentSlider.img})`;
  rightImage.style.backgroundImage = `url(${currentSlider.img})`;
  tittle.value = currentSlider.h2;
  desc.value = currentSlider.p;
  slideshowId = currentSlider.id;
  imageText.textContent = "image " + (currentSliderIndex + 1);
  text.innerHTML = `
    <h3>${currentSlider.h2}</h3>
    <p>${currentSlider.p}</p>
  `;

  currentSliderIndex++;

  // 4. Trigger animation back in
  requestAnimationFrame(() => {
    leftImage.style.transform = "translateY(0)";
    rightImage.style.transform = "translateY(0)";
    leftImage.style.opacity = "1";
    rightImage.style.opacity = "1";
    text.style.opacity = "1";
    text.style.transform = "translateY(0) scale(1)";
  });
}

//layout accesoory funcions

function getLayoutCategory(rawLayout) {
  const [schoolInfo, schoolLinks] = rawLayout.split("&");
  const schoolInfoArr = schoolInfo.split("/")[1].split(":");
  const schoolLisnks = schoolLinks.split("/")[1].split(":");
  return {
    info: schoolInfoArr,
    links: schoolLinks,
  };
}

function readFile(input) {
  if (input.files.length > 0) {
    const file = input.files[0];
    const fileType = file.type;

    if (!fileType.startsWith("image/")) {
      showErrorMessage("a non-image file detected");
      return false;
    }

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const result = e.target.result;
      leftImage.style.backgroundImage = `url(${result})`;
      rightImage.style.backgroundImage = `url(${result})`;
    };

    fileReader.readAsDataURL(file);
    return true;
  } else {
    showErrorMessage("error loading file");
    newSlider.value = "";
    return false;
  }
}

//event listeners
newSlider.addEventListener("change", () => {
  clearInterval(sliderInterval);
  const status = readFile(newSlider);
  if (status) {
    deleteSlider.style.display = "none";
    deleteSlider.previousElementSibling.style.display = "none";
    removeSlider.parentElement.style.display = "flex";
  }
});

applySlider.addEventListener("click", async () => {
  const filled = validateTermInputs([tittle, desc]);
  const descLength = desc.value.trim().split("");
  const tittleLength = desc.value.trim().split("");
  text.style.opacity = "0";
  text.style.transform = "translateY(100%)";

  if (filled) {
    if (tittleLength.length < 10) {
      showErrorMessage("tittle length should be above 40");
      tittle.focus();
      return;
    } else if (descLength.length < 60) {
      showErrorMessage("description length should be above 60");
      desc.focus();
      return;
    } else {
      const res = await postSlider(
        tittle,
        desc,
        "slider",
        slideshowId,
        "update"
      );
      if (res.type) {
        showSuccessMessage("changes saved succesfully");
      } else {
        showErrorMessage("error saving changes");
      }
    }
  } else {
    showErrorMessage("please fill in all required fields");
  }
});

document.getElementById("new-slide-label").addEventListener("click", () => {
  tittle.value = "";
  slideshowId = "";
  desc.value = "";
  clearInterval(sliderInterval);
});

document.getElementById("change").addEventListener("click", () => {
  clearInterval(sliderInterval);
  setTimeout(() => {
    showSlideShow(slideShow);
  }, 5000);
});

document.querySelector(".head .delete").addEventListener("click", async () => {
  document.querySelector(".head .delete").disabled = "true";
  clearInterval(sliderInterval);
  const res = await deleteSliderz();
  if (res.type) {
    showSuccessMessage("slider deleted succesfully");
    showAllSliders();
  }
});

setupButtons[4].addEventListener("click", () => {
  displaySavedLessons();
  displayClassSetup();
  displayStreamSetup();
  displaySchoolLayout();
});

//layout functions end here

//deaoertment accesory functions
function showMessage(message, icon, btnMessage) {
  const messageBox = document.createElement("div");
  messageBox.className = "department-message";
  messageBox.style.opacity = "1";
  messageBox.style.opacity = "scale{1}";
  messageBox.innerHTML = `
     <div class="box">
       <div class="icon">
         <i class="fas ${icon}"></i>
       </div>
       <div class="text">
         <h3>${message}</h3>
       </div>
       <div class="box-btn">
          <button type="button" class="continue">${btnMessage} <i class="fas fa-rocket"></i></button>
       </div>
     </div>    
  `;

  const btn = messageBox.querySelector(".continue");
  btn.addEventListener("click", () => {
    messageBox.style.opacity = "0";
    messageBox.style.opacity = "scale{.3}";
    setTimeout(() => {
      messageBox.remove();
    }, 1000);
  });
}
//admisn and h.o.ds functions end here

/* main function end here*/

/* accessoory functions start here */
function validateTermInputs(array) {
  let allFilled = true;
  array.forEach((input) => input.classList.remove("errors"));
  array.forEach((input) => {
    if (input.value === "") {
      allFilled = false;
      input.classList.add("errors");
    }
  });

  if (allFilled) {
    return true;
  } else {
    return false;
  }
}

function setDateFromString(dateStr) {
  const parts = dateStr.split("/");
  const day = parts[0];
  const month = parts[1];
  const year = parts[2];
  const formatted = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  return formatted;
}

function getTotalDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffTime = end - start;

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

function formatDate(inputValue) {
  const date = new Date(inputValue);
  if (isNaN(date)) return ""; // invalid date

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()); // only last 2 digits

  return `${day}/${month}/${year}`;
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

function hideAllChildren(className, type = false) {
  const children = Array.from(document.querySelector(".centralise").children);
  children
    .filter((child) => !child.classList.contains(className))
    .forEach((child) => (child.style.display = "none"));

  document.querySelector(`.${className}`).style.display = "flex";
  if (!type) document.querySelector(`.${className}`).innerHTML = "";
  backBtn.parentElement.style.display = "flex";
}

function editSpan(span, type = false) {
  mode = "edit mode";
  const originalText = span.textContent.trim();
  const [subj, category] = span.dataset.text.split("/");
  span.innerHTML = "";

  const input = document.createElement("input");
  input.value = originalText;
  span.appendChild(input);
  input.focus();

  input.addEventListener("change", () => {
    if (type) {
      span.dataset.text = `${input.value}/${classSetup.system}/${category}`;
    } else {
      span.dataset.text = `${input.value}/${category}`;
    }
    span.innerHTML = `
      <i class="fa fa-pen"></i>
      <i class="fa-solid fa-calculator"></i>
      <h3>${input.value}</h3>
    `;
    input.remove();
    const editicon = span.querySelector(".fa-pen");
    editicon.addEventListener("click", (e) => {
      e.stopPropagation();
      editSpan(span);
    });
  });
}

function deleteSpan(span, type) {
  mode = "edit mode";
  span.style.opacity = "0";
  span.style.transform = "rotate(360deg) scale(.3)";
  setTimeout(() => {
    span.style.display = "none";

    if (type === "subject") {
      const foundSpan = subjectSpans.find((spn) => spn.id === span.id);
      if (foundSpan) {
        const index = subjectSpans.indexOf(foundSpan);
        subjectSpans.splice(1, index);
        showSuccessMessage(`${span.textContent.trim()} deleted succesfully`);
      }
    }
  }, 1000);
}

let addesSubjects = 0;
async function addNewSpan(parent, category) {
  mode = "edit mode";
  const schoolSubjects = await mySubjects();
  const subjectsLength = schoolSubjects.length;

  if (subjectsLength + addesSubjects === 16) {
    showErrorMessage("maximum allowed subjects is 16");
    return;
  }

  const span = document.createElement("span");
  const input = document.createElement("input");
  span.style.opacity = "0";
  span.style.transform = "scale(0)";
  input.value = "subject" + (subjectsLength + addesSubjects + 1);
  span.appendChild(input);

  const lastChild = parent.lastElementChild;

  parent.insertBefore(span, lastChild);

  input.focus();

  input.addEventListener("change", () => {
    span.dataset.text = `${input.value}/${getReverseCategory(category)}`;
    subjectSpans.push(span);
    span.innerHTML = `
      <i class="fa fa-pen"></i>
      <i class="fa-solid fa-calculator"></i>
      <h3>${input.value}</h3>
    `;
    input.remove();
    const editicon = span.querySelector(".fa-pen");
    editicon.addEventListener("click", (e) => {
      e.stopPropagation();
      editSpan(span);
    });
  });

  span.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    deleteSpan(span, "subject");
    addesSubjects--;
  });

  requestAnimationFrame(() => {
    span.style.opacity = "1";
    span.style.transform = "scale(1)";
  });

  addesSubjects++;
}

/* accessoory functions end here */

/**function to post changes*/
async function postAllChanges(layout = "") {
  if (
    subjectSpans.length === 0 ||
    classSpans.length === 0 ||
    subjectSpans.length === 0
  ) {
    showErrorMessage("error saving changes");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    return;
  }
  const user = await getUser();
  const classValues = classSpans
    .map((classSpan) => classSpan.dataset.text)
    .join("-");
  const streamValues = streamSpans
    .map((classSpan) => classSpan.dataset.text)
    .join("-");
  const subjectValues = subjectSpans
    .map((classSpan) => classSpan.dataset.text)
    .join("-");

  const data = new FormData();
  data.append("class-array", classValues);
  data.append("stream-array", streamValues);
  data.append("subject-array", subjectValues);
  data.append("layout-array", layout);
  data.append("id" , user.schoolId);
 
  showLoader("saving changes, please wait...");
  try {
    const response = await fetch("uploads.php", {
      method: "POST",
      body: data,
    });
    const result = await response.json();
    console.log(result)

    if (result.type) {
      showSuccessMessage("changes saved succesfully");
    } else {
      showErrorMessage("error saving changes");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  } catch (error) {
    console.log("posting changes error", error);
  } finally {
    removeLoader();
  }
}

async function postTeacherChanges(code, rank) {
  showLoader("posting teacher changes, please wait...");
  const user = await getUser();
  const data = new FormData();
  data.append("rank", rank);
  data.append("tcode", code);
  data.append("id", user.schoolId);

  try {
    const response = await fetch("streamposition.php", {
      method: "POST",
      body: data,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.lg("error posting teacher changes", error);
  } finally {
    removeLoader();
  }
}

//term update functions
const termContBox = document.querySelector(".term-progress-cont");
const termBtn = document.querySelector(".term-student-upgrade .term");
const submitTerm = termContBox.querySelector(".save");
const termBack = termContBox.querySelector(".close");
const start = termContBox.querySelector("#start-date");
const end = termContBox.querySelector("#end-date");
const term = termContBox.querySelector("#term");

async function startTerm() {
  const setups = await getSetup();
  //get the html inputs
  const daysText = termContBox.querySelector(".footer h2");
  const termText = termContBox.querySelector("h1 span");
  const savedTerm = setups[0].term.split("-");
  console.log(setups);
  console.log(savedTerm);
  termText.textContent = savedTerm[0];
  term.value = savedTerm[0];
  start.value = setDateFromString(savedTerm[1]);
  end.value = setDateFromString(savedTerm[2]);

  let daysBtn = getTotalDays(
    setDateFromString(savedTerm[1]),
    setDateFromString(savedTerm[2])
  );
  daysText.innerHTML = `${daysBtn} <span>days</span>`;

  start.addEventListener("change", (e) => {
    e.preventDefault();
    daysBtn = getTotalDays(start.value, end.value);
    daysText.innerHTML = `${daysBtn} <span>days</span>`;
  });

  end.addEventListener("change", (e) => {
    e.preventDefault();
    daysBtn = getTotalDays(start.value, end.value);
    daysText.innerHTML = `${daysBtn} <span>days</span>`;
  });
}

termBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  termContBox.style.display = "flex";
  requestAnimationFrame(() => {
    termContBox.style.transform = "scale(1)";
    termContBox.style.opacity = "1";
  });
  startTerm();
});

termBack.addEventListener("click", (e) => {
  e.stopPropagation();

  requestAnimationFrame(() => {
    termContBox.style.transform = "scale(.5)";
    termContBox.style.opacity = "0";
  });

  setTimeout(() => {
    termContBox.style.display = "none";
  }, 1000);
});

submitTerm.addEventListener("click", () => {
  const verified = validateTermInputs([term, start, end]);
  if (verified) {
    submitTerm.disabled = true;
    termBack.disabled = true;
    postTermChanges();
  }
});

function normalizeDate(dateStr) {
  // dateStr in format DD/MM/YYYY
  const [day, month, year] = dateStr.split("/").map(Number);
  return `${day}/${month}/${year}`;
}

async function postTermChanges() {
  const setup = await getSetup();
  const formattedStart = formatDate(start.value);
  const formattedEnd = formatDate(end.value);

  const array = [formattedStart, formattedEnd].map((s) => normalizeDate(s));
  const arrayText = ["opening day", "closing day"];
  const arrayDesc = [
    `The new school ${term.value} begins today. Students should report on time, ready to learn and participate actively.`,
    `The official last day of the school ${term.value} when all academic activities conclude, students receive their progress reports, and the school breaks for holiday.`,
  ];

  const valueArray = [term.value, formattedStart, formattedEnd];
  const actualValue = valueArray.join("-");

  const data = new FormData();
  data.append("term", actualValue);
  data.append("id", setup[0].schoolId);

  try {
    const response = await fetch("termupgrade.php", {
      method: "POST",
      body: data,
    });
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.log("term update error", error);
  } finally {
    for (let x = 0; x < 2; x++) {
      postTermEvent(array[x], arrayText[x], arrayDesc[x]);
    }
  }
}

async function postTermEvent(date, text, term) {
  const user = await getUser();
  const data = new FormData();
  data.append("event-tittle", text);
  data.append("event-date", date);
  data.append("from", "");
  data.append("to", "");
  data.append("category", "educative");
  data.append("destination", "all");
  data.append("id", user.schoolId);
  data.append("event-description", term);
  data.append("user", user.code);

  try {
    const response = await fetch("eventsubmittion.php", {
      method: "POST",
      body: data,
    });
    const result = await response.json();
    if (result.type) {
      showLoader("details saved succesfully");
      setTimeout(() => {
        removeLoader();
      }, 3000);
    }
  } catch (error) {
    console.log("posting term event error", error);
  } finally {
    removeLoader();
  }
}

async function postSlider(tittle, desc, type, sqlType, id = "", rank = "") {
  showLoader("posting slider changes, please wait...");
  const user = await getUser();
  const data = new FormData();
  data.append("h2", tittle.value);
  data.append("p", desc.value);
  data.append("type", type);
  data.append("school_id", user.schoolId);
  data.append("id", id);
  data.append("rank", rank);
  data.append("image", newSlider.files[0]);
  data.append("sqlType", sqlType);

  try {
    const response = await fetch("admincalendar.php", {
      method: "POST",
      body: data,
    });
    const result = await response.text();
    console.log(result);
    return result;
  } catch (error) {
    console.log("error submiting slider", error);
  } finally {
    removeLoader();
  }
}

async function deleteSliderz() {
  showLoader("deleting slider, please wait...");
  const data = new FormData();
  data.append("id", slideshowId);

  try {
    const response = await fetch("example.php", {
      method: "POST",
      body: data,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error deleting slider", error);
  } finally {
    removeLoader();
  }
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
backBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  if (mode === "edit mode") {
    showErrorMessage("please save all changes to continue");
  } else {
    window.location.reload();
  }
});

applyBtn.addEventListener("click", async () => {
  if (mode === "layout mode") {
    const schoolInfoDivs = Array.from(
      layoutCont.querySelectorAll(".school-name textarea")
    )
      .map((child) => `${child.id}-${child.value}`)
      .join(":");
    const schoolLinkDivs = Array.from(
      layoutCont.querySelectorAll(".social-media-div input")
    )
      .map((child) => `${child.className}-${child.value}`)
      .join(":");
    const totalLayout = `sc/${schoolInfoDivs}&ln/${schoolLinkDivs}`;
    console.log(totalLayout)
    const status = await postAllChanges(totalLayout);
  } else {
    const status = await postAllChanges();
  }
});
