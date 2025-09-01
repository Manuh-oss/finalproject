const welcomeMesage = document.querySelector(".welcome-message");
const notificationBtn = document.querySelector(".fa-bell");
const notificationDiv = document.querySelector(".notification-div");
const dateDisplay = document.querySelector(".today");
const calendarContainer = document.querySelector(".calendar");
const teacherContainer = document.querySelector(".teacher-section .bodies");
const notificationContainer = document.querySelector(".notification");
//date display and all the shits about date
const date = new Date();
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
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

const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const eventColors = {
  meeting: "#1e90ff",
  educative: "#228b22",
  personal: "#ff7043",
  reminder: "#c62828",
};
const progressContainer = document.getElementById("container");
const today =
  date.getDate() + " " + months[date.getMonth()] + "," + date.getFullYear();
dateDisplay.textContent = today;

//function to get school details
async function getSetup() {
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

async function getNotificaions() {
  const user = await getUser();
  try {
    const response = await fetch("getnotifications.php", {
      method: "POST",
    });
    const result = await response.json();
    if(result.length === 0) {
       return [];
    }else{
      const thisSchool = result.filter((n) => n.schoolId === user.schoolId);
      return thisSchool;
    }
  } catch (error) {
    console.log("notification error", error);
  }
}

//function to get events
async function getEvents() {
  showLoader("getting events, please wait...");
  const user = await getUser();
  try {
    const response = await fetch("events.php", {
      method: "POST",
    });
    const result = await response.json();
    const thisSchool = result.filter((t) => t.schoolId === user.schoolId);
    return thisSchool;
  } catch (error) {
    console.log("events error", error);
  } finally {
    removeLoader();
  }
}

//ajax functions
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

//function to get teachers
async function getTeachers() {
  const user = await getUser();
  try {
    const response = await fetch("teachers.php", {
      method: "POST",
    });
    const result = await response.json();
    const thisSchool = result.filter((t) => t.schoolId === user.schoolId);
    return thisSchool;
  } catch (error) {
    console.log("teachers error", error);
  } finally {
    removeLoader();
  }
}

//function to get student details
async function getStudents() {
  const user = await getUser();
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

//function to get teacher lessons
async function getLessons() {
  const user = await getUser();
  try {
    const response = await fetch("lesson.php", {
      method: "POST",
    });
    const result = await response.json();
    const thisSchool = result.filter((t) => t.schoolId === user.schoolId);
    return thisSchool;
  } catch (error) {
    console.log("lessons error", error);
  } finally {
    removeLoader();
  }
}

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

function normalise(string) {
  return string.toLowerCase().trim().replace(" ", "");
}

function formatDate(date) {
  return `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}-${date.getDay()}`;
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

//slide show functions start here

async function getSlideshowValues() {
  const user = await getUser();
  const student = await getStudents();
  const thisStudent = student.find((s) => s.admission === user.code);

  const slideshows = [
    {
      h2: `welcome back ${thisStudent.firstname} <span class='emoji'><i class='fas fa-hand-paper'></i></span>!`,
      p: "This concise greeting is friendly, personal, and immediately guides the student to their destination without unnecessary details.",
      image: ["./subjects/download (2).jpeg", "./subjects/mobilebooks.jpg"],
      link: {
        link: "#",
        text: today,
      },
    },
    {
      h2: `View Scheduled Events`,
      p: `You may have important events or activities scheduled in your calendar.
            To stay informed and avoid missing out, we recommend checking your event list regularly.`,
      image: ["./subjects/eventsImage.avif", "./subjects/eventsback.avif"],
      link: {
        link: "admincalendar.html",
        text: "View your events",
      },
    },
    {
      h2: ` Review Your Assignments`,
      p: ` New assignments are now available. Check the assignments section to stay on top of your tasks and deadlines.`,
      image: ["./subjects/assignment4.webp", "./subjects/assignmentback.jpg"],
      link: {
        link: "assignment.html",
        text: "View your assignment",
      },
    },
    {
      h2: `🕒 View Your Class Timetable`,
      p: `Your class timetable has been updated. Check it for new details and changes to your lessons.View it now to see your updated weekly schedule.`,
      image: ["./subjects/timetable2.jpg", "./subjects/timetableback2.jpg"],
      link: {
        link: "displaytimetable.html",
        text: "View your timetable",
      },
    },
  ];
  return slideshows;
}

let currentSliderIndex = 0;

async function updateSlideshow() {
  const sliders = await getSlideshowValues();

  if (currentSliderIndex >= sliders.length) {
    currentSliderIndex = 0;
  }

  const currentSlider = sliders[currentSliderIndex];
  const welcomeDiv = document.querySelector(".welcome-message");
  welcomeDiv.innerHTML = "";

  const textDiv = document.createElement("div");
  textDiv.className = "text";

  textDiv.style.opacity = "0";
  textDiv.style.transform = "scale(.8)";

  textDiv.innerHTML = `
    <h2>${currentSlider.h2}</h2>
    <p>${currentSlider.p}</p>
    <a href='${currentSlider.link.link}'>${currentSlider.link.text}</a>
  `;

  const imageDiv = document.createElement("div");
  imageDiv.className = "profile";
  imageDiv.innerHTML = `
    <img src='${currentSlider.image[0]}'/>
  `;
  imageDiv.style.opacity = "0";
  imageDiv.style.transform = "scale(.8)";

  welcomeDiv.appendChild(textDiv);
  welcomeDiv.appendChild(imageDiv);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      imageDiv.style.opacity = "1";
      imageDiv.style.transform = "scale(1)";

      textDiv.style.opacity = "1";
      textDiv.style.transform = "scale(1)";
    });
  });
  currentSliderIndex++;
}

updateSlideshow();
setInterval(updateSlideshow, 4000);

//slideshow functions end here

//calendar function start here
function getAllDates() {
  const twoDaysAfter = new Date(date);
  twoDaysAfter.setDate(date.getDate() + 2);
  const twoDaysBefore = new Date(date);
  twoDaysBefore.setDate(date.getDate() - 2);
  const oneDaysAfter = new Date(date);
  oneDaysAfter.setDate(date.getDate() + 1);
  const oneDaysBefore = new Date(date);
  oneDaysBefore.setDate(date.getDate() - 1);

  return {
    twoDB: twoDaysBefore,
    oneDB: oneDaysBefore,
    today: new Date(),
    oneDA: oneDaysAfter,
    twoDA: twoDaysAfter,
  };
}

async function displayCurrentEvents() {
  const allEvents = await getEvents();
  const user = await getUser();
  const currentDates = getAllDates();
  const myevents = allEvents.filter((evt) => {
    const destinationMatch =
      evt.destination === "all" ||
      evt.destination === [user.class, user.stream].join("");
    const userMatch = evt.user === user.code;
    return destinationMatch || userMatch;
  }); //filter out the users events

  const spanParent = document.querySelector(".calendar .body");
  spanParent.innerHTML = "";

  for (const [day, date] of Object.entries(currentDates)) { 
    //loop though each current day just to get the today date for more info log Object.entries(currentDates)
    const [dates, days] = formatDate(date).split("-");
    const span = document.createElement("span");
    span.innerHTML = `
      <h3>${shortDays[days]}</h3>
      <h4>${dates.split("/")[0]}</h4>
    `;

    const event = myevents.find((evt) => evt.date === dates);

    if (event) { //if the event exist
      span.style.backgroundColor = eventColors[event.category];
      span.style.color = "#fff";

      if (day === "today") { //if the event is today updte the event description and tittle
        const eventDiv = document.querySelector(".event");
        eventDiv.innerHTML = `
           <h3>${event.tittle}</h3>
           <p>${event.description}</p>
         `;
      } else { // else just display that there are no events for today
        const eventDiv = document.querySelector(".event");
        eventDiv.innerHTML = `
           <h3>no events for today</h3>
           <p></p>
         `;
      }
    }

    spanParent.appendChild(span)
  }
}
displayCurrentEvents();

//event function end here

//notification functions start here
async function displayNotifications() {
   const allNotifications = await getNotificaions();
   const logedInuser = await getUser();
   const myNotifications = allNotifications.filter(not => {
    const [user,classvalue] = not.destination.split("-");
    const destinationMatch = user === logedInuser.from && classvalue === logedInuser.class;
    return destinationMatch;
   }) //filter out his.her notifications

   const notificationDiv = document.querySelector(".notification ul");
   notificationDiv.innerHTML = "";

   if(myNotifications.length > 0){
    
    for(const [index , notification] of myNotifications.entries()){
      const li = document.createElement("li");//this is the normal notification div diaply

      li.style.opacity = "0";
      li.style.transform = "scale(.8)";
      li.style.transitionDelay = `${0.3 * index}s`;
      
      li.innerHTML = `
        <i class="fa fa-comment"></i>
        <p>${notification.message}</p>
      `;

      const nextLi = document.createElement("li");
      nextLi.className = "expanded";
      nextLi.style.display = "none"
      const [type,link,clas] = notification.type.split("-");
      const  redirection = getRedirection(link);
      nextLi.innerHTML = `
        <div class="head">
          <i class="fa-regular fa-comment"></i>
          <h3>${type}</h3>
        </div>
        <div class="body">
          <p>${notification.desc}</p>
        </div>
        <div class="link">
          <a href="${redirection.link}">${redirection.text}</a>
        </div>
      `;

      notificationDiv.appendChild(li);
      notificationDiv.appendChild(nextLi);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          li.style.opacity = "1";
          li.style.transform = "scale(1)";
        })
      })

      li.addEventListener("click" , () => {
        nextLi.style.display = "flex";
        li.style.display = "none"
      })

      nextLi.querySelector(".head").addEventListener("click" , (e) => {
        e.stopPropagation();
        nextLi.style.display = "none";
        li.style.display = "flex"
      })

    }

   }else{

   }

}
displayNotifications();

function getRedirection(link){
  switch(link){
    case "assignment":
      return {
        link : "assignment.html",
        text : "check it out"
      }
    case "quiz" :
      return {
        link : "postquiz.html",
        text : "attempt quiz"
      }  
     default : 
     return {
        link : "#",
        text : "mark as read"
      }   
  }
}
//notification functions end here

/* term completition functions start here */

function normalizeDate(dateStr) { //this removes 08 to 8
  // dateStr in format DD/MM/YYYY
  const [day, month, year] = dateStr.split("/").map(Number); 
  return `${day}/${month}/${year}`;
}

function addZeroToMonth(dateStr) {
    const parts = dateStr.split("/"); 
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    const formatted = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    return formatted;
}

function getTotalDays(startDate, endDate) { //gets total dates from the first to the last
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffTime = end - start;

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

async function displayTermProgress(){
  const dateToday = formatDate(new Date());
  const schoolSetup = await getSetup();
  const termDetails = schoolSetup[0].term.split("-");
  const today = addZeroToMonth(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`)
  
  const fromDate = addZeroToMonth(termDetails[1]);
  const toDate = addZeroToMonth(termDetails[2]);

  const totalTermDays = getTotalDays(fromDate,toDate);
  const termProgress = getTotalDays(fromDate, today);
  const progress = (termProgress / totalTermDays) * 100;
  
  const termProgressDiv = Array.from(document.querySelectorAll(".term-progress span"));
  termProgressDiv[0].querySelector(".text h3").textContent = termDetails[0]+" comptetion "+termProgress+" / "+totalTermDays;

  termProgressDiv[0].querySelector(".juice").style.width = `${progress}%`
  
}

displayTermProgress()
/* term completition functions end here */

/*my teachers functions tart here */

async function displatSubjectTeachers(){
  const allTeachers = await getTeachers();
  const user = await getUser();
  const allLessons = await getLessons();
  const setup = await getSetup();
  const schoolSubjects = await mySubjects(setup);

  const thisClassLessons = allLessons.filter(les => {
    const classMatch = les.class === user.class;
    const streamMatch = les.stream === user.stream;
    return classMatch && streamMatch
  });

  const teacherContainer = document.querySelector(".teacher-section .bodies");
  teacherContainer.innerHTML = "";

  for(const [index,lesson] of thisClassLessons.entries()){
    const teacher = allTeachers.find(t => t.teacherCode === lesson.teacherCode);

    if(teacher){
      const teacherDiv = document.createElement("div");
      teacherDiv.className = "box";
      
      teacherDiv.style.opacity = "0";
      teacherDiv.style.transform = "scale(.8)";
      teacherDiv.style.transitionDelay = `${0.3 * index}s`

      const [clas,stream] = teacher.classTeacher;
      let subjects;
      const subIndex = myDefaultSubjects.indexOf(lesson.subject);

      if(clas === user.class && stream === user.stream){
         subjects = `${schoolSubjects[subIndex]} (classteacher)`; 
      }else{
        subjects = `${schoolSubjects[subIndex]}`;
      }

      const profileImage = teacher.profileImage || "./teachers/profileimage.png";

      teacherDiv.innerHTML = `
         <div class="upper">
           <div class="image">
             <img src="${profileImage}" alt="" />
          </div>
         </div>
         <div class="lower">
            <h3 class="name">${teacher.firstname} ${teacher.middlename} ${teacher.lastname}</h3>
            <p>${subjects}</p>
            <div class="links">
                 <a href="https://wa.me/+254${teacher.phone}" target="_blank"><i class="fa-brands fa-whatsapp"></i></a>
                 <a href="tel:+254${teacher.phone}" ><i class="fas fa-phone"></i></a>
                 <a href="mailto:${teacher.email}"><i class="fa fa-envelope"></i></a>
            </div>
          </div>
      `;

      teacherContainer.appendChild(teacherDiv);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          teacherDiv.style.opacity = "1";
          teacherDiv.style.transform = "scale(1)";
        })
      })

      teacherDiv.addEventListener("click" , (e) => {
        e.stopPropagation();
        window.location.href = `allteacher.html?code=${teacher.teacherCode}`
      })

    }

  }

}

displatSubjectTeachers()

/*my teachers functions end here */