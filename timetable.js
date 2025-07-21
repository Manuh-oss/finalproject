const table = document.querySelector(".timetable-container table");
const days = ['monday','tuesday','wednesday','thursday','friday'];
const LongBreak = ["b", "r", "e", "a", "k"];
const lunch = ["l", "u", "n", "c", "h"];

function getStudentTimetable(callback,clas,stream){
  const data = new FormData();
  data.append("student-class" , clas);
  data.append("student-stream" , stream);
  const xhr = new XMLHttpRequest();
  xhr.open('POST','studenttimetable.php',true);
  xhr.onload =  ( ) => {
    try{
      if(xhr.status == 200){
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    }catch(error){
      console.log("Student Error", error);
    }
  }
  xhr.send(data);
}

function getUser(callback){
  const xhr = new XMLHttpRequest();
  xhr.open('GET' , 'saved_user.php' , true);
  xhr.onload = () => {
    try{
     if(xhr.status == 200){
      const response = JSON.parse(xhr.responseText);
      callback(response);
     }
    }catch(error){
      console.log("Login error" , error);
    }
  }
  xhr.send();
}

function getTeacherTimetable(callback,code){
  const tcode = new FormData();
  tcode.append("teacherCode" , code);
  const xhr = new XMLHttpRequest();
  xhr.open('POST' , 'teachertimetable.php' , true);
  xhr.onload = () => {
    try{
      if(xhr.status == 200){
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    }catch(error){
      console.log("teacher error" , error);
    }
  }
  xhr.send(tcode);
}

function verifyUser(){
  getUser((user) => {
    if(user.from === "student"){
      getStudentTimetable((studentTimetable) => {
        displayTimetable(studentTimetable,"student")
      },user.class,user.stream);
    }else if(user.from === "teacher"){
      getTeacherTimetable((teacherTable) => {
        displayTimetable(teacherTable,"teacher");
      },user.code);
    }
  })
}


function displayTimetable(timetableData,user){
  const tableValues = getTimetableId(timetableData,user);
  const tbody = table.querySelector("tbody");
  for(let r = 0; r < 5; r++){
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td class="break">${days[r]}</td>
            <td class="double-lesson"><input type="text" name="first[]" class="input" id="${days[r]}-first"></td>
            <td class="no-double-lesson"><input type="text" name="second[]" class="input" id="${days[r]}-second"></td>
            <td class="break"><h2>${LongBreak[r]}</h2></td>
            <td class="double-lesson"><input type="text" name="third[]" class="input" id="${days[r]}-third"></td>
            <td class="no-double-lesson"><input type="text" name="forth[]" class="input" id="${days[r]}-forth"></td>
            <td class="break"><h2>${LongBreak[r]}</h2></td>
            <td class="double-lesson"><input type="text" name="fifth[]" class="input" id="${days[r]}-fifth"></td>
            <td class="double-lesson"><input type="text" name="sixth[]" class="input" id="${days[r]}-sixth"></td>
            <td class="no-double-lesson"><input type="text" name="seventh[]" class="input" id="${days[r]}-seventh"></td>
            <td class="break"><h2>${lunch[r]}</h2></td>
            <td class="double-lesson"><input type="text" name="eigth[]" class="input" id="${days[r]}-eigth"></td>
            <td class="double-lesson"><input type="text" name="ninth[]" class="input" id="${days[r]}-ninth"></td>
            <td class="no-double-lesson"><input type="text" name="tenth[]" class="input" id="${days[r]}-tenth"></td>
    `;
    tbody.appendChild(tr)
  }

  const allInputs = tbody.querySelectorAll(".input");
  tableValues.forEach(tdValue => {
    allInputs.forEach(input => {
       if(tdValue.id === input.id){
        const parent = input.parentElement;
        const next = parent.nextElementSibling;
          if(tdValue.subject){
            if(tdValue.type === "s"){
              const span = document.createElement("span");
              span.innerHTML = `
                <h3>${getInitials(tdValue.subject)}</h3>
                <h4>${tdValue.teacher}</h4>
              `;
              parent.appendChild(span);
              input.style.display = "none";
            }else{
              parent.setAttribute('colspan' , 2);
              if(next) next.style.display = "none";
              const span = document.createElement("span");
              span.innerHTML = `
                <h3>${getInitials(tdValue.subject)}</h3>
                <h4>${tdValue.teacher}</h4>
              `;
              parent.appendChild(span);
              input.style.display = "none";
            }
          }else{

          }
       }
    })
  })
}

function getTimetableId(rawData,user){
  let subjectz;
  let teacherz;
  let typez;
  const converted = [];
  Object.entries(rawData).forEach(([day , dayTable]) => {
      Object.entries(dayTable).forEach(([key , value]) => {
        if(getId(key)){
          if(user === "teacher"){
           const [subject,clas,stream,type] = value.split("-");
             subjectz = subject;
             teacherz = "form"+clas+"-"+converStream(stream);
             typez = type;
          }else{
            const [subject,teacher,type] = value.split("-");
             subjectz = subject;
             teacherz = teacher;
             typez = type;
          }
          const data = {
            id : days[day]+"-"+getId(key),
            subject : subjectz,
            teacher : teacherz,
            type : typez    
          }
          if(!converted.some(s => s === data)){
            converted.push(data)
          }
        }
      })
  })
  return (converted)
}


function getId(key){
  const allIds = {
    "lesson1" : "first",
    "lesson2" :  "second",
    "lesson3" : "third",
    "lesson4" : "forth",
    "lesson5" : "fifth",
    "lesson6" : "sixth",
    "lesson7" : "seventh",
    "lesson8" : "eigth",
    "lesson9" : "ninth",
    "lesson10" : "tenth",
  }
  return allIds[key];
}

function getInitials(value) {
  let originalValue = value.toLowerCase();
  if (originalValue.trim() !== "") {
    switch (originalValue) {
      case "english":
        originalValue = "ENG";
        break;
      case "kiswahili":
        originalValue = "KIS";
        break;
      case "mathematics":
        originalValue = "MATH";
        break;
      case "chemistry":
        originalValue = "CHEM";
        break;
      case "biology":
        originalValue = "BIO";
        break;
      case "physics":
        originalValue = "PHY";
        break;
      case "geography":
        originalValue = "GEO";
        break;
      case "history":
        originalValue = "HIST";
        break;
      case "cre":
        originalValue = "CRE";
        break;
      case "business":
        originalValue = "B/S";
        break;
      case "agriculture":
        originalValue = "AGRI";
        break;
      case "computer":
        originalValue = "COMP";
        break;
      case "french":
        originalValue = "FREN";
        break;
      default:
        originalValue = originalValue;
    }
  }
  return originalValue;
}

function converStream(rawStream) {
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

verifyUser();
