const lowerClasses = [
  "pp1",
  "playgroup",
  "pp2",
  "grade 1",
  "grade 2",
  "grade 3",
  "grade 4",
  "grade 5",
  "grade 6",
];
const higherClases = [
  "grade 7",
  "grade 8",
  "grade 9",
  "grade 10",
  "grade 11",
  "grade 12",
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

const allClasesTimes = [
  {
    lesson1: "8:10-8:45",
    lesson2: "8:45-9:20",
    lesson3: "9:30-10:05",
    lesson4: "10:05-10:50",
    lesson5: "11:30-12:05",
    lesson6: "12:05-12:40",
    lesson7: "14:00-14:35",
    lesson8: "14:35-15:10",
  },
  {
    lesson1: "8:00-8:40",
    lesson2: "8:40-9:20",
    lesson3: "9:30-10:10",
    lesson4: "10:10-10:50",
    lesson5: "11:30-12:10",
    lesson6: "12:10-12:50",
    lesson7: "14:00-14:40",
    lesson8: "14:40-15:20",
    lesson9: "15:20-16:00",
  },
];

const sessionsobject = {
  first: "lesson1",
  second: "lesson2",
  third: "lesson3",
  forth: "lesson4",
  fifth: "lesson5",
  sixth: "lesson6",
  seventh: "lesson7",
  eigth: "lesson8",
  ninth: "lesson9",
  tenth: "lesson10",
};

const date = new Date();
const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const lowerSet = new Set(lowerClasses.map(normalize));
const higherSet = new Set(higherClases.map(normalize));

//ajax functions

//function to get teachers
async function getTeachers() {
  try {
    const response = await fetch(
      "http://manuhacademy.myschools.local/teachers.php",
      {
        method: "POST",
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("teachers error", error);
  }
}

//function to get teacher sessions
async function getTeacherSessions() {
  const data = new FormData();
  data.append("teacherCode", "");
  data.append("id", "");
  try {
    const response = await fetch(
      "http://manuhacademy.myschools.local/teachersessions.php",
      {
        method: "POST",
        body: data,
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("teacher sessions error", error);
  }
}

//function to get session arry
function getSessionArray(rawSessions) {
  const notAllowed = ["day", "class", "stream", "schoolId", "teacherCode"];
  const sesionObject = {};
  Object.entries(rawSessions).forEach(([sesTime, session]) => {
    if (!notAllowed.includes(sesTime)) {
      sesionObject[sesTime] = session;
    }
  });
  return sesionObject;
}

//function to get current session
function getCurrenSession(clas,type) {
  let timetableTimes;
  if (lowerClasses.includes(normalize(clas))) {
    timetableTimes = allClasesTimes[0];
  } else if (higherClases.includes(normalize(clas))) {
    timetableTimes = allClasesTimes[1];
  } else {
    return null;
  }
  //get the time now
  const timeNow = (date.getHours() - 1) + ":" + (date.getMinutes() - 44);
  const rawTimeNow = getTotalMinutes(timeNow);

  const objectVal = Object.values(timetableTimes);
  for (let x = 0; x < objectVal.length; x++) {
    const [lessonFrom, lessonTo] = objectVal[x].split("-");
    const fromMinutes = getTotalMinutes(lessonFrom);
    const toMinutes = getTotalMinutes(lessonTo);

    if (rawTimeNow >= fromMinutes && rawTimeNow <= toMinutes) {
        if(Object.entries(timetableTimes)[x]){
          return Object.entries(timetableTimes)[x];
        }else{
          return null;
        }
    }
  }
  return null;
}

//accesory function
function getTotalMinutes(rawTime) {
  const [hour, minute] = rawTime.split(":");
  return Number(minute) + Number(hour) * 60;
}

function normalize(string) {
  return string.toLowerCase().trim();
}

function incrementLessonKey(lessonKey) {
  const match = lessonKey.match(/^lesson(\d+)$/i);
  if (!match) return null; // not a valid lesson key
  const num = parseInt(match[1], 10);
  return `lesson${num + 1}`;
}


async function postAllTeacherAttendaance() {
  const allTeachers = await getTeachers();
  const allSessions = await getTeacherSessions();
  const datex = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;

  const timeNow = date.getHours() + ":" + date.getMinutes();
  const rawTimeNow = getTotalMinutes(timeNow);
  const allowed = [1,0];

  for (const teacher of allTeachers) {
    const mySessions = allSessions.filter(
      (ses) => ses.teacherCode === teacher.teacherCode
    );
    const todaySessions = mySessions.find(
      (ses) => ses.day === days[date.getDay() + 2]
    );

    if (todaySessions) {
      const allMyses = getSessionArray(todaySessions);
      for(const [time , value] of Object.entries(allMyses)){
        if (value !== "" && value.split("-")[0] !== "occupied") {
          const [subject, classValue, streamValue, type] = value.split("-");
          const currentSession = getCurrenSession(classValue,type);
          let teacherSesion;
          if(type === "d"){
            teacherSesion = incrementLessonKey(time);
          }else{
            teacherSesion = time;
          }

          if(currentSession === null){
            console.log("sessions are done");
            return;
          }

          if(teacherSesion === currentSession[0]){
            const [lessonFrom,lessonTo] = currentSession[1].split("-");
            const to = getTotalMinutes(lessonTo);

            if(rawTimeNow >= to - 5 && rawTimeNow <= to + 5){
                const data = {
                    session : time,
                    code : teacher.teacherCode,
                    day : days[date.getDay() + 1],
                    date : datex,
                    class : [classValue,streamValue].join("-"),
                    id : teacher.schoolId
                }
                
                const status = await postClassRegister(data);
                console.log("statud" , status)
            }
          }else{
            console.log(time , "lesson done" , currentSession)
          }
       }
      };
    }
  }
}

async function postClassRegister(regData){
   const data = new FormData();
   data.append("code" , regData.code);
   data.append("school_id" , regData.id);
   data.append("day" , regData.day);
   data.append("date" , regData.date);
   data.append("session" , regData.session);
   data.append("class" , regData.class);

   try{
     const response = await fetch("http://manuhacademy.myschools.local/postclassattendance.php",{
        method : 'POST',
        body : data
     });
     const result = await response.json();
     return result;
   }catch(error){
     console.log("posting error" , error);
   }
}

postAllTeacherAttendaance();
setInterval(postAllTeacherAttendaance , 60000);

//  const data = new FormData();
//      data.append("code" , user.code);
//      data.append("school_id" , user.schoolId);
//      data.append("day" , fullDays[date.getDay()]);
//      data.append("date" , datex);
//      data.append("session" , getSession([session.from,session.to]));
//      data.append("class" , result);