const ctx = document.getElementById("cumulativeBarChart").getContext("2d");
const subjectSelect = document.getElementById("subject-one");
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
  "agriculture",
  "business",
  "computer",
  "french",
];

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
      console.log("student error", error);
    }
  };
  xhr.send();
}

//function to getMarks
function getStudentMarks(callback) {
  getUser((user) => {
    const data = new FormData();
    data.append("term", "");
    data.append("exam", "");
    data.append("class", "");
    data.append("id", "");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "result.php", true);
    xhr.onload = () => {
      try {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const thisSchool = response.filter(
            (s) => s.schoolId === user.schoolId
          );
          callback(thisSchool);
        }
      } catch (error) {
        console.log("result error", error);
      }
    };
    xhr.send(data);
  });
}

//function to get user
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

//function to filter leraned user lessons
function getUserSubjects() {
  getStudents((students) => {
    getUser((user) => {
      loadSchoolData((schoolData) => {
        if (user.from !== "student") return;
        const myDetails = students.find((s) => s.admission === user.code); //find s the user
        const schoolSubjects = schoolData.subjects;
        const mySubjects = schoolSubjects.filter(
          (s) => myDetails[s] !== "not-selected"
        ); //filters out the dropped subjects

        if (mySubjects.length > 0) {
          const defaultOption = document.createElement("option");
          defaultOption.textContent = "mean marks";
          defaultOption.value = "mean"; //this creates a default option
          subjectSelect.appendChild(defaultOption);

          mySubjects.forEach((subj , idx) => {
            const option = document.createElement("option");
            option.value = myDefaultSubjects[idx];
            option.textContent = subj;

            subjectSelect.appendChild(option);
          });

          subjectSelect.addEventListener("input", function (e) {
            const h2 = subjectSelect.previousElementSibling;
            if (h2) {
              const span = h2.querySelector("span");
              const index = myDefaultSubjects.indexOf(e.target.value);
              span.textContent = schoolSubjects[index];
              handleMarks(e.target.value);
            }
          });
        }
      });
    });
  });
}

//function to prepare the marks
function handleMarks(type) {
  getUser((user) => {
    getStudentMarks((marks) => {
      let admission;
      if (user.from === "student") {
        admission = user.code;
      } else {
        //this is just to check if it is a redirection or something
        const params = new URLSearchParams(window.location.search);
        const urlAdmission = params.get("admission");
        if (urlAdmission) admission = urlAdmission;
      }

      let groupedTerm = {};
      const myMarks = marks.filter((m) => m.admission === admission);
      if (myMarks.length > 0) {
        myMarks.forEach((myExamMArks) => {
          const term = myExamMArks.term;
          if (!groupedTerm[term]) {
            groupedTerm[term] = [];
          }
          groupedTerm[term].push(myExamMArks);
        });
      }

      getTermTotals(groupedTerm, type, (termTotals) =>  {
          const chartData = getChartData(termTotals);
          displayChart(chartData);
      });
    });
  });
}

//this bellow function future manuh was just trying but i will help you understand it
/* the thing is for this chart to achieve my desired ambition i had :
   1.i had to achieve a certail format 
   {
     label : "this contained the term came"
     data : "this sored data for all terms eg for all term ones from form 1 to 4"
     backgroundColor : "this is just to  provide distintion among the term"
      categoryPercentage: 0.6, // controls group width
        barPercentage: 0.8       // controls individual bar width
   }
   2 . what i did after i succesfully grouped all the data in accordance to term
       i gave the results as a parameter to the elow function

*/

function getTermTotals(object, type,callback) {
  loadSchoolData((schoolData) => {
      const totals = {};
      const classes = schoolData.classes;
      console.log(object)
      Object.entries(object).forEach(([term, termData]) => {
        //you will understand this
      // to sort the classes inascending order
        totals["term" + term] = []; //creates that data
        classes.forEach((clas) => {
          const filtered = termData.filter((c) => c.class === clas);
          let mean = 0;
          if(filtered.length > 0){
             const totalPerTerm = filtered.reduce(
              (sum, val) => sum + Number(val[type] || 0),
              0
            );
            mean = totalPerTerm / filtered.length || 0;
            }
            totals["term" + term].push(mean);
        });
      });
      callback(totals);
    })
}

function getChartData(termData) {
  let dataArray = [];
  console.log(termData)
  Object.entries(termData).forEach(([term, classData]) => {
    let object = {
      label: term,
      data: classData,
      categoryPercentage: 0.6,
      barPercentage: 0.8,
    };
    dataArray.push(object);
  });
  return dataArray;
}

let chart = null;
function displayChart(data) {
  loadSchoolData((schoolData) => {
  const canvas = document.querySelector("#cumulativeBarChart");
  if (chart !== null) {
    chart.destroy();
  }

  const dataObject = {
    labels: schoolData.classes,
    datasets: data,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Average Marks Per Form (Grouped by Term)",
          font: { size: 18 },
        },
        legend: { position: "top" },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Form",
          },
          grid: {
            drawOnChartArea: false, // optional cleaner look
          },
        },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 10,
          },
          title: {
            display: true,
            text: "Marks",
          },
        },
      },
    },
  };

  console.log(data);

  chart = new Chart(canvas, {
    type: "bar",
    data: dataObject,
  });
})
}

getUserSubjects();
handleMarks("mean");
