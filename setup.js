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
      console.log("student error", error);
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
      console.log("teacher error", error);
    }
  };
  xhr.send();
}

function getParents(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "parents.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("parent error", error);
    }
  };
  xhr.send();
}

function getSetup(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "getsetup.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("setup error", error);
    }
  };
  xhr.send();
}

function getSliders(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "getSlidesho.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("slideshow error", error);
    }
  };
  xhr.send();
}

function getUser(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "saved_user.php", true);
  xhr.onload = () => {
    try{
       if (xhr.status === 200) {
         const response = JSON.parse(xhr.responseText);
         callback(response)
       }
    }catch(error){
       console.log("login error" , error);
    }
  };
  xhr.send();
}

const schoolInfoBox = document.querySelector(".school");
const badge = schoolInfoBox.querySelector(".badge img");
const schoolName = schoolInfoBox.querySelector(".text h1")
const schoolAdres = schoolInfoBox.querySelector(".text h2")

function updateSchoolname(){
  getSetup((schoolSetups) => {
     getUser((user) => {
      const thisSchool = schoolSetups.find(s => s.schoolId === user.schoolId);
      if(thisSchool){
        badge.setAttribute('src' , thisSchool.badge);
        schoolName.textContent = thisSchool.schoolName
        schoolAdres.textContent = thisSchool.adress
      }
     })
  })
}

updateSchoolname()

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
  "subject14",
  "subject16",
  "subject16",
];

const colors = [
  "#FFFFFF", // Pure white
  "#FAFAFA", // Very light white
  "#FDFDFD", // Almost pure white
  "#F8F8F8", // Off-white
  "#F5F5F5", // White smoke
  "#F2F2F2", // Light neutral white
  "#F0F0F0", // Very light grey-white
  "#EEEEEE", // Slightly grayish white
  "#EBEBEB", // Subtle grey-white
  "#EAEAEA", // Soft white-gray
  "#E8E8E8", // Muted white
  "#E6E6E6", // Clean white-gray
  "#E5E5E5", // Dimmed white
  "#E4E4E4", // Muted pale white
  "#E2E2E2", // Lowest edge of whitish
];

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
  homescience: "fa-kitchen-set",
  electricity: "fa-bolt",
  music: "fa-music",
  art: "fa-paint-brush",
};

const streamsValues = [
  "green","red","blue","purple"
]

const studentCount = document.querySelector(".student-count");
const teacherCount = document.querySelector(".teacher-count");
const parentCount = document.querySelector(".parent-count");

const termUpgrade = document.querySelector(".term");
const studentsUpgrade = document.querySelector(".upgrade");

const linksContainer = document.querySelector(".links");
const linkBoxes = Array.from(linksContainer.children);
const centralise = document.querySelector(".centralise");
const allChildren = Array.from(centralise.children);

const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");

const btn = document.querySelector(".btn-section");

//after the dom has finished loading then diplay the counts
document.addEventListener("DOMContentLoaded", () => {
  getStudents((students) => {
    getUser((user) => {
       const allStudents = students.filter(s => s.schoolId === user.schoolId)
       studentCount.textContent = allStudents.length;
    })
  });

  getParents((teachers) => {
    getUser((user) => {
       const allteachers = teachers.filter(s => s.schoolId === user.schoolId)
       teacherCount.textContent = allteachers.length;
    })
  });

  getTeachers((parents) => {
    getUser((user) => {
       const allparents = parents.filter(s => s.schoolId === user.schoolId)
       parentCount.textContent = allparents.length;
    })
  });

  setTimeout(() => {
    termUpgrade.style.opacity = "1";
    studentsUpgrade.style.opacity = "1";
    studentsUpgrade.style.transform = "translateY(0) scale(1)";
    termUpgrade.style.transform = "translateY(0) scale(1)";
  }, 0);
});

const subjectLink = linkBoxes[0];
const classLink = linkBoxes[1];
const streamLink = linkBoxes[2];
const departmentLink = linkBoxes[3];
const layoutLink = linkBoxes[4];
const delay = 0.2;
let subjectArray;

let subjectSpans = [];
let classSpans = [];
let streamSpans = [];
const categories = document.querySelectorAll(".category");
const subjectContainer = document.querySelector(".subject-container");
const classContainer = document.querySelector(".class-container");
const streamContainer = document.querySelector(".stream-container");
const departmentContainer = document.querySelector(".department-container");
const mode = classContainer.querySelector(".fa-toggle-off");
const progress = document.querySelector(".submit-progress");
const teacherCont = departmentContainer.querySelector(".teachers");
const progressSpans = document.querySelector(".progress");
const numberSpans = Array.from(progressSpans.children).filter((span) =>
  span.classList.contains("value")
);
const continueBtn = departmentContainer.querySelector(".box-btn button");

function assignType(type) {
  switch (type) {
    case "languages / compulosory":
      return "c";
    case "sciences":
      return "s";
    case "humanities":
      return "h";
    case "technicals":
      return "t";
    default:
      return "c";
  }
}

let addedSubjects = 0;
let totalSubjects = 0;
function addSubjectCategory(icon, category) {
  totalSubjects = subjectSpans.length + addedSubjects;
  if (totalSubjects >= 17) {
    showErrorMessage("maximun added subjects reached");
    icon.classList.remove("fa-add");
    icon.classList.add("fa-times");
    update();
    return;
  }

  const parent = icon.parentElement.parentElement;

  const span = document.createElement("span");
  const input = document.createElement("input");
  input.value = "subject" + (14 + addedSubjects + 1);
  input.focus();

  input.addEventListener("change", (e) => {
    e.stopPropagation();
    span.innerHTML = `<i class='fa fa-book'></i><h3>${input.value}</h3><i class='fa fa-pen'></i>`;
    span.dataset.text = input.value + "/" + assignType(category);
    subjectSpans.push(span);
    updateSubjects();
    input.remove();

    const editIcon = span.querySelector(".fa-pen");

    if (editIcon) {
      editIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        editSubject(span);
      });
    }
  });

  const randomIndex = Math.floor(Math.random() * colors.length);
  span.style.backgroundColor = colors[randomIndex];

  span.appendChild(input);

  const lastChild = parent.lastElementChild;
  parent.insertBefore(span, lastChild);

  addedSubjects++;
}

function update() {
  const removeIcon = document.querySelectorAll(".fa-times");
  removeIcon.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      if (!icon.classList.contains("fa-times")) return;
      e.stopPropagation();
      const parent = icon.parentElement.parentElement;
      const lastChild = parent.children[parent.children.length - 2];
      icon.classList.remove("fa-times");
      icon.classList.add("fa-add");

      const index = subjectSpans.indexOf(lastChild);
      if (index > 0) subjectSpans.splice(index, 1);
      updateSubjects();

      lastChild.remove();
      addedSubjects--;
      return;
    });
  });
}

function editSubject(span) {
  // Save original HTML state
  span.dataset.originalHtml = span.innerHTML;

  const originalText = span.textContent.trim();
  span.innerHTML = "";
  span.classList.add("editmode");

  const input = document.createElement("input");
  input.value = originalText;
  span.appendChild(input);
  input.focus();

  let committed = false;

  function commitChange() {
    if (committed) return;
    committed = true;

    const newValue = input.value.trim();

    if (newValue) {
      span.innerHTML = `<i class='fa fa-check'></i><h3>${newValue}</h3> <i class='fa fa-pen'></i>`;
      const [subject, type] = span.dataset.text.split("/");
      span.dataset.text = newValue + "/" + type;
    } else {
      span.innerHTML = span.dataset.originalHtml;
    }

    span.classList.remove("editmode");
    updateSubjects();
  }

  input.addEventListener("change", (e) => {
    e.stopPropagation();
    commitChange();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      commitChange();
    }
  });

  input.addEventListener("blur", () => {
    commitChange();
  });
}

function updateSubjects(layout = null) {
  const getUniqueTexts = (spans) => {
    const values = spans.map((m) => m.dataset.text.trim().toLowerCase());
    return [...new Set(values)];
  };

  const subjectArray = getUniqueTexts(subjectSpans).join("-");
  const classArray = getUniqueTexts(classSpans).join("-");
  const streamArray = getUniqueTexts(streamSpans).join("-");

  postChanges(subjectArray, classArray, streamArray,layout);
}

//function to diaply already loaded subjects from the database

function loadSubmitedSubjects() {
  getUser((user) => {
     getSetup((schoolSetups) => {
    const thisSchool = schoolSetups.find((s) => s.schoolId === user.schoolId);
    if (thisSchool) {
      subjectContainer.innerHTML = "";
      const savedSubjects = thisSchool.subjects;
      const subjectlayout = getSubjectlayout(savedSubjects);

      Object.entries(subjectlayout).forEach(([category, subjects]) => {
        const categoryBox = document.createElement("div");
        categoryBox.className = "category";
        const h2 = document.createElement("h2");
        h2.textContent = category + " " + `(${subjects.length})`;

        const categoryBody = document.createElement("div");
        categoryBody.className = "body";

        subjects.forEach((subj) => {
          const span = document.createElement("span");
          span.style.backgroundColor = `${
            colors[Math.floor(Math.random() * colors.length)]
          }`;
          span.innerHTML = `
                    <i class="fa fa-pen"></i>
                    <i class="fa-solid ${subjectIcons[subj.trim()]}"></i>
                    <h3>${subj}</h3>
                `;
          span.dataset.text = subj + "/" + assignType(category);
          categoryBody.appendChild(span);
          subjectSpans.push(span);

          span.addEventListener("click", (e) => {
            e.stopPropagation();

            if (span.classList.contains("editmode")) return;

            const editIcon = span.querySelector(".fa-pen");
            if (!editIcon) return;
            editIcon.addEventListener("click", (e) => {
              e.stopPropagation();
              e.preventDefault();

              editSubject(span);
            });
          });

          span.addEventListener("dblclick", (e) => {
            span.style.transform = "translateY(100%) scale(0.5)";

            setTimeout(() => {
              span.style.display = "none";
              const index = subjectSpans.indexOf(span);
              subjectSpans.splice(index, 1);
              updateSubjects();
            }, 1000);
          });
        });

        const addtionSpan = document.createElement("span");
        addtionSpan.className = "subject";
        addtionSpan.innerHTML = `
              <i class="fa fa-add"></i>
            `;
        categoryBody.appendChild(addtionSpan);

        const addIcon = addtionSpan.querySelector(".fa-add");
        addIcon.addEventListener("click", (e) => {
          e.stopPropagation();
          addSubjectCategory(addIcon, category);
        });

        categoryBox.appendChild(h2);
        categoryBox.appendChild(categoryBody);
        subjectContainer.appendChild(categoryBox);
      });
      totalSubjects = subjectSpans.length + addedSubjects;
      displaySUbjectNumbers(subjectSpans);
    } else {
      alert("no registered school was found");
      window.location.href = "login.html";
    }
  });
  })
}

function displaySUbjectNumbers(array) {
  if (array.length > 10) {
    const body = subjectLink.querySelector(".body");
    body.innerHTML = `
           <i class="fa fa-1"></i>
           <i class="fa fa-${array.length - 10}"></i>
        `;
  }
}

//function to get subject layout
function getSubjectlayout(rawSubjects) {
  const categorisedSubjects = {};
  const subjectArray = rawSubjects.split("-");
  subjectArray.forEach((subjectData) => {
    const [subject, category] = subjectData.split("/");

    if (!categorisedSubjects[getCategory(category)])
      categorisedSubjects[getCategory(category)] = [];
    categorisedSubjects[getCategory(category)].push(subject);
  });
  return categorisedSubjects;
}

//function to get he category
function getCategory(rawCategory) {
  switch (rawCategory) {
    case "c":
      return "language / compulsory";
    case "s":
      return "sciences";
    case "h":
      return "humanities";
    case "t":
      return "technicals";
    default:
      return "uncategorised";
  }
}

//functiont load clases
function loadSubmitedClases() {
  classSpans = [];
  getUser((user) => {
     getSetup((schoolSetups) => {
    const thisSchool = schoolSetups.find((s) => s.schoolId === user.schoolId);
    if (thisSchool) {
      classContainer.querySelector(".clases-div").innerHTML = "";
      const schoolClases = thisSchool.clases;
      const classLayout = getClassLayout(schoolClases);

      if (classLayout.type === "o") {
        mode.classList.add("fa-toggle-off");
        mode.classList.remove("fa-toggle-on");
      } else {
        mode.classList.add("fa-toggle-on");
        mode.classList.remove("fa-toggle-off");
      }

      Object.entries(classLayout).forEach(([category, clases]) => {
        const categoryBox = document.createElement("div");
        categoryBox.className = "category";

        if (category === "type") return;

        const h2 = document.createElement("h2");
        h2.textContent = category;
        categoryBox.appendChild(h2);

        const categoryBody = document.createElement("div");
        categoryBody.className = "body";

        clases.forEach((clas) => {
          const span = document.createElement("span");
          span.style.backgroundColor = `${
            colors[Math.floor(Math.random() * colors.length)]
          }`;
          span.dataset.text =
            clas +
            "/" +
            classLayout["type"] +
            "/" +
            getLoadedClassCategories(category);
          span.innerHTML = `
                  <i class="fa-solid fa-chalkboard"></i>
                  <h3>${clas}</h3>
                `;
          categoryBody.appendChild(span);
          classSpans.push(span);
        });

        categoryBox.appendChild(categoryBody);
        classContainer.querySelector(".clases-div").appendChild(categoryBox);
      });
      displayClassNumbers(classSpans);
    }
  });
  })
}

function getClassLayout(schoolClases) {
  const groupedClases = {};
  const rawClassArray = schoolClases.split("-");
  rawClassArray.forEach((rawclass) => {
    const [clas, type, level] = rawclass.split("/");
    groupedClases["type"] = type;
    const category = getClassCategory(level);
    if (!groupedClases[category]) groupedClases[category] = [];
    groupedClases[category].push(clas);
  });
  return groupedClases;
}

function getClassCategory(category) {
  switch (category) {
    case "h":
      return "highschool";
    case "pp":
      return "pre-primary";
    case "p":
      return "primary";
    case "j":
      return "junior secondary";
    case "s":
      return "senior secondary";
    case "u":
      return "university";
  }
}

function getClassCategories(category) {
  switch (category) {
    case "highschool":
      return "h";
    case "preprimary":
      return "pp";
    case "primary":
      return "p";
    case "junior":
      return "j";
    case "senior":
      return "s";
  }
}

function getLoadedClassCategories(category) {
  switch (category) {
    case "highschool":
      return "h";
    case "pre-primary":
      return "pp";
    case "primary":
      return "p";
    case "junior secondary":
      return "j";
    case "senior secondary":
      return "s";
  }
}

function displayNewStystem() {
  classSpans = [];
  const newSystem = {
    preprimary: ["playgroup", "pp1", "pp2"],
    primary: ["grade 1", "grade 2", "grade 3", "grade 4", "grade 5", "grade 6"],
    junior: ["grade 7", "grade 8", "grade 9"],
    senior: ["grade 10", "grade 11", "grade 12"],
    type: "n",
  };

  classContainer.querySelector(".clases-div").innerHTML = "";

  Object.entries(newSystem).forEach(([category, clases]) => {
    const categoryBox = document.createElement("div");
    categoryBox.className = "category";

    if (category === "type") return;

    const h2 = document.createElement("h2");
    h2.textContent = category;
    categoryBox.appendChild(h2);

    const categoryBody = document.createElement("div");
    categoryBody.className = "body";

    clases.forEach((clas) => {
      const span = document.createElement("span");
      span.style.backgroundColor = `${
        colors[Math.floor(Math.random() * colors.length)]
      }`;
      span.dataset.text = "";
      span.dataset.text =
        clas + "/" + newSystem["type"] + "/" + getClassCategories(category);
      console.log(span.dataset.text);
      span.innerHTML = `
                  <i class="fa fa-pen"></i>
                  <i class="fa-solid fa-chalkboard"></i>
                  <h3>${clas}</h3>
                `;
      classSpans.push(span);          
      categoryBody.appendChild(span);
    
      span.addEventListener("click", (e) => {
        e.stopPropagation();

        if (span.classList.contains("editmode")) return;

        const editIcon = span.querySelector(".fa-pen");
        if (!editIcon) return;
        editIcon.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();

          editSubject(span);
        });
      });
    });
    streamSpans = [];
    categoryBox.appendChild(categoryBody);
    classContainer.querySelector(".clases-div").appendChild(categoryBox);
    for(let x = 0; x < 4; x++){
      const span = document.createElement("span");
      span.dataset.text = streamsValues[x];
      streamSpans.push(span)
    }
    updateSubjects();
  });
}

function displayClassNumbers(array) {
  if (array.length >= 10) {
    const body = classLink.querySelector(".body");
    body.innerHTML = `
           <i class="fa fa-1"></i>
           <i class="fa fa-${array.length - 10}"></i>
        `;
  } else {
    const body = classLink.querySelector(".body");
    body.innerHTML = `
           <i class="fa fa-${array.length}"></i>
        `;
  }
}

//stream functions start here

function loadDefaultStreams() {
  streamSpans = [];
  getUser((user) => {
      getSetup((schoolSetups) => {
    const thisSchool = schoolSetups.find((s) => s.schoolId === user.schoolId);
    if (thisSchool) {
      streamContainer.innerHTML = "";
      const clases = thisSchool.clases;
      const classLayout = getClassLayout(clases);
      const defaultStreams = thisSchool.streams.split("-");
      const h1 = document.createElement("h1");
      h1.textContent = "my streams";
      streamContainer.appendChild(h1);

      if (defaultStreams.length > 4) {
        loadSubmitedStreams();
        return;
      }

      Object.entries(classLayout).forEach(([category, clases]) => {
        const categoryBox = document.createElement("div");
        categoryBox.className = "stream-category";

        if (category === "type") return;

        const h2 = document.createElement("h2");
        h2.textContent = category;
        categoryBox.appendChild(h2);

        const categoryBody = document.createElement("div");
        categoryBody.className = "body";

        clases.forEach((clas) => {
          const span = document.createElement("span");
          span.style.backgroundColor = `${
            colors[Math.floor(Math.random() * colors.length)]
          }`;

          const head = document.createElement("div");
          head.className = "head";
          head.innerHTML = `
                  <i class="fa-solid fa-chalkboard"></i>
                  <h3>${clas}</h3>
                `;

          const streams = document.createElement("div");
          streams.className = "streams";

          for (let x = 0; x < defaultStreams.length; x++) {
            const innerSpan = document.createElement("span");
            innerSpan.innerHTML = `
                        <i class="fa fa-pen"></i>
                        <h4>${defaultStreams[x]}</h4>
                    `;
            streams.appendChild(innerSpan);
          }
          span.dataset.text = "";
          span.dataset.text = clas + ":" + defaultStreams.join("/");

          const addSpan = document.createElement("span");
          addSpan.className = "subject";
          addSpan.innerHTML = `
                  <i class="fa fa-add"></i>
                `;
          const addIcon = addSpan.querySelector(".fa-add");
          addIcon.addEventListener("click", (e) => {
            e.stopPropagation();
            addStream(addSpan, clas);
          });

          streams.appendChild(addSpan);

          span.appendChild(head);
          span.appendChild(streams);
          categoryBody.appendChild(span);
          streamSpans.push(span);
        });

        categoryBox.appendChild(categoryBody);
        streamContainer.appendChild(categoryBox);
      });
    }
  });
  })
}

function loadSubmitedStreams() {
  getUser((user) => {
    getSetup((schoolSetups) => {
    const thisSchool = schoolSetups.find((s) => s.schoolId === user.schoolId);
    if (thisSchool) {
      const savedStreams = thisSchool.streams.split("-");
      const streamlayout = getStreamLayout(savedStreams);

      Object.entries(streamlayout).forEach(([category, categoryData]) => {
        const categoryBox = document.createElement("div");
        categoryBox.className = "stream-category";

        const h2 = document.createElement("h2");
        h2.textContent = category;
        categoryBox.appendChild(h2);

        const categoryBody = document.createElement("div");
        categoryBody.className = "body";

        Object.entries(categoryData).forEach(([clas, streams]) => {
          const span = document.createElement("span");
          span.style.backgroundColor = `${
            colors[Math.floor(Math.random() * colors.length)]
          }`;

          const head = document.createElement("div");
          head.className = "head";
          head.innerHTML = `
                  <i class="fa-solid fa-chalkboard"></i>
                  <h3>${clas}</h3>
            `;

          const streamsDiv = document.createElement("div");
          streamsDiv.className = "streams";

          streams.forEach((stream) => {
            const innerSpan = document.createElement("span");
            innerSpan.innerHTML = `
                        <i class="fa fa-pen"></i>
                        <h4>${stream}</h4>
                    `;
            streamsDiv.appendChild(innerSpan);
          });

          span.dataset.text = clas + ":" + streams.join("/");

          const addSpan = document.createElement("span");
          addSpan.className = "subject";
          addSpan.innerHTML = `
                    <i class="fa fa-add"></i>
                  `;
          const addIcon = addSpan.querySelector(".fa-add");
          addIcon.addEventListener("click", (e) => {
            e.stopPropagation();
            addStream(addSpan, clas);
          });

          streamsDiv.appendChild(addSpan);

          span.appendChild(head);
          span.appendChild(streamsDiv);
          categoryBody.appendChild(span);
          streamSpans.push(span);
        });

        categoryBox.appendChild(categoryBody);
        streamContainer.appendChild(categoryBox);
      });
    }
  });
  })
}

let addedStreams = 0;

function getStreamCategories(clas) {
  const formattedKey = clas.replace(/\s+/g, "").toLowerCase();
  const streamCategories = {
    playgroup: "pre-primary",
    pp1: "pre-primary",
    pp2: "pre-primary",
    grade1: "primary",
    grade2: "primary",
    grade3: "primary",
    grade4: "primary",
    grade5: "primary",
    grade6: "primary",
    grade7: "junior secondary",
    grade8: "junior secondary",
    grade9: "junior secondary",
    grade10: "senior secondary",
    grade11: "senior secondary",
    grade12: "senior secondary",
  };

  return streamCategories[formattedKey] || "uncategorised";
}

function addStream(parent, category) {
  const parentElement = parent.parentElement;

  if (addedStreams > 2) {
    showErrorMessage("maximum number of streams");
    return;
  }

  const span = document.createElement("span");
  const input = document.createElement("input");
  span.appendChild(input);
  input.value = "new stream";
  input.focus();

  input.addEventListener("change", () => {
    span.innerHTML = `
      <h4>${input.value}</h4>
      <i class='fa fa-pen'></i>  
    `;
    const streams = Array.from(parentElement.children)
      .filter((stream) => !stream.classList.contains("subject"))
      .map((m) => m.textContent.trim())
      .join("/");

    const majorParent = parentElement.parentElement;
    majorParent.dataset.text = category + ":" + streams;

    const index = streamSpans.indexOf(majorParent);
    streamSpans.splice(index, 1, majorParent);
    updateSubjects();
  });

  addedStreams++;

  parentElement.insertBefore(span, parentElement.lastElementChild);
}

function getStreamLayout(savedStream) {
  const streamLayout = {};
  savedStream.forEach((rawStream) => {
    const [clas, streams] = rawStream.split(":");
    const category = getStreamCategories(clas);
    if (!streamLayout[category]) streamLayout[category] = {};
    streamLayout[category][clas] = streams.split("/");
  });
  return streamLayout;
}

//stream functions end here

//department function start here
function defaultDepartmentSetup() {
  getTeachers((teachers) => {
    const icon = departmentContainer.querySelector(".icon i");
    const text = departmentContainer.querySelector(".text h3");
    const iconParent = icon.parentElement.parentElement;
    departmentContainer.style.display = "flex";

    continueBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      iconParent.style.display = "none";
      teacherCont.style.display = "flex";
      continueBtn.classList.add("step2");
    });

    const adminTeachers = teachers.filter((t) => t.rank === "admin");
    const adminCodes = new Set(adminTeachers.map((t) => t.teacherCode));
    const remainingTeachers = teachers.filter(
      (t) => !adminCodes.has(t.teacherCode)
    );

    if (adminTeachers.length > 0) {
      const categoryBox = document.createElement("div");
      categoryBox.className = "category";

      const h2 = document.createElement("h2");
      h2.textContent = `admin users (${adminTeachers.length})`;
      categoryBox.appendChild(h2);

      const teacherContainer = document.createElement("div");
      teacherContainer.className = "teacher-container";
      adminTeachers.forEach((teacher) => {
        const teacherBox = document.createElement("div");
        teacherBox.className = "boxes";
        const profileImage =
          teacher.profileImage || "./teachers/profileimage.png";
        teacherBox.innerHTML = `
              <div class="upper">
                <div class="image">
                  <img src="${profileImage}" alt="">
                </div>
              </div>
              <div class="lower">
                <h3 class="name">${teacher.firstname} ${teacher.middlename}</h3>
                <p>${teacher.rank}</p>
                <div class="subjects">
                  <span>${teacher.subjectOne}</span>
                  <span>${teacher.subjectTwo}</span>
                </div>
                  <h5 style="display:none;">${teacher.teacherCode}</h5>
              </div>
                <i style="display:none;" class="fas fa-check"></i>
            `;
        teacherContainer.appendChild(teacherBox);

        teacherBox.addEventListener("dblclick", () => {
          const icon = teacherBox.querySelector("i");
          icon.style.display = "grid";
          icon.classList.remove("fa-crown");
          icon.classList.add("fa-trash");

          teacherBox.style.transform = "scale(0.2) translateY(-250%)";
          teacherBox.style.opacity = "0";

          editTeacher(teacher.teacherCode, "normal");

          setTimeout(() => {
            teacherBox.remove();
          }, 1000);
        });
      });
      categoryBox.appendChild(teacherContainer);
      teacherCont.appendChild(categoryBox);
    }

    const categoryBox = document.createElement("div");
    categoryBox.className = "category";

    const h2 = document.createElement("h2");
    h2.textContent = `admin users (${remainingTeachers.length})`;
    categoryBox.appendChild(h2);

    const teacherContainer = document.createElement("div");
    teacherContainer.className = "teacher-container";

    remainingTeachers.forEach((teacher) => {
      const teacherBox = document.createElement("div");
      teacherBox.className = "boxes";
      const profileImage =
        teacher.profileImage || "./teachers/profileimage.png";
      teacherBox.innerHTML = `
              <div class="upper">
                <div class="image">
                  <img src="${profileImage}" alt="">
                </div>
              </div>
              <div class="lower">
                <h3 class="name">${teacher.firstname} ${teacher.middlename}</h3>
                <p>${teacher.rank}</p>
                <div class="subjects">
                  <span>${teacher.subjectOne}</span>
                  <span>${teacher.subjectTwo}</span>
                </div>
                  <h5 style="display:none;">${teacher.teacherCode}</h5>
              </div>
                <i style="display:none;" class="fas fa-crown"></i>
          `;
      teacherContainer.appendChild(teacherBox);

      teacherBox.addEventListener("dblclick", () => {
        const icon = teacherBox.querySelector("i");
        icon.style.display = "grid";

        teacherBox.style.transform = "scale(1.2) translateY(-250%)";
        teacherBox.style.opacity = "0";

        editTeacher(teacher.teacherCode, "admin");

        setTimeout(() => {
          teacherBox.remove();
        }, 1000);
      });
    });

    categoryBox.appendChild(teacherContainer);
    teacherCont.appendChild(categoryBox);
  });
}

function displayOtherDefaultDepartments() {
  getUser((user) => {
     getTeachers((teachers) => {
    getSetup((schoolSetups) => {
      const thisSchool = schoolSetups.find((s) => s.schoolId === user.schoolId);

      if (thisSchool) {
        const schoolSubjects = thisSchool.subjects.split("-");
        const subjectsArray = schoolSubjects.map((m) => m.split("/")[0]);
        const icon = departmentContainer.querySelector(".icon i");
        const text = departmentContainer.querySelector(".text h3");
        const continueBtn =
          departmentContainer.querySelector(".box-btn button");
        const iconParent = icon.parentElement.parentElement;

        iconParent.style.display = "flex";
        icon.classList.add("fa-chalkboard-user");
        icon.classList.add("fa-circle-user");
        text.textContent = "choose staff members with subject authority";
        iconParent.nextElementSibling.style.display = "none";

        continueBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (continueBtn.classList.contains("step2")) {
            //if were currently in the second step
            iconParent.style.display = "none";
            teacherCont.style.display = "flex";
            teacherCont.style.height = "100%";
            teacherCont.style.justifyContent = "flex-start";
            teacherCont.style.width = "100%";
            teacherCont.style.backgroundColor = "#e7e7e7";
            centralise.style.padding = "0";
            //give the teacher full width and height to hide the progrees container
          }
        });

        const adminUsers = teachers.filter((teach) => teach.rank === "admin");
        const adminCodes = new Set(
          adminUsers.map((teach) => teach.teacherCode)
        );

        let currentIndex = 0;
        const addesHODs = new Set();

        function displaySubjectTeachers() {
          teacherCont.innerHTML = "";
          teacherCont.style.padding = "2rem";
          if (currentIndex >= subjectsArray.length) {
            progress.style.transform = "scale(1)";
            progress.style.opacity = "1";
            const box = progress.querySelector(".box");

            box.innerHTML = `
              <i class="fa-solid fa-check big"></i> 
              <h3>changes saved succesfully</h3>
            `;

            setTimeout(() => {
              progress.style.transform = "scale(0)";
              progress.style.opacity = "0";
              numberSpans[1].classList.add("active");
              completeDepartments();
            }, 2000);

            continueBtn.classList.add("last-step");

            return;
          }

          const currentSubject = subjectsArray[currentIndex];
          const categoryBox = document.createElement("div");
          categoryBox.className = "category";

          const h2 = document.createElement("h2");
          h2.textContent = `${currentSubject} head of department`;
          h2.style.textAlign = "center";
          categoryBox.appendChild(h2);

          const teacherContainer = document.createElement("div");
          teacherContainer.className = "teacher-container";

          const normalTeachers = teachers.filter((teach) => {
            return (
              teach.rank === "normal" &&
              !addesHODs.has(teach.teacherCode) &&
              !adminCodes.has(teach.teacherCode) &&
              (normalize(teach.subjectOne) === normalize(currentSubject) ||
                normalize(teach.subjectTwo) === normalize(currentSubject))
            );
          });

          const currentHead = teachers.find(
            (t) => t.rank === `H.O.D-${currentSubject}`
          );

          if (normalTeachers.length > 0) {
            normalTeachers.forEach((teacher) => {
              const teacherBox = document.createElement("div");
              teacherBox.className = "boxes";
              const profileImage =
                teacher.profileImage || "./teachers/profileimage.png";
              teacherBox.innerHTML = `
              <div class="upper">
                <div class="image">
                  <img src="${profileImage}" alt="">
                </div>
              </div>
              <div class="lower">
                <h3 class="name">${teacher.firstname} ${teacher.middlename}</h3>
                <p>${teacher.rank}</p>
                <div class="subjects">
                  <span>${teacher.subjectOne}</span>
                  <span>${teacher.subjectTwo}</span>
                </div>
                  <h5 style="display:none;">${teacher.teacherCode}</h5>
              </div>
                <i style="display:none;" class="fas fa-crown"></i>
          `;
              teacherContainer.appendChild(teacherBox);

              teacherBox.addEventListener("click", (e) => {
                e.stopPropagation();
                const icon = teacherBox.querySelector(".fa-crown");
                icon.style.transform = "scale(2)";
                icon.style.display = "grid";
                editTeacher(teacher.teacherCode, `H.O.D-${currentSubject}`);
                setTimeout(() => {
                  icon.transform = "scale(1)";
                  currentIndex++;
                  addesHODs.add(teacher.teacherCode);
                  displaySubjectTeachers();
                }, 2000);
              });
            });
            categoryBox.appendChild(teacherContainer);
            teacherCont.appendChild(categoryBox);
          } else if (currentHead) {
            showErrorMessage(`${currentSubject} head of department exists`);
            currentIndex++;
            displaySubjectTeachers();
            return;
          } else {
            showErrorMessage(`no ${currentSubject} teachers found`);
            currentIndex++;
            displaySubjectTeachers();
            return;
          }
        }
        displaySubjectTeachers();
      } else {
        showErrorMessage("please select clases to continue");

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    });
  });
  })
}

function completeDepartments() {
  const icon = departmentContainer.querySelector(".icon i");
  const text = departmentContainer.querySelector(".text h3");
  const iconParent = icon.parentElement.parentElement;

  iconParent.style.display = "flex";
  icon.classList.remove("fa-chalkboard-user", "fa-circle-user");
  icon.classList.add("fa-check");
  text.textContent = "head of departments were selected succesfully";
  iconParent.nextElementSibling.style.display = "none";

  numberSpans[2].classList.add("active");

  continueBtn.addEventListener("click", () => {
    if (continueBtn.classList.contains("last-step")) {
      progressSpans.style.display = "none";
      iconParent.style.display = "none";
      displayAllHead();
    }
  });
}

function displayAllHead() {
  getTeachers((teachers) => {
    const adminTeachers = teachers.filter((teach) => teach.rank === "admin");
    teacherCont.innerHTML = "";
    if (adminTeachers.length > 0) {
      const categoryBox = document.createElement("div");
      categoryBox.className = "category";

      const h2 = document.createElement("h2");
      h2.textContent = `admin users (${adminTeachers.length})`;
      categoryBox.appendChild(h2);

      const teacherContainer = document.createElement("div");
      teacherContainer.className = "teacher-container";
      adminTeachers.forEach((teacher) => {
        const teacherBox = document.createElement("div");
        teacherBox.className = "boxes";
        const profileImage =
          teacher.profileImage || "./teachers/profileimage.png";
        teacherBox.innerHTML = `
              <div class="upper">
                <div class="image">
                  <img src="${profileImage}" alt="">
                </div>
              </div>
              <div class="lower">
                <h3 class="name">${teacher.firstname} ${teacher.middlename}</h3>
                <p>${teacher.rank}</p>
                <div class="subjects">
                  <span>${teacher.subjectOne}</span>
                  <span>${teacher.subjectTwo}</span>
                </div>
                  <h5 style="display:none;">${teacher.teacherCode}</h5>
              </div>
                <i style="display:none;" class="fas fa-check"></i>
            `;
        teacherContainer.appendChild(teacherBox);

        teacherBox.addEventListener("click", (e) => {
          e.stopPropagation();
          teacherBox.style.animation = "delete 4s linear alternate";

          setTimeout(() => {
            teacherBox.style.display = "none";
            editTeacher(teacher.teacherCode, "normal");
            displayAllHead();
          }, 4000);
        });
      });
      categoryBox.appendChild(teacherContainer);
      teacherCont.appendChild(categoryBox);
    } else {
      defaultDepartmentSetup();
    }

    const otherHods = teachers.filter((teach) => {
      const [rank, subject] = teach.rank.split("-");
      return (
        rank === "H.O.D" && teach.rank !== "normal" && teach.rank !== "admin"
      );
    });

    if (otherHods.length > 0) {
      const categoryBox = document.createElement("div");
      categoryBox.className = "category";

      const h2 = document.createElement("h2");
      h2.textContent = `Head of departments (${otherHods.length})`;
      categoryBox.appendChild(h2);

      const teacherContainer = document.createElement("div");
      teacherContainer.className = "teacher-container";
      otherHods.forEach((teacher) => {
        const teacherBox = document.createElement("div");
        teacherBox.className = "boxes";
        const profileImage =
          teacher.profileImage || "./teachers/profileimage.png";
        teacherBox.innerHTML = `
              <div class="upper">
                <div class="image">
                  <img src="${profileImage}" alt="">
                </div>
              </div>
              <div class="lower">
                <h3 class="name">${teacher.firstname} ${teacher.middlename}</h3>
                <p>${teacher.rank}</p>
                <div class="subjects">
                  <span>${teacher.subjectOne}</span>
                  <span>${teacher.subjectTwo}</span>
                </div>
                  <h5 style="display:none;">${teacher.teacherCode}</h5>
              </div>
                <i style="display:none;" class="fas fa-check"></i>
            `;
        teacherContainer.appendChild(teacherBox);
        teacherBox.addEventListener("click", (e) => {
          e.stopPropagation();
          teacherBox.style.animation = "delete 4s linear alternate";

          setTimeout(() => {
            teacherBox.style.display = "none";
            editTeacher(teacher.teacherCode, "normal");
            displayAllHead();
          }, 4000);
        });
      });
      categoryBox.appendChild(teacherContainer);
      teacherCont.appendChild(categoryBox);
    } else {
      defaultDepartmentSetup();
    }
  });
}
//department function end here

//function to post changes to the database
function postChanges(subjectData, classData, streamData,layout = null) {
  const formData = new FormData();
  formData.append("subject-array", subjectData);
  formData.append("class-array", classData);
  formData.append("stream-array", streamData);
  formData.append("layout-array", layout || "");

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "uploads.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        if (response.type) {
          showSuccessMessage("changes applied succesfully");
        }
      }
    } catch (error) {
      console.log("change error", error);
    }
  };
  xhr.send(formData);
}

function editTeacher(code, rank) {
  const formData = new FormData();
  formData.append("tcode", code);
  formData.append("rank", rank);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "streamposition.php", true);
  progress.style.transform = "scale(1)";
  progress.style.opacity = "1";
  const box = progress.querySelector(".box");
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        if (response.type) {
          // showSuccessMessage("changes applied succesfully");
          box.innerHTML = `
            <i class="fa-solid fa-thumbs-up big"></i> 
            <h3>changes saved succesfully</h3>
          `;

          setTimeout(() => {
            progress.style.transform = "scale(0)";
            progress.style.opacity = "0";
          }, 2000);
        }
      }
    } catch (error) {
      console.log("change error", error);
    }
  };
  xhr.send(formData);
}

//error handligng functions start gere
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
function normalize(str) {
  return (str || "").trim().toLowerCase();
}

//error handligng functions end gere

//function calls

//event losteners

subjectLink.addEventListener("click", () => {
  const children = centralise.children;
  Array.from(children)
    .filter((m) => !m.classList.contains("btn-section"))
    .map((m) => (m.style.display = "none"));
  loadDefaultStreams();
  loadSubmitedClases();
  loadSubmitedSubjects();
  subjectContainer.style.display = "flex";
  btn.style.display = "flex";
});

classLink.addEventListener("click", (e) => {
  e.stopPropagation();
  const children = centralise.children;
  Array.from(children)
    .filter((m) => !m.classList.contains("btn-section"))
    .map((m) => (m.style.display = "none"));
  loadDefaultStreams();
  loadSubmitedClases();
  loadSubmitedSubjects();
  classContainer.style.display = "flex";
  btn.style.display = "flex";
});

streamLink.addEventListener("click", (e) => {
  e.stopPropagation();
  const children = centralise.children;
  Array.from(children)
    .filter((m) => !m.classList.contains("btn-section"))
    .map((m) => (m.style.display = "none"));
  loadDefaultStreams();
  loadSubmitedClases();
  loadSubmitedSubjects();
  streamContainer.style.display = "flex";
  btn.style.display = "flex";
});

departmentLink.addEventListener("click", (e) => {
  e.stopPropagation();
  const children = centralise.children;
  Array.from(children)
    .filter((m) => !m.classList.contains("btn-section"))
    .map((m) => (m.style.display = "none"));
  defaultDepartmentSetup();
});

layoutLink.addEventListener("click",(e) => {
  e.stopPropagation();
  const children = centralise.children;
  Array.from(children)
    .filter((m) => !m.classList.contains("btn-section"))
    .map((m) => (m.style.display = "none"));
  document.querySelector(".main-page-editing").style.display = "flex";  
})

const backBtn = btn.querySelector("button");
backBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  window.location.reload();
});

mode.addEventListener("click", (e) => {
  e.stopPropagation();
  if (mode.classList.contains("fa-toggle-off")) {
    mode.classList.remove("fa-toggle-off");
    mode.classList.add("fa-toggle-on");
    btn.style.display = "flex";
    displayNewStystem();
  } else {
    mode.classList.add("fa-toggle-off");
    mode.classList.remove("fa-toggle-on");
    btn.style.display = "flex";
    loadSubmitedClases();
  }
});

const nextBtn = departmentContainer.querySelector(".next");

nextBtn.addEventListener("click", () => {
  getTeachers((teachers) => {
    progress.style.transform = "scale(1)";
    progress.style.opacity = "1";

    const box = progress.querySelector(".box");
    box.classList.add("diplaying");

    const adminTeachers = teachers.filter((t) => t.rank === "admin");

    box.innerHTML = "";

    const gridBox = document.createElement("div");
    gridBox.className = "teacher-container";

    if (adminTeachers.length > 0) {
      const categoryBox = document.createElement("div");
      categoryBox.className = "category";
      categoryBox.style.color = "#000";

      const h2 = document.createElement("h2");
      h2.textContent = `admin users (${adminTeachers.length})`;
      categoryBox.appendChild(h2);

      const teacherContainer = document.createElement("div");
      teacherContainer.className = "teacher-container";
      adminTeachers.forEach((teacher) => {
        const teacherBox = document.createElement("div");
        teacherBox.className = "boxes";
        const profileImage =
          teacher.profileImage || "./teachers/profileimage.png";
        teacherBox.innerHTML = `
              <div class="upper">
                <div class="image">
                  <img src="${profileImage}" alt="">
                </div>
              </div>
              <div class="lower">
                <h3 class="name">${teacher.firstname} ${teacher.middlename}</h3>
                <p>${teacher.rank}</p>
                <div class="subjects">
                  <span>${teacher.subjectOne}</span>
                  <span>${teacher.subjectTwo}</span>
                </div>
                  <h5 style="display:none;">${teacher.teacherCode}</h5>
              </div>
                <i style="display:none;" class="fas fa-check"></i>
            `;
        teacherContainer.appendChild(teacherBox);

        teacherBox.addEventListener("dblclick", () => {
          const icon = teacherBox.querySelector("i");
          icon.style.display = "grid";
          icon.classList.remove("fa-crown");
          icon.classList.add("fa-trash");

          teacherBox.style.transform = "scale(0.2) translateY(-250%)";
          teacherBox.style.opacity = "0";

          editTeacher(teacher.teacherCode, "normal");

          setTimeout(() => {
            teacherBox.remove();
          }, 1000);
        });
      });
      categoryBox.appendChild(teacherContainer);
      gridBox.appendChild(categoryBox);
      box.appendChild(gridBox);
    }

    const btnSection = document.createElement("div");
    btnSection.className = "btn";
    btnSection.innerHTML = `
      <button type='button' class='back'>back</button>
      <button type='button' class='save'>save & continue <i class="fa-solid fa-floppy-disk"></i></button>
     `;
    box.appendChild(btnSection);

    const save = btnSection.querySelector(".save");
    const back = btnSection.querySelector(".back");

    back.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      progress.style.transform = "scale(0)";
      progress.style.opacity = "0";
      box.innerHTML = "";
    });

    save.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      box.classList.remove("diplaying");
      box.innerHTML = `
        <div class="circle-progress"></div> 
        <h3>saving changes please wait...</h3>
       `;

      adminTeachers.forEach((user) => {
        editTeacher(user.teacherCode, "admin");
      });

      box.innerHTML = `
        <i class="fa-solid fa-thumbs-up big"></i> 
        <h3>changes saved succesfully</h3>
       `;

      setTimeout(() => {
        progress.style.transform = "scale(0)";
        progress.style.opacity = "0";
        teacherCont.innerHTML = "";
        numberSpans[0].classList.add("active");
        displayOtherDefaultDepartments();
      }, 2000);
    });
  });
});

//layout functions

const slideShowContainer = document.querySelector(".slideshow-container");
const editSlide = slideShowContainer.querySelector(".left");
const currentSlideBox = slideShowContainer.querySelector(".right");
const newSliderInput = document.querySelector("#new-slide");
const img = document.querySelector(".image");
const label = document.querySelector("#new-slide-label");
const applyRemoveBtn = slideShowContainer.querySelector(".btn");
const title = editSlide.querySelector(".tittle");
const desc = editSlide.querySelector(".desc");
const applyBtn = applyRemoveBtn.querySelector(".apply")
const removeBtn = applyRemoveBtn.querySelector(".remove")
const changeInput = img.querySelector("input");

const imageInputs = document.querySelector("#add-image")
const imageInput = document.querySelector("#profile");

let currentIndex = 0;
let id;

function showSliders(){
  getUser((user) => {
     getSliders((sliders) => {
    const thisSchoolSliders = sliders.filter(s => s.schoolId === user.schoolId && s.type === "slider");

    if(thisSchoolSliders.length > 0){

      if(currentIndex >= thisSchoolSliders.length){
        currentIndex = 0;
      }else if(currentIndex < 0){
        currentIndex = 0;
      }

      const currentSlide = thisSchoolSliders[currentIndex];
      currentSlideBox.innerHTML = "";

      const imageDiv = document.createElement("div");
      imageDiv.className = "slide-show-box";
      imageDiv.style.backgroundImage = `url(${currentSlide.img})`;

      const textDiv = document.createElement("div");
      textDiv.className = "text";
      textDiv.innerHTML = `
         <h3>${currentSlide.h2}</h3>
         <p>${currentSlide.p}</p>
      `;
      imageDiv.appendChild(textDiv);

      const lowerContainer = document.createElement("div");
      lowerContainer.className = "dots";

      const imagetext = document.createElement("h3");
      imagetext.textContent = `image ${currentIndex+1}`;
      lowerContainer.appendChild(imagetext);

      const dotsContainer = document.createElement("div");
      dotsContainer.className = "dots-section";

      for(let x = 0; x < thisSchoolSliders.length; x++){
        const span = document.createElement("span");
        dotsContainer.appendChild(span);
      }
      lowerContainer.appendChild(dotsContainer);

      Array.from(dotsContainer.children)[currentIndex].classList.add("active");

      currentSlideBox.appendChild(imageDiv);
      currentSlideBox.appendChild(lowerContainer);

      img.style.backgroundImage = `url(${currentSlide.img})`;
      title.value = currentSlide.h2
      desc.value = currentSlide.p
      
      const change = img.querySelector("label");
      change.addEventListener("click" , () => {
        stopSlideShow();
      })

      changeInput.addEventListener("change" , () => {
        stopSlideShow();
        label.style.display ="none"
        applyRemoveBtn.style.display = "flex";
        readFile(changeInput,img);

        applyBtn.addEventListener("click" , () => {
          const verified = verifyInputFields([title,desc]);
          if(verified){
            postSliderChanges(title.value,desc.value,"","slider",changeInput.files[0],currentSlide.id);
          }else{
            showErrorMessage("input all required fields");
            return;
          }
        })
      })

      Array.from(dotsContainer.children).forEach((dot,idx) => {
        dot.addEventListener("click" , () => {
          currentIndex = idx;
          showSliders()
        })
      })

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          imageDiv.style.transform = "translateY(0)";
          imageDiv.style.opacity = "1";

          textDiv.style.transform = "translateY(0) scale(1)";
          textDiv.style.opacity = "1";
        })
      })
      currentIndex++
    }else{
      showAddoptions();
    }

  })
  })
}

let sliderInterval = setInterval( showSliders, 6000);

function stopSlideShow(){
  clearInterval(sliderInterval);
}

function restartSlider(){
  clearInterval(sliderInterval)
  sliderInterval = setInterval( showSliders, 6000);
}

function showAddoptions(){
  console.log("no image")
}

function readFile(input,img){
  if(input.files.length > 0){
    const file = input.files[0];
    const filetype = file.type;

    if(!filetype.startsWith("image/")){
      showErrorMessage("a non-image file detected");
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const result = e.target.result;
      img.style.backgroundImage = `url(${result})`;
      if(img.classList.contains("image-file")) img.setAttribute('src' , result);
    }
    
    fileReader.readAsDataURL(file)
  }
}

function verifyInputFields(array){
  let allFilled = true;
  array.forEach(input => input.classList.remove("errors"));
  array.forEach(input => {
    if(input.value === ""){
      input.classList.add("errors");
      allFilled = false;
    }
  }) 

  if(allFilled){
    return true;
  }else{
    return false;
  }
}

function postSliderChanges(h2,description,rank,type,image,id = null){
  const sliderData = new FormData();
  sliderData.append("image", image);
  sliderData.append("h2", h2);
  sliderData.append("p" , description);
  sliderData.append("school_id" , "1");
  sliderData.append("rank" , rank);
  sliderData.append("type" , type);
  sliderData.append("id" , id || "");

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "admincalendar.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        if (response.type) {
          showSuccessMessage("changes applied succesfully");
          restartSlider();
          resumeInterval();
          label.style.display = "flex";
          applyRemoveBtn.style.display = "none";
          newSliderInput.value = "";
          changeInput.value = "";
          imageInput.value = "";
          imageInputs.value = "";
        }
      }
    } catch (error) {
      console.log("slider error", error);
    }finally{
      console.log(xhr.responseText)
    }
  };
  xhr.send(sliderData);

}

let selectedImage = null;

newSliderInput.addEventListener("change" , () => {
   label.style.display ="none"
   applyRemoveBtn.style.display = "flex";
   readFile(newSliderInput,img)
   stopSlideShow();

   title.value = "";
   desc.value = "";

   applyBtn.addEventListener("click" , () => {
     const verified = verifyInputFields([title,desc]);
    if(verified){
       postSliderChanges(title.value,desc.value,"","slider",newSliderInput.files[0]);
    }else{
      showErrorMessage("input all required fields");
      return;
    }
   })

})

showSliders();

//slideshow functions strt here
const applySchool = document.querySelector(".school-name");
const values = applySchool.querySelectorAll("textarea");
const linkInputs = document.querySelectorAll(".social-media-div span input");

let initialMottoLayout = {
  schoolInfo : [
    'motto-Better your best',
    'mission-Better your best',
    'vision-Better your best',
  ]
}

function displaySchoolInfo(){
  getUser((user) => {
   getSetup((schoolSetups) => {
    const thisSchool = schoolSetups.find(s => s.schoolId === user.schoolId);

    if(thisSchool){
      let layout = getLayout(thisSchool.layout);
      if(!layout) layout = initialMottoLayout;
      console.log(layout)

      const schoolInfo = layout.schoolInfo;
      if(schoolInfo){
       values.forEach((textarea) => {
        const matched = schoolInfo.find(s => {
          const [id] = s.split("-");
          return id === textarea.id;
        });

        if(matched){
          const [, text] = matched.split("-");
          textarea.value = text;
        }
      });
    }
    }
  });
  })
}

function getLayout(rawData){
   const result = {};
   const splitedData = rawData.split("&");
   splitedData.forEach(data => {
    const parts = data.split("/")
     const [type,values] = data.split("/");
     if(parts.length == 2){
       const valuesArray = values.split(":")
      if(!result[getType(type)]) result[getType(type)] = valuesArray;
     } 
   }) 
  return result;
}

function getType(type){
  switch(type){
    case "sc": return "schoolInfo";
    case "ln": return "schoolLinks";
  }
}

const getSchoolInfolayout = () => {
    const infoArray = (initialMottoLayout.schoolInfo).join(":");
    const links = Array.from(linkInputs).map(m => {
      return m.className +"-"+m.value
    }).join(":")
    const data = "sc"+"/"+infoArray+"&"+"ln"+"/"+links;
    return data;
}

values.forEach(input => {
  input.addEventListener("change" , () => {
     const data = Array.from(values).map(val => val.id+"-"+val.value);
     initialMottoLayout.schoolInfo = data;
     const infodata = getSchoolInfolayout();
     const verify = verifyInputFields(values);
     if(verify){
       updateSubjects(infodata);
     }
  })
})

const applySchoolInfo = document.querySelector(".applyz");
applySchoolInfo.addEventListener("click" , () => {
   const data = getSchoolInfolayout();
   const verify = verifyInputFields(values);
   if(verify){
     updateSubjects(data);
   }
})

displaySchoolInfo()

//school heads function start here

let currentIdx = 0;
const schoolHeadName = document.querySelector("#name");
const schoolHeadrank = document.querySelector("#rank");
const schoolHeadDesc = document.querySelector("#information");
const imageDiv = document.querySelector(".inputs .image img");

function displaySchoolHeads () {
  getUser((user) => {
     getSliders((sliders) => {
    const schoolHeads = sliders.filter(s => s.schoolId === user.schoolId && s.type === "head");
    if(schoolHeads.length > 0){
       if(currentIdx >= schoolHeads.length){
        currentIdx = 0;
       }else if(currentIdx < 0){
         currentIdx = 0;
       }  

       const currentHead = schoolHeads[currentIdx];
       schoolHeadName.value = currentHead.h2;
       schoolHeadDesc.value = currentHead.p;
       schoolHeadrank.value = currentHead.rank;
       imageDiv.setAttribute('src' , currentHead.img);

       currentIdx++;

       imageInput.addEventListener("change" , () => {
        stopInterval()
        readFile(imageInput,imageDiv);

        const applyBtn = document.querySelector(".inputs .apply");
        applyBtn.addEventListener("click" , () => {
          const verify = verifyInputFields([schoolHeadName,schoolHeadrank,schoolHeadDesc]);
          if(verify){
            postSliderChanges(schoolHeadName.value,schoolHeadDesc.value,schoolHeadrank.value,"head",imageInput.files[0],currentHead.id);
          }
        })
      })

    }else{
      
    }
  })
  })
}

displaySchoolHeads()
let schoolHeadInterval = setInterval(displaySchoolHeads , 6000);

function stopInterval(){
   clearTimeout(schoolHeadInterval);
}

function resumeInterval(){
  clearTimeout(schoolHeadInterval);
  schoolHeadInterval = setInterval(displaySchoolHeads , 6000);
}

const addbTn = document.querySelector(".add-head");
const deletebTn = document.querySelector(".delete-head");

addbTn.addEventListener("click" , () => {
  stopInterval();
  schoolHeadDesc.value = "";
  schoolHeadrank.value = "";
  schoolHeadName.value = "";
  imageInput.value = "";
  imageDiv.setAttribute('src' , "./teachers/profileimage.png");
  
  imageInputs.addEventListener("change" , () => {
    readFile(imageInputs,imageDiv);

      const applyBtn = document.querySelector(".inputs .apply");
      applyBtn.addEventListener("click" , () => {
        const verify = verifyInputFields([schoolHeadName,schoolHeadrank,schoolHeadDesc]);
        if(verify){
          postSliderChanges(schoolHeadName.value,schoolHeadDesc.value,schoolHeadrank.value,"head",imageInputs.files[0]);
      }
      })
  })

})




const applySchoolLinks = document.querySelector(".applyi");
applySchoolLinks.addEventListener("click" , () => {
   const data = getSchoolInfolayout();
   const verify = verifyInputFields(linkInputs);
   if(verify){
     updateSubjects(data);
   }
})


function displaySchoolLinks(){
  getUser((user) => {
     getSetup((schoolSetups) => {
    const thisSchool = schoolSetups.find(s => s.schoolId === user.schoolId);

    if(thisSchool){
      let layout = getLayout(thisSchool.layout);
      if(!layout) layout = initialMottoLayout;
      console.log(layout)

      const schoolInfo = layout.schoolLinks;
      if(schoolInfo){
            linkInputs.forEach((textarea) => {
        const matched = schoolInfo.find(s => {
          const [id] = s.split("-");
          return id === textarea.className;
        });
     
        if(matched){
          const [, text] = matched.split("-");
          textarea.value = text;
        }else{
          console.log("errro")
        }
      });
      }
    }
  });
  })
}

displaySchoolLinks()