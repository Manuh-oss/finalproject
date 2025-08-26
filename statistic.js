const statisticalReport = document.querySelector(".statistic-report");
const progressContainer = document.getElementById("container");

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

let n;
const streams = ["111", "333", "222", "444"];
const classes = ["1", "2", "3", "4"];

//function section start here
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

async function getMarks() {
  showLoader("fetching student marks...");
  const user = await getUser();
  const data = new FormData();
  data.append("class", "");
  data.append("exam", "");
  data.append("term", "");
  data.append("id", "");

  try {
    const response = await fetch("result.php", {
      method: "POST",
      body: data,
    });
    const result = await response.json();
    const schoolResult = result.filter((r) => r.schoolId === user.schoolId);
    return schoolResult;
  } catch (error) {
    console.log("marks error", error);
  } finally {
    removeLoader();
  }
}

const data = JSON.parse(localStorage.getItem("data"));

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

function getStreams(rawStreams) {
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

function getClases(rawClases) {
  const rawclasesArray = rawClases.split("-");
  const classArray = rawclasesArray.map((s) => {
    const [classes] = s.split("/");
    return classes;
  });
  return classArray;
}

async function mainFunction() {
  if (data.marks.length > 0) {
    const subjectChartData = await getSubjectTotalMeans(data.marks);
    displaySubjectsChart(subjectChartData);

    await getClassMeans(data.marks, data.mode);

    const genderData = await getGenderMeans(data.marks);
    console.log(genderData);
    await displayGenderChart(genderData);

    const numbers = await getGenderNumbers(data.marks);
    displayGenderNumber(numbers)

    // getGenderMeans(data.marks , (chartData) => {
    //   displayGenderChart(chartData)
    // });

    // getGenderNumbers(data.marks , (chartData) => {
    //   displayGenderNumber(chartData);
    // })
  } else {
    window.location.href = "analysis.html";
  }
}

//function to get subject mean totals
async function getSubjectTotalMeans(analysisData) {
  const students = await getStudents();
  const subjectMeans = {};
  const subjectData = {};
  const subjects = await mySubjects();

  //this gets all subject data and arranges them in an array
  for (const [index, mark] of analysisData.entries()) {
    const student = students.find((s) => s.admission === mark.admission);

    if (student) {
      subjects.map((subj, idx) => {
        const status = student[myDefaultSubjects[idx]];
        if (status !== "not-selected") {
          if (!subjectData[subj]) subjectData[subj] = []; //create an arry to store all the subject marks
          subjectData[subj].push(mark[myDefaultSubjects[idx]]); //push the marks of that specific subject
        }
      });
    }
  }

  //function to get mean and total
  Object.entries(subjectData).forEach(([subject, dataArray]) => {
    const subjectTotal = dataArray.reduce(
      (total, mark) => total + Number(mark),
      0
    );
    const mean = subjectTotal / dataArray.length;
    subjectMeans[subject] = mean;
  });

  return subjectMeans;
}

//function to display subjects chart
let chart = null;
function displaySubjectsChart(chartData) {
  const canvas = document.getElementById("my-chart");
  if (chart !== null) {
    chart.destroy();
  }

  const dataObject = {
    labels: Object.keys(chartData).map((name) => name.substring(0, 4)),
    datasets: [
      {
        data: Object.values(chartData),
        label: "subjects",
      },
    ],
  };

  chart = new Chart(canvas, {
    type: "bar",
    data: dataObject,
    options: {
      responsive: true,
    },
  });
}

//function to get both class and stream acording to the data
async function getClassMeans(analysisData, mode) {
  const setup = await getSetup();
  const streams = await getStreams(setup[0].streams);
  const thisClass = analysisData[0].class;
  const thisstream = analysisData[0].stream;

  const classData = {};

  const thisClassStreams = streams[thisClass];

  if (mode === "class") {
    for (const stream of thisClassStreams) {
      const streamData = analysisData
        .filter((s) => s.stream === stream)
        .map((s) => Number(s.mean));

      if (streamData.length > 0) {
        const total = streamData.reduce((a, b) => a + b, 0);
        const mean = total / streamData.length;
        classData[stream] = mean;
      } else {
        classData[stream] = 3;
      }
    }
    displayStreamData(classData, thisClass);
  } else if (mode === "stream") {
    //if mode is stream diaply line chart with all their mrks
    const data = analysisData.map((s) => s.mean).sort((a, b) => b - a);
    const className = thisClass + " " + thisstream;
    await displayStreamChart(data, className);
  }
}

let streamChart = null;
async function displayStreamChart(data, name) {
  if (streamChart !== null) streamChart.destroy();

  const canvas = document.getElementById("agenda").getContext("2d");
  const gradient = canvas.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "blue");
  gradient.addColorStop(1, "white");

  const streamData = {
    labels: data,
    datasets: [
      {
        data: data,
        label: name,
        fill: true, // enable area under the line
        backgroundColor: gradient,
        borderWidth: 1,
        borderColor: "blue",
        tension: 0.4, // smooth curves
        pointRadius: 0,
      },
    ],
    options: [
      {
        responsive: true,
      },
    ],
  };

  streamChart = new Chart(canvas, {
    type: "line",
    data: streamData,
  });
}

function displayStreamData(chartData, name) {
  const canvas = document.getElementById("agenda");
  if (streamChart !== null) streamChart.destroy();

  const streamData = {
    labels: Object.keys(chartData),
    datasets: [
      {
        data: Object.values(chartData),
        label: name,
      },
    ],
  };

  streamChart = new Chart(canvas, {
    type: "bar",
    data: streamData,
  });
}

async function getGenderMeans(analysisData) {
  const genders = ["male", "female"];
  const students = await getStudents();
  const genderData = {};
  for (const gender of genders) {
    const genderArray = analysisData
      .filter((mark) => {
        const student = students.find(
          (s) => s.admission === mark.admission && s.gender === gender
        );
        if (student) {
          return mark.mean;
        }
      })
      .map((s) => Number(s.mean));
    const genderTotal = genderArray.reduce((a, b) => a + b, 0);
    const genderMean = genderTotal / genderArray.length;
    genderData[gender] = genderMean;
  }
  return genderData;
}

let genderChart = null;

function displayGenderChart(chartData) {
  const canvas = document.getElementById("gender-chart");
  if (genderChart !== null) genderChart.destroy();

  const streamData = {
    labels: Object.keys(chartData),
    datasets: [
      {
        data: Object.values(chartData),
        label: "stream data",
      },
    ],
  };

  genderChart = new Chart(canvas, {
    type: "bar",
    data: streamData,
  });
}

async function getGenderNumbers(analysisData, callback) {
  const students = await getStudents();
  const genderNumbers = {};
  const genders = ["male", "female"];
  genders.forEach((gender) => {
    const genderArry = students
      .filter((s) => s.gender === gender)
      .map((s) => s.admission);
    const number = analysisData.filter((entry) =>
      genderArry.includes(entry.admission)
    );

    genderNumbers[gender] = number.length;
  });
  return genderNumbers;
}

let numberChart = null;
function displayGenderNumber(chartData) {
  if (numberChart !== null) numberChart.destroy();
  const canvas = document.getElementById("all-students");
  const streamData = {
    labels: Object.keys(chartData),
    datasets: [
      {
        data: Object.values(chartData),
        label: "stream data",
      },
    ],
  };

  console.log(chartData);

  numberChart = new Chart(canvas, {
    type: "doughnut",
    data: streamData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "50%",
    },
  });
}

mainFunction();

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
