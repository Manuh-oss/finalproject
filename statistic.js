const statisticalReport = document.querySelector(".statistic-report");
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

subjects.sort();

let n;
const streams = ["111", "333", "222", "444"];
const classes = ["1", "2", "3", "4"];

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

function getMarks(callback) {
  const form = new FormData();
  form.append("class", "");
  form.append("term", "");
  form.append("exam", "");
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "result.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Resultt Error", error);
    }
  };
  xhr.send(form);
}

const data = JSON.parse(localStorage.getItem("data"))

function mainFunction(){
  if(data.marks.length > 0){
    
    getSubjectTotalMeans(data.marks, (chartData) => {
      displaySubjectsChart(chartData);
    });

    getClassMeans(data.mode, data.marks , (chartData) => {
      displayStreamData(chartData)
    });

    getGenderMeans(data.marks , (chartData) => {
      displayGenderChart(chartData)
    });

    getGenderNumbers(data.marks , (chartData) => {
      displayGenderNumber(chartData);
    })

  }else{
    window.location.href = "analysis.html";
  }
}

//function to get subject mean totals
function getSubjectTotalMeans(analysisData,callback){
  getStudents((studente) => {
    const subjectArrays = {};
    const subjectMeans = {};
     analysisData.forEach(studentMark => {
        const studentData = studente.find(s => s.admission === studentMark.admission);

        if(studentData){
          for(let subj = 0; subj < subjects.length; subj++){
            if(studentData[subjects[subj]] !== "not-selected"){
               if(!subjectArrays[subjects[subj]]) subjectArrays[subjects[subj]] = [];
               subjectArrays[subjects[subj]].push(Number(studentMark[subjects[subj]])); 

               const total = subjectArrays[subjects[subj]].reduce((total , value) => total + value , 0);
               subjectMeans[subjects[subj]] =  total / subjectArrays[subjects[subj]].length;
            }
          }
        }
     });
     callback(subjectMeans)
  })
}

//function to display subjects chart
let chart = null;
function displaySubjectsChart(chartData){
  const canvas = document.getElementById("my-chart");
  if(chart !== null){
    chart.destroy();
  }

  const dataObject = {
    labels : Object.keys(chartData),
    datasets : [
      {
        data : Object.values(chartData),
        label : "subjects"
      }
    ]
  }

  chart = new Chart(
     canvas,
     {
      type : 'bar',
      data : dataObject,
      options : {
        responsive : true,
      }
     }
  )

}

//function to get both class and stream acording to the data
function getClassMeans(mode, analysisData,callback){
  getMarks((marks) => {
      const term = analysisData[0].term;
      const exam = analysisData[0].exam;
      const clas = analysisData[0].class;
      let comparingData;
    
      if(mode === "stream"){
        comparingData = marks.filter(mark => {
          return (
            mark.class === clas &&
            mark.exam === exam &&
            mark.term === term
          )
        })       
      }else if(mode === "classes"){
        comparingData = analysisData;
      }

      const classMeans = {};

      for(let x = 0; x < streams.length; x++){
        const streamData = comparingData.filter(mark => mark.stream === streams[x])
        const totals = streamData.reduce((total , value) => total + Number(value.mean) , true);
        classMeans[streams[x]] = totals / streamData.length;
      }
      callback(classMeans)
  })
}

function covertStream(rawStream) {
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
      return "purle";
      break;
    default:
      return "green";
  }
}

let streamChart = null;
function displayStreamData(chartData){
  const canvas = document.getElementById("agenda");
  if(streamChart !== null) streamChart.destroy();

  const streamData = {
    labels : Object.keys(chartData).map(m => covertStream(m)),
    datasets : [
      {
        data : Object.values(chartData),
        label : "stream data"
      }
    ]
  }

  streamChart = new Chart(
    canvas,
    {
      type : 'bar',
      data : streamData
    }
  )

}

function getGenderMeans(analysisData, callback) {
  const genders = ["male", "female"];

  getStudents((students) => {
    const genderMean = {};

    genders.forEach(gender => {
      // Get all student admissions for this gender
      const genderAdmissions = students
        .filter(s => s.gender === gender)
        .map(s => s.admission);

      // Get analysisData entries that belong to these students
      const genderData = analysisData.filter(entry =>
        genderAdmissions.includes(entry.admission)
      );

      // Sum their 'mean' values
      const total = genderData.reduce((sum, entry) => sum + Number(entry.mean), 0);
      const mean = genderData.length > 0 ? total / genderData.length : 0;

      genderMean[gender] = mean;
    });

    callback(genderMean);
  });
}


let genderChart = null;

function displayGenderChart(chartData){
  const canvas = document.getElementById("gender-chart");
  if(genderChart !== null) genderChart.destroy();

  const streamData = {
    labels : Object.keys(chartData),
    datasets : [
      {
        data : Object.values(chartData),
        label : "stream data"
      }
    ]
  }

  genderChart = new Chart(
    canvas,
    {
      type : 'bar',
      data : streamData
    }
  )
}


function getGenderNumbers(analysisData,callback){
  getStudents((students) => {
      const genderNumbers = {};
      const genders = ["male", "female"];
     genders.forEach(gender => {
       const genderArry = students.filter(s => s.gender === gender).map(s => s.admission);
       const number = analysisData.filter(entry => genderArry.includes(entry.admission));

       genderNumbers[gender] = number.length;
    })
    callback(genderNumbers)
  })  
}

let numberChart = null;
function displayGenderNumber(chartData){
  if(numberChart !== null) numberChart.destroy();
  const canvas = document.getElementById("all-students");
  const streamData = {
    labels : Object.keys(chartData),
    datasets : [
      {
        data : Object.values(chartData),
        label : "stream data"
      }
    ]
  }

  console.log(chartData)

  numberChart = new Chart(
    canvas,
    {
      type : 'doughnut',
      data : streamData,
      options : {
        responsive : true,
        maintainAspectRatio: false,
        cutout: '50%' 
      }
    }
  )
}

mainFunction();

