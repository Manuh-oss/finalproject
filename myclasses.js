const myClassesTable = document.querySelector(".body .table");
const termSelect = document.querySelector("#term");
const examSelect = document.querySelector("#exam");
const starBtn = document.querySelector(".gender-star");
const buttonBox = document.querySelector(".buttonz");
let previousPaage ;
let mainclas;
let mainstream;
let mainsubject;
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
];

const streams = ["111", "222", "333", "444"];

let selectedSubjectMark;
let streamStudents = [];
//functioon to get teacher code from login
function getUser(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "saved_user.php", true);
  xhr.onload = () => {
    if (xhr.status == 200) {
      const tcode = JSON.parse(xhr.responseText);
      callback(tcode);
    }
  };
  xhr.send();
}

//function section start here
function getStudents(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "students.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Student Error", error);
    }
  };
  xhr.send();
}

//function to get results from database
function getStudentMarks(clas, term, exam, callback) {
  const data = new FormData();
  data.append("class", clas);
  data.append("term", term);
  data.append("exam", exam);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "result.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Marks Error", error);
    }
  };
  xhr.send(data);
}

//function to get lessons
function getLessons(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "lesson.php", true);
  xhr.onload = () => {
    if (xhr.status == 200) {
      const response = JSON.parse(xhr.responseText);
      callback(response);
    }
  };
  xhr.send();
}

//function to display the lessons

function displayLessons() {
  getUser((user) => {
    getLessons((lessons) => {
      const myLessons = lessons.filter((l) => l.teacherCode === user.code);
      if (myLessons.length > 0) {
        const tbody = myClassesTable.querySelector("table tbody");
        tbody.innerHTML = "";
        myLessons.forEach((lesson, idx) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
                <td>${idx + 1}</td>
                <td>form${lesson.class}</td>
                <td>${convertStream(lesson.stream)}</td>
                <td>${lesson.subject}</td>
                <td><button type="button" onclick="viewResult('${
                  lesson.class
                }','${lesson.stream}','${
            lesson.subject
          }')" class="view">view</button></td>
            `;
          tbody.appendChild(tr);
        });
      } else {
      }
    });
  });
}

function viewResult(clas, stream, subject) {
  const tableContainer = myClassesTable.parentElement;
  const viewContainer = document.querySelector(".view-class");
  buttonBox.style.display = "flex";
  previousPaage = "lesson-box";
  let termSelect = document.querySelector("#term").value || "2";
  let examSelect = document.querySelector("#exam").value || "22";

  tableContainer.style.display = "none";
  viewContainer.style.display = "flex";

  getStudents((studentsData) => {
    getStudentMarks(clas, termSelect, examSelect, (studentMarks) => {
      mainclas = clas;
      mainstream = stream;
      mainsubject = subject;
      let groupedSUbjectMarks = {};
      let streamStudents = [];
      otherTeachersMarks();

      const thisStreamStudents = studentMarks.filter(
        (sm) => sm.stream === stream
      );

      subjects.forEach((subj) => {
        groupedSUbjectMarks[subj] = [];

        thisStreamStudents.forEach((studentMark) => {
          const found = studentsData.find(
            (student) => student.admission === studentMark.admission
          );
          const foundMark = thisStreamStudents.find(
            (student) => student.admission === studentMark.admission
          );

          if (found && found[subj] !== "not-selected") {
            groupedSUbjectMarks[subj].push(studentMark[subj]);

            if (!streamStudents.some((s) => s.admission === found.admission)) {
              streamStudents.push({
                name: `${found.firstname} ${found.middlename} ${found.lastname}`,
                mark: foundMark[subject],
                admission: found.admission,
                subject: subject,
                stream: convertStream(found.stream),
                class: "form" + found.class,
              });
            }
          }
        });
      });

      const mySubject = groupedSUbjectMarks[subject]; // make sure subject is passed correctly
      selectedSubjectMark = mySubject;
      const counts = getCounts(mySubject);
      displayAnalysis(counts);
      displayStudents(streamStudents);
    });
  });
}

function displayStudents(students) {
  const arranged = students.sort((a, b) => b.mark - a.mark);
  const tbody = document.querySelector(".top-students table tbody");
  tbody.innerHTML = "";
  let count = 0;
  arranged.forEach((row) => {
    count++;
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${row.subject}</td>
            <td>${row.admission}</td>
            <td>${row.name}</td>
            <td>${row.class} ${row.stream}</td>
            <td>${row.mark}</td>
            <td>${getGrade(row.mark)}</td>
        `;
     if (count > 3) {
      tr.style.display = "none";
      tr.classList.add("hidden-tr")
    }

    tbody.appendChild(tr);  
  });

  const viewAll = document.querySelector(".view-more");
  viewAll.addEventListener("click" , (e) => {
  e.stopPropagation();  
  const hiddenRows = document.querySelectorAll(".hidden-tr");
  const isHidden = hiddenRows[0]?.style.display === "none";

  hiddenRows.forEach(row => {
    row.style.display = isHidden ? "table-row" : "none";
  });

  viewAll.textContent = isHidden ? "Show Top 3" : "Show All";
  })
}

function getCounts(marks) {
  const grades = marks.map((m) => getGrade(m));
  let a = 0;
  let b = 0;
  let c = 0;
  let d = 0;
  let e = 0;
  let total = 0;
  grades.forEach((element) => {
    total++;
    if (element === "a" || element === "a-") {
      a++;
      console.log("alah");
    } else if (element === "b" || element === "b+" || element === "b-") {
      b++;
      console.log("alah");
    } else if (element === "c" || element === "c+" || element === "c-") {
      c++;
    } else if (element === "d" || element === "d+" || element === "d-") {
      d++;
    } else if (element === "e") {
      e++;
    }
  });
  return {
    aGrade: [a, (a / total) * 100 + "%"],
    bGrade: [b, (b / total) * 100 + "%"],
    cGrade: [c, (c / total) * 100 + "%"],
    dGrade: [d, (d / total) * 100 + "%"],
    eGrade: [e, (e / total) * 100 + "%"],
  };
}

function displayAnalysis(count) {
  const ul = document.querySelector(".analysis-box ul");
  ul.innerHTML = "";
  const inner = `
      <li>
         <p>A</p>
         <p class="tally">${count["aGrade"][0]}</p>
         <div class="progress"><div class="juice" style="width:${count["aGrade"][1]}; background-color:#28a745; height:100%;"></div></div>
     </li>
          <li>
          <p>B</p>
          <p class="tally">${count["bGrade"][0]}</p>
          <div class="progress"><div class="juice" style="width:${count["bGrade"][1]}; background-color:#14AAF5; height:100%;"></div></div>
      </li>
      <li>
          <p>C</p>
          <p class="tally">${count["cGrade"][0]}</p>
          <div class="progress"><div class="juice" style="width:${count["cGrade"][1]}; background-color:#FF9933; height:100%;"></div></div>
      </li>
      <li>
          <p>D</p>
          <p class="tally">${count["dGrade"][0]}</p>
          <div class="progress"><div class="juice" style="width:${count["dGrade"][1]}; background-color:#B8255F; height:100%;"></div></div>
      </li>
      <li>
          <p>E</p>
          <p class="tally">${count["eGrade"][0]}</p>
          <div class="progress"><div class="juice" style="width:${count["eGrade"][1]}; background-color:#DB4035; height:100%;"></div></div>
      </li>
      `;
  if (ul) {
    ul.innerHTML = inner;
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

//function to getGrades
function getGrade(marks) {
  let mark = parseInt(marks);
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

//graphs section

let otherTeacherGraph = null;

function otherTeachersMarks() {
  getStudentMarks(mainclas,termSelect.value || "2",examSelect.value || "22",(studentMarks) => {
      getStudents((students) => {
        let groupedStreamMarks = {}; //this stores the stream datta console log it for clarification
        studentMarks.forEach((studentMark) => {
          //loop through each student mark
          const found = students.find( (s) => s.admission === studentMark.admission); //this checks if the student actually dropped the subject or not
          if (found) {
            //if the student exist
            if (found[mainsubject] !== "not-selected") {
              // and he never dropped the subject
              streams.forEach((stream) => {
                if (!groupedStreamMarks[stream]) {
                  groupedStreamMarks[stream] = [];
                }
                if (stream === found.stream) {
                  // and the streams match
                  groupedStreamMarks[stream].push({
                    marks : Number(studentMark[mainsubject]),
                    gender : found.gender
                  }
                  ); //the their marks to the array o fthe stream
                }
              });
            }
          }
        });

        displayGenderChart(groupedStreamMarks);

        let means = {};
        //this gets the means of each streams marks
        Object.entries(groupedStreamMarks).forEach(([stream, marks]) => {
          const total = marks.reduce((sum, val) => sum + val.marks, 0);
          const mean = total / marks.length;
          means[stream] = mean;
        });

        const chartCanvas = document.getElementById("other-teachers");
        const chartData = {
          labels: Object.keys(means).map(name => convertStream(name)),
          datasets: [
            {
              data: Object.values(means),
              label: "otherteachers",
            },
          ],
          Options: [
            {
              responsive: true,
              maintainAspectRatio: false,
            },
          ],
        };

        if(otherTeacherGraph !== null){
          otherTeacherGraph.destroy()
        }

        otherTeacherGraph = new Chart(chartCanvas, {
          type: "bar",
          data: chartData,
        });
      });
    }
  );
}

let genderMeanChart = null;
let genderCount = null;
function displayGenderChart(object){
  Object.entries(object).forEach(([stream,data]) => {
    if(stream === mainstream){
      const males = data.filter(student => student.gender === "male")
      const females = data.filter(student => student.gender === "female")
      const maleTotal = males.reduce((total , val) => total + val.marks , 0)
      const femaleTotal = females.reduce((total , val) => total + val.marks , 0)
      let mean = [];
      const maleMean = maleTotal / males.length; 
      const femaleMean = femaleTotal / females.length; 
      mean.push(maleMean.toFixed(3))
      mean.push(femaleMean.toFixed(3))
      const genderMeanChartDisplay = document.getElementById("mean-gender")
      const genderCountDisplay = document.getElementById("total-students")
       
      if(genderMeanChart !== null){
        genderMeanChart.destroy();
      }

      if(genderCount !== null){
        genderCount.destroy();
      }

      const totalStudents = {
        labels : ['male','female'],
        datasets : [{
          data : [males.length,females.length],
          label : `Total ${mainsubject} students`
        }]
      }

      genderCount = new Chart(
         genderCountDisplay,
         {
          type : 'doughnut',
          data : totalStudents
         }
      )

      const meanData = {
        labels : ['male','female'],
        datasets : [{
          data  : mean,
          label : 'mean gender performance',
        }],
        Options : [{
          responsive : true,
          maintainAspectRatio : false
        }]
      }
      
      genderMeanChart = new Chart(
        genderMeanChartDisplay,
        {
          type : 'bar',
          data : meanData
        }
      )
    }
  })
}

//graph section ends here
displayLessons();
//event listeners
termSelect.addEventListener("change", () => {
  viewResult(mainclas, mainstream, mainsubject);
  otherTeachersMarks();
});
examSelect.addEventListener("change", () => {
  viewResult(mainclas, mainstream, mainsubject);
  otherTeachersMarks();
});

starBtn.addEventListener("click", function () {
  document.querySelector(".main .centralise .body").style.display = "none";
  document.querySelector(".view-class").style.display = "none";
  document.querySelector(".graphs-section").style.display = "flex";
  previousPaage = "viewpage";
});

const backButton = buttonBox.querySelector(".back");
backButton.addEventListener("click" , (e) => {
  e.stopPropagation();
  if(previousPaage === "viewpage"){
      document.querySelector(".main .centralise .body").style.display = "none";
      document.querySelector(".view-class").style.display = "flex";
      document.querySelector(".graphs-section").style.display = "none";
      previousPaage = "lesson-box";
  }else if(previousPaage === "lesson-box"){
       window.location.reload()
  }else{
    window.location.reload();
  }
})
