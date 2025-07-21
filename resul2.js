const examSelect = document.getElementById("exam");
const termSelect = document.getElementById("term");
const classSelect = document.getElementById("class");
const streamSelect = document.getElementById("stream");
const table = document.querySelector(".table");
const noresult = document.querySelector(".no-result");

const printButton = document.querySelector(".button button");

printButton.addEventListener("click" , (e) => {
  e.stopPropagation()
  window.print();
})

//function to getStudents
function getStudents(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "students.php", true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      callback(response);
    }
  };
  xhr.send();
}

//function to get their results
function getResults() {
  const param = new FormData();
  param.append("class", classSelect.value);
  param.append("term", termSelect.value || 2);
  param.append("exam", examSelect.value || 22);
  const body = table.querySelector("tbody");
  body.innerHTML = ""
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "result.php", true);
  xhr.onload = () => {
    try{
        if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      if(response.length > 0){
          if(table.classList.contains("hidden")) table.style.display = "flex";
          const title = document.querySelector(".result-title");
          title.textContent = `term${termSelect.value || "2"} ${converExam(examSelect.value || "22")}`;
          noresult.style.display = "none";
          noresult.classList.add("hidden");
          getStudents((students) => {
        students.forEach((student) => {
          response.forEach((result) => {
              if(result.admission === student.admission && result.stream === streamSelect.value){
                  const tr = document.createElement("tr");
                  tr.innerHTML = `
                      <td>${student.admission}</td>
                      <td style='text-align:left;'>${student.firstname} ${student.middlename} ${student.lastname}</td>
                      <td>${result.english}</td>
                      <td>${result.kiswahili}</td>
                      <td>${result.mathematics}</td>
                      <td>${result.chemistry}</td>
                      <td>${result.biology}</td>
                      <td>${result.physics}</td>
                      <td>${result.geography}</td>
                      <td>${result.history}</td>
                      <td>${result.cre}</td>
                      <td>${result.agriculture}</td>
                      <td>${result.business}</td>
                      <td>${result.computer}</td>
                      <td>${result.french}</td>
                  `;
              body.appendChild(tr);
              }
          });
        });
      });
      }else{
       if(noresult.classList.contains("hidden")) noresult.style.display = "flex";
        noresult.style.display = "flex";
        table.style.display = "none";
        table.classList.add("hidden");
      }
    }
    }catch(error){
      console.log("result error" , error);
    }finally{
      console.log(xhr.responseText)
    }
  };
  xhr.send(param);
}

function converExam(rawExam){
  switch (rawExam){
    case "11":
      return "opener";
    break;
    case "22":
      return "midterm";
    break;
    case "33":
      return "endterm";
    break;      
  }
}

//event listeners
classSelect.addEventListener("change", getResults);
termSelect.addEventListener("change", getResults);
examSelect.addEventListener("change", getResults);
streamSelect.addEventListener("change", getResults);