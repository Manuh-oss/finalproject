const examSelect = document.getElementById("exam");
const termSelect = document.getElementById("term");
const classSelect = document.getElementById("class");
const streamSelect = document.getElementById("stream");
const table = document.querySelector(".table");
const noresult = document.querySelector(".no-result");
const otherTable = document.querySelector(".other-table");

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
  "mean"
];

const grades = [
  "a", "a-",
  "b+", "b", "b-",
  "c+", "c", "c-",
  "d+", "d", "d-",
  "e",
];



const printButton = document.querySelector(".button button");

let term;
let exam;
let clas;
let stream;
let printMode;

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

function getResults(callback) {
  const data = new FormData();
  data.append("class", "");
  data.append("term", "");
  data.append("exam", "");

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "result.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("result error", error);
    }
  };
  xhr.send(data);
}

function displayRollcall() {
  getResults((studentResults) => {
    getStudents((students) => {
      const thisExamResults = studentResults.filter((result) => {
        return (
          (result.exam) === (exam) &&
          (result.term) === (term) &&
          (result.class) === (clas) &&
          (result.stream) === (stream)
        );
      }); // this gets the exact exam results

      if(thisExamResults.length > 0){
        printMode = true;
        const rollCallTable = table.querySelector("table tbody");
        table.style.display = "flex";
        rollCallTable.innerHTML = "";

        if(noresult) noresult.style.display = "none";

        thisExamResults.sort((a,b) => Number(b.mean) - Number(a.mean));

        thisExamResults.forEach(studentResult => {
            const studentDetails = students.find((student) => 
              student.admission === studentResult.admission
            );
            const tr = document.createElement("tr");
            const name = studentDetails.firstname+" "+studentDetails.middlename+" "+studentDetails.lastname
            if(studentDetails){
               tr.innerHTML = `
                <td>${studentResult.meanPosition}</td>
                <td>${studentDetails.admission}</td>
                <td style='text-align:left;'>${name}</td>
                <td>${studentResult.english}</td>
                <td>${studentResult.kiswahili}</td>
                <td>${studentResult.mathematics}</td>
                <td>${studentResult.chemistry}</td>
                <td>${studentResult.biology}</td>
                <td>${studentResult.physics}</td>
                <td>${studentResult.geography}</td>
                <td>${studentResult.history}</td>
                <td>${studentResult.cre}</td>
                <td>${studentResult.agriculture}</td>
                <td>${studentResult.business}</td>
                <td>${studentResult.computer}</td>
                <td>${studentResult.french}</td>
               `;
            }
            rollCallTable.appendChild(tr);
        })
        getSubjectTotalMeans();
        displayGradeCount();
      }else{
         noresult.style.display = "flex";
         if(table.style.display = "flex"){
            table.style.display = "none";
         }
      }
    });
  });
}

function getSubjectTotalMeans(){
  getResults((results) => {
  getStudents((studente) => {
    const subjectArrays = {};
    const subjectMeans = {};
    const genders = ["male","female"] 
    genders.forEach(gen => {
        const analysisData = results.filter(res => {
          return (
          res.class === clas &&
          res.stream === stream &&
          res.exam === exam &&
          res.term === term)
        })

        analysisData.forEach(studentMark => {
        const studentData = studente.find(s => s.admission === studentMark.admission && s.gender === gen);

       if(!subjectMeans[gen]) subjectMeans[gen] = {}

        if(studentData){
          for(let subj = 0; subj < subjects.length; subj++){
            if(studentData[subjects[subj]] !== "not-selected"){
               if(!subjectArrays[subjects[subj]]) subjectArrays[subjects[subj]] = [];
               subjectArrays[subjects[subj]].push(Number(studentMark[subjects[subj]])); 

               const total = subjectArrays[subjects[subj]].reduce((total , value) => total + value , 0);
               subjectMeans[gen][subjects[subj]] =  (total / subjectArrays[subjects[subj]].length).toFixed(1);
            }
          }
        }
     });
    })
    displayOtherTable(subjectMeans)
  })
  })
}

function displayOtherTable(data){
  const gender = Object.keys(data);
  const tbody = otherTable.querySelector("tbody");
  if (tbody) {
    tbody.innerHTML = "";
    otherTable.style.display = "flex";

    gender.forEach(gen => {
      const tr = document.createElement("tr");
      const firstTd = document.createElement("td");
      firstTd.style.textAlign = "left"
      firstTd.textContent = gen;
      tr.appendChild(firstTd)
      for (let s = 0; s < subjects.length; s++) {
        const td = document.createElement("td");
        td.textContent = data[gen][subjects[s]] || "-"
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });

      const meanRow = document.createElement("tr");
      const firstTd = document.createElement("td");
      firstTd.textContent = "mean";
      firstTd.style.textAlign = "left"
      meanRow.appendChild(firstTd)
      subjects.forEach((subject, index) => {
        const td = document.createElement("td");

        const maleVal = parseFloat(data["male"][subject]);
        const femaleVal = parseFloat(data["female"][subject]);
        if (!isNaN(maleVal) && !isNaN(femaleVal)) {
        const mean = ((maleVal + femaleVal) / 2).toFixed(1);
        td.textContent = mean || "-";
        } 

          meanRow.appendChild(td);
        });

  tbody.appendChild(meanRow);
  }
}

function displayGradeCount(){
   getResults((results) => {
   getStudents((studente) => {
    const genders = ["male","female"] 
    const gradeCountObj = {};
    genders.forEach(gen => {
        const analysisData = results.filter(res => {
          return (
          res.class === clas &&
          res.stream === stream &&
          res.exam === exam &&
          res.term === term)
        })
       const data = analysisData.flatMap(res => {
          const student = studente.find(s => s.admission === res.admission && s.gender === gen);
          return student ? res.mean : [];
       })

       const studentGrades = data.map(d => getGrades(d));

       if(!gradeCountObj[gen]) gradeCountObj[gen] = {};
       
       grades.forEach(grade => {
        const gradeCount = studentGrades.filter(s => s.toLowerCase() === grade.toLowerCase());
        gradeCountObj[gen][grade] = gradeCount.length || 0 ;
       })
       
    })
    displayGradeCountTable(gradeCountObj);
  })
  })
}

function displayGradeCountTable(data){
  const gender = Object.keys(data);
  const tbody = document.querySelector(".grade-count table tbody");

  if(tbody){
    tbody.innerHTML = "";
      gender.forEach(gen => {
        const tr = document.createElement("tr");
        const firstTd = document.createElement("td");
        firstTd.style.textAlign = "left"
        firstTd.textContent = gen;
        tr.appendChild(firstTd)
        grades.forEach(grade => {
          const td = document.createElement("td");
          td.textContent = data[gen][grade];
          tr.appendChild(td)
        })
        tbody.appendChild(tr);
      })
  }
}

function getGrades(marks) {
  let mark = Number(marks);
  let grade;
  if (mark <= 34 && mark > 0) {
    grade = "e";
  } else if (mark > 34 && mark <= 39) {
    grade = "d-";
  } else if (mark > 39 && mark <= 44) {
    grade = "d";
  } else if (mark > 44 && mark <= 49) {
    grade = "d+";
  } else if (mark > 49 && mark <= 54) {
    grade = "c-";
  } else if (mark > 54 && mark <= 59) {
    grade = "c";
  } else if (mark > 59 && mark <= 64) {
    grade = "c+";
  } else if (mark > 64 && mark <= 69) {
    grade = "b-";
  } else if (mark > 69 && mark <= 74) {
    grade = "b";
  } else if (mark > 74 && mark <= 79) {
    grade = "b+";
  } else if (mark > 79 && mark <= 84) {
    grade = "a-";
  } else if (mark > 84 && mark <= 99) {
    grade = "a";
  } else if (mark <= 0) {
    grade = "e";
  }
  return grade;
}

let allIsFilled = true;

[examSelect, classSelect, streamSelect, termSelect].forEach((select) => {
  select.addEventListener("change", () => {
    exam = examSelect.value || "22";
    term = termSelect.value || "2";
    clas = classSelect.value;
    stream = streamSelect.value;

    displayRollcall();
  });
});

printButton.addEventListener("click" ,(e) => {
    e.stopPropagation();
    if(printMode){
        window.print();
    }
})