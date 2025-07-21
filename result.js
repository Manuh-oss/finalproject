const selectContainer = document.querySelector(".select-field");
const selects = selectContainer.querySelectorAll("select");
const classSelect = selectContainer.querySelector("#class");
const examSelect = selectContainer.querySelector("#exam");
const termSelect = selectContainer.querySelector("#term");

const resultContainer = document.querySelector(".main-body");
const noResult = resultContainer.querySelector(".no-result");

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

//function section
function getUser(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "saved_user.php", true);
  xhr.onload = () => {
    if (xhr.status == 200) {
      const response = JSON.parse(xhr.responseText);
      callback(response);
    }
  };
  xhr.send();
}

//function to get student Details
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

//function to get student MArks
function getStudentMarks(clas, term, exam, callback) {
  const data = new FormData();
  data.append("term", term);
  data.append("class", clas);
  data.append("exam", exam);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "result.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
        console.log(term);
        console.log(exam);
        console.log(clas);
      }
    } catch (error) {
      console.log("marks error", error);
    }
  };
  xhr.send(data);
}

//function to get register details
function getRegisterDetails(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "countregister.php", true);
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

//function to get class count
function getClassNumbers(callback) {
  getUser((user) => {
    if (user.from !== "student") return;
    const data = new FormData();
    data.append("class", user.class);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "classcount.php", true);
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
    xhr.send(data);
  });
}

//function to ge teacher details
function getTeacherDetails(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "teachers.php", true);
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

//function to check if subject was dropped
function checkIfDropped(callback, subject) {
  getStudents((students) => {
    getUser((user) => {
      const myDetails = students.find(
        (detail) => detail.admission === user.code
      );
      if (myDetails) {
        if (myDetails[subject] === "not-selected") {
          callback(false);
        } else {
          callback(true);
        }
      } else {
        console.log("checking if dropped function: student not found");
        callback(null);
      }
    });
  });
}

//function to getGrades
function getGrades(marks) {
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

//function to convert stream
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

function convertExam(rawExam) {
  switch (rawExam) {
    case "11":
      return "opener";
      break;
    case "22":
      return "midterm";
      break;
    case "33":
      return "endterm";
      break;
    default:
      return "unidentified";
  }
}

//function to display student marks
function getMarks(callback) {
  getStudents((students) => {
    //this gets student details
    getUser((user) => {
      //this gets logged in user
      getRegisterDetails((registerDetails) => {
        //this gets register details
        getClassNumbers((classNumbers) => {
          //this gets class numbers
          getTeacherDetails((teacherDetails) => {
            //this gets student marks
            let clas = classSelect.value || user.class;
            let exam = examSelect.value || "22";
            let term = termSelect.value || "2";
            getStudentMarks(clas, term, exam, (studentMarks) => {
              //this gets teacher detsils
              const myPersonalDetails = students.find(
                (s) => s.admission === user.code
              ); //this gets logged in user details

              const registerInfo = registerDetails[user.code]; //this gets the student register info
              //now lets get class teacher details
              const thisClass = user.class + "-" + user.stream;
              const myClassTeacher = teacherDetails.find(
                (t) => t.classTeacher === thisClass
              );
              const thisExamResults = studentMarks.find(
                (s) => s.admission === user.code
              );
              if (!myPersonalDetails || !thisExamResults) {
                showNoResult();
                console.log("i returned");
                console.log(studentMarks);
                return;
              }

              callback({
                personalData: myPersonalDetails,
                myClassNumbers: classNumbers,
                myExamData: thisExamResults,
                registerInfo: registerInfo,
                classTeacher: myClassTeacher,
              });
            });
          });
        });
      });
    });
  });
}

function displayMymarks() {
  getMarks((resultSlipData) => {
    const myPersonalDetails = resultSlipData.personalData;
    const myMarks = resultSlipData.myExamData;
    const regInfo = resultSlipData.registerInfo;
    const classTeacher = resultSlipData.classTeacher;
    const count = resultSlipData.myClassNumbers;

    resultContainer.innerHTML = "";
    console.log("am called");

    const profileImage =
      myPersonalDetails.profileImage || "./teachers/martin.jpg";
    const tprofileImage = classTeacher.profileImage || "./teachers/martin.jpg";
    const name =
      myPersonalDetails.firstname +
      " " +
      myPersonalDetails.middlename +
      " " +
      myPersonalDetails.lastname;

    const resultDiv = document.createElement("div");
    resultDiv.className = "result-container";
    resultDiv.innerHTML = `
    <div class="print">
      <button type="button" onclick="downLoad(${resultDiv})">
          <i class="fas fa-print"></i> download
      </button>   
     </div>
    <div class="head">
      <div class="left">
        <h1>report card</h1>
        <h3>manuh group of schools</h3>
      </div>
      <div class="right">
        <img src="./images/images (4).png" alt="" />
      </div>
    </div>
    <div class="personal-details">
      <div class="left">
        <div class="image-box">
            <img src="${profileImage}" alt="">
        </div>
      </div>
      <div class="right">
        <div class="name-section">
          <div class="box-one">
            <span>
              <div class="icon"><i class="fa fa-user"></i></div>
              <div class="text">
                <h4>name:</h4>
                <h3>${name}</h3>
              </div>
            </span>
            <span>
              <div class="icon"> <i class="fas fa-trophy text-warning"></i></i></div>
              <div class="text">
                <h4>overral position & stream position:</h4>
                <h3>
                  ${myMarks.overallPosition} / ${count["allcount"]} &
                  ${myMarks.streamPosition} / ${count[myPersonalDetails.stream]}
                </h3>
              </div>
            </span>
          </div>
          <div class="box-one">
            <span>
              <div class="icon"><i class="fas fa-id-card"></i></div>
                <div class="text">
                  <h4>admission:</h4>
                  <h3>${myPersonalDetails.admission}</h3>
                </div>
            </span>
            <span>
              <div class="icon"><i class="fas fa-chart-line"></i></div>
                <div class="text">
                  <h4>total marks & mean mark:</h4>
                  <h3>${myMarks.total} ${myMarks.mean}</h3>
              </div>
            </span>
          </div>
          <div class="box-one">
            <span>
              <div class="icon"><i class="fas fa-school"></i> </div>
                <div class="text">
                  <h4>class details:</h4>
                  <h3>form${myPersonalDetails.class} 
                      ${convertStream(myPersonalDetails.stream)}
                  </h3>
                </div>
            </span>
            <span>
              <div class="icon"><i class="fas fa-star"></i></div>
                <div class="text">
                  <h4>mean grade:</h4>
                  <h3>${myMarks.meanGrade}</h3>
                </div>
            </span>
          </div>
          </div>
            <div class="viewing">
              <h3>your viewing form${myMarks.class}
                 term${myMarks.term} ${convertExam(myMarks.exam)} exam
               </h3>
            </div>
          </div>
    </div>
    <div class="result-table">
      <table>
        <tr>
          <th>subject</th>
          <th>Marks</th>
          <th>Grade</th>
          <th>Rank</th>
          <th>Remark</th>
        </tr>
        <tbody>
          ${showResultTable(myMarks, count, myPersonalDetails)}
        </tbody>       
      </table>
    </div>

    <h2>grade & attendance</h2>
      <div class="grade-table">
        <div class="left">
          <table>
            <caption>grade scale</caption>
            <tr>
              <th>grade</th>
              <th>range</th>
            </tr>
            <tr>
              <td>a</td>
              <td>100 - 85</td>
            </tr>
            <tr>
              <td>a-</td>
              <td>84 - 80</td>
            </tr>
            <tr>
              <td>b+</td>
              <td>79 - 75</td>
            </tr>
            <tr>
              <td>b</td>
              <td>74 - 70</td>
            </tr>
            <tr>
              <td>b-</td>
              <td>69 - 65</td>
            </tr>
            <tr>
              <td>c+</td>
              <td>60 - 64</td>
            </tr>
            <tr>
              <td>c</td>
              <td>59 - 55</td>
            </tr>
            <tr>
              <td>c-</td>
              <td>54 - 50</td>
            </tr>
            <tr>
              <td>d+</td>
              <td>49 - 45</td>
            </tr>
            <tr>
              <td>d</td>
              <td>44 - 40</td>
            </tr>
            <tr>
              <td>d+</td>
              <td>39 - 35</td>
            </tr>
            <tr>
              <td>e</td>
              <td>34 - 0</td>
            </tr>
         </table>

         </div>
            <div class="right">
              <div class="attendance-box">
                <div class="ahead">attendance</div>
                  <div class="abody">
                    <div class="box-one">
                      <span>
                        <div class="icon"><i class="fa fa-sun"></i></div>
                        <div class="text">
                          <h4>n.o of school days:</h4>
                          <h3>120</h3>
                        </div>
                      </span>
                      <span>
                        <div class="icon"><i class="fa fa-user-times"></i></div>
                         <div class="text">
                             <h4>absent days:</h4>
                              <h3>${regInfo.absent}</h3>
                          </div>
                      </span>
                    </div>
                    <div class="box-one">
                      <span>
                        <div class="icon"><i class="fa fa-user-check"></i></div>
                          <div class="text">
                            <h4>present days:</h4>
                              <h3>${regInfo.presenr}</</h3>
                                </div>
                            </span>
                            <span>
                                <div class="icon"><i class="fa fa-user-tie"></i></div>
                                <div class="text">
                                    <h4>permitted absence:</h4>
                                    <h3>${regInfo.permitted}</</h3>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="teacher-remarks">
                    <div class="thead">classteacher remarks</div>
                    <div class="body">
                        <div class="box">
                            <div class="profile-image">
                                <img src="${tprofileImage}" alt="">
                            </div>
                            <div class="btext">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur consequatur, libero tempora alias, eligendi cumque commodi numquam facere rem beatae quisquam aperiam corrupti. Nihil quisquam laudantium, quam veniam dolorem omnis!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
    `;
    resultContainer.appendChild(resultDiv);
  });
}

//function to show result table
function showResultTable(data, count, details) {
  const filterdSubjects = subjects.filter(subj => details[subj] !== "not-selected");
  return filterdSubjects.map(subject => {
    return `
        <tr>
          <td>${subject}</td>
          <td>${data[subject]}</td>
          <td>${getGrades(data[subject])}</td>
          <td>${data[subject + "_position"]} out of ${count[subject]}</td>
          <td>${getRemarks(data[subject])}</td>
        </tr>
    `;
  }).join("")
}

function getRemarks(marks) {
  if (marks >= 80) {
    return "Excellent work 💯";
  } else if (marks >= 70) {
    return "Very good 👍";
  } else if (marks >= 60) {
    return "Good effort 👌";
  } else if (marks >= 50) {
    return "Fair";
  } else if (marks >= 40) {
    return "Below average";
  } else if (marks >= 30) {
    return "Poor";
  } else {
    return "Very poor";
  }
}

function showNoResult() {
  const children = resultContainer.children;
  if (children.length > 0) {
    const noresultDiv = resultContainer.querySelector(".no-result");
    const resultDiv = resultContainer.querySelector(".result-container");
    if (resultDiv) resultContainer.removeChild(resultDiv);
    if (!noresultDiv) {
      const div = document.createElement("div");
      div.className = "no-result";
      div.innerHTML = `
            <img src="./subjects/noresultsix.jpeg" alt="">
            <h3>no result was found</h3>
      `;
      resultContainer.appendChild(div);
    }
  }
}

function verifySelects() {
  return [classSelect, termSelect, examSelect].every(
    (select) => select.value !== ""
  );
}

[classSelect, termSelect, examSelect].forEach((select) => {
  select.addEventListener("change", function () {
    const veified = verifySelects();
    console.log(veified);
    if (veified) {
      displayMymarks();
      console.log("i called display marks");
    } else {
      showNoResult();
    }
  });
});

function downLoad(div){
  const opt = {
    margin:       0.5,
    filename:     'ResultSlip.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
    
  html2pdf().set(opt).from(div).save();
}