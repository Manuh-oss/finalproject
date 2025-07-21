const notesContainer = document.getElementById("editor");
const textarea = document.getElementById("notes");
const liInputs = document.querySelector("#list-number");
const topicSelect = document.querySelector("#topic-select");
const subjectSelect = document.querySelector("#subject-select");
const classSelect = document.querySelector("#class");
const selectForm = document.querySelector(".select");
const improvedError = document.getElementById("error-message");
const improvedSuccess = document.getElementById("success-message");
const closePopup = document.querySelectorAll(".close-btn");
const submitBtn = document.querySelector(".button .submit");
const teacherCode = document.querySelector("#teacher-code");

//function section
//functioon to get teacher code from login
function getUser() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "saved_user.php", true);
  xhr.onload = () => {
    if (xhr.status == 200) {
      const tcode = JSON.parse(xhr.responseText);
      teacherCode.value = tcode.code;
      getSubjects(tcode.code);
    }
  };
  xhr.send();
}

//function to get subject based on the teacher
function getSubjects(code) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "teachers.php", true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      const match = response.find((t) => t.teacherCode === code);
      let options = `
          <option value="">select subject</option>
          <option value="${match.subjectOne}">${match.subjectOne}</option>
          <option value="${match.subjectTwo}">${match.subjectTwo}</option>
        `;
      subjectSelect.innerHTML = options;
    }
  };
  xhr.send();
}

//function to get topics on the selected subject
function getTopics() {
  getNotes();
  const param =
    "class=" + classSelect.value + "&subject=" + subjectSelect.value;
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "getTopics.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if (response.length > 0) {
        topicSelect.innerHTML = "";
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select Topic";
        topicSelect.appendChild(defaultOption);
        response.forEach((topic) => {
          const option = document.createElement("option");
          option.value = topic.topic_tittle;
          option.textContent = topic.topic_tittle;
          topicSelect.appendChild(option);
        });
      } else {
        showErrorMessage("there are no allocated topics");
      }
    }
  };
  xhr.send(param);
}

//function to getNotes
function getNotes() {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "getnotes.php", true);
  xhr.onload = () => {
    if (xhr.status == 200) {
      const messages = JSON.parse(xhr.responseText);
      const note = messages.find(
        (n) =>
          n.teacherCode === teacherCode.value &&
          n.class === classSelect.value &&
          n.topic === topicSelect.value &&
          n.subject === subjectSelect.value
      );
      if (note) {
        quill.clipboard.dangerouslyPasteHTML(note.notes);
      } else {
        console.log(
          "no notes were found for the selected class,subject,topic and teacher"
        );
      }
    }
  };
  xhr.send();
}

//function to post notes to the database
function postNotes() {
  textarea.value = quill.root.innerHTML;
  const topicForm = new FormData();
  topicForm.append("subject", subjectSelect.value);
  topicForm.append("class", classSelect.value);
  topicForm.append("topic", topicSelect.value);
  topicForm.append("notes", textarea.value);
  topicForm.append("code", teacherCode.value);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "postnotes.php", true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = xhr.responseText;
      console.log(response);
    }
  };
  xhr.send(topicForm);
}

//this functions do the function of adding tables,list,bold,itallics and underlinement
function generateTable() {
  const table = document.createElement("table");
  for (let r = 0; r < userRows.value; r++) {
    const tr = document.createElement("tr");
    for (let c = 0; c < userColumns.value; c++) {
      const td = document.createElement("td");
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  notesContainer.appendChild(table);
}

//function to generate list
function generateList() {
  const ul = document.createElement("ul");
  for (let n = 0; n < liInputs.value; n++) {
    const li = document.createElement("li");
    ul.appendChild(li);
  }
  notesContainer.appendChild(ul);
}

//error handling section
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

//text editting function all with the quill cdn module
const toolBarAccessories = [
    [{ header: [1, 2, 3, false] }],
    ['bold','italic','underline','strike'],
    [{list : "ordered"} , {list : "bullet"} , {list : "unordered"}],
    ['link', 'image','video'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }]
];  

const quill = new Quill("#editor" , {
    theme: 'snow',
    modules: {
      toolbar: toolBarAccessories
    }
});

//function calls
getUser();
getTopics();

//event listeners
classSelect.addEventListener("change", getTopics);
subjectSelect.addEventListener("change", getTopics);
topicSelect.addEventListener("change", getNotes);
submitBtn.addEventListener("click", postNotes);


