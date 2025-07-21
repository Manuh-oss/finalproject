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
const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const today =
  date.getDate() + " " + months[date.getMonth()] + "," + date.getFullYear();
dateDisplay.textContent = today;

//this opens notification division on small screens
function showNotification() {
  notificationDiv.style.height = "100%";
  notificationDiv.style.top = "0";
  notificationDiv.style.visibility = "visible";
  const ul = document.createElement("ul");
  const closeLi = document.createElement("li");
  closeLi.className = "close-li";
  closeLi.innerHTML = "<i class='fas fa-times'></li>";
  ul.appendChild(closeLi);
  notificationDiv.appendChild(ul);

  displayMobileNotifications(ul);
  closeLi.addEventListener("click", closeNotification);
}

//this closes notification division on small screens
function closeNotification() {
  notificationDiv.style.height = "0";
  notificationDiv.style.top = "-100%";
  notificationDiv.style.visibility = "none";
  notificationDiv.innerHTML = "";
}

//function to diplay the mobile nnotifications
function displayMobileNotifications(ul) {
  getNotifications((notifications) => {
    getUser((users) => {
      const myNotifications = notifications.filter((notify) => {
        const [user, clas] = notify.destination.split("-");
        return user === "student" && clas === users.class;
      });

      if (myNotifications.length > 0) {
        myNotifications.forEach((notification) => {
          const li = document.createElement("li");
          li.innerHTML = `
            <i class="fa fa-comment"></i>
            <p>${notification.message}</p>
          `;
          ul.appendChild(li);

          const nextLi = document.createElement("li");
          nextLi.className = "expanded";
          nextLi.style.display = "none";

          const [type, frum, code] = notification.type.split("-");
          getRedirection(frum, code, (atag) => {
            nextLi.innerHTML = `
              <div class="head">
                <i class="fa-regular fa-comment"></i>
                <h3>${type} <i class="fa fa-angle-down"></i></h3>
              </div>
              <div class="body">
                <p>${notification.desc}</p>
              </div>
              <div class="link">
                <a href="${atag.href}">${atag.text}</a>
              </div>
            `;
            ul.appendChild(nextLi);

            li.addEventListener("click", function () {
              nextLi.style.display = "flex";
              li.style.display = "none";
            });
            const close = nextLi.querySelector(".fa-angle-down");
            close.addEventListener("click", () => {
              nextLi.style.display = "none";
              li.style.display = "flex";
            });
          });
        });
      } else {
        console.log("No notifications for this user.");
      }
    });
  });
}

//function to get events
function getEvents(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "events.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Events error", error);
    }
  };
  xhr.send();
}
//this function perform the function of the calendar in the dashboars
function updateCalendar() {
  const dayToday = date.getDay(); //this gets the index for today;
  const dateToday = date.getDate();
  const twoDaysAfter = new Date(date);
  twoDaysAfter.setDate(date.getDate() + 2);
  const twoDaysBefore = new Date(date);
  twoDaysBefore.setDate(date.getDate() - 2);
  const oneDaysAfter = new Date(date);
  oneDaysAfter.setDate(date.getDate() + 1);
  const oneDaysBefore = new Date(date);
  oneDaysBefore.setDate(date.getDate() - 1);
  calendarContainer.querySelector(".body").innerHTML = `
     <span>
       <h3>${days[twoDaysBefore.getDay()]}</h3>
       <h4>${twoDaysBefore.getDate()}</h4>
    </span>
    <span>
       <h3>${days[oneDaysBefore.getDay()]}</h3>
       <h4>${oneDaysBefore.getDate()}</h4>
    </span>
    <span style="background:#0052a5; color:#eee; transform:scale(1.2);">
       <h3>${days[dayToday]}</h3>
       <h4>${dateToday}</h4>
    </span>
    <span>
       <h3>${days[oneDaysAfter.getDay()]}</h3>
       <h4>${oneDaysAfter.getDate()}</h4>
    </span>
        <span>
       <h3>${days[twoDaysAfter.getDay()]}</h3>
       <h4>${twoDaysAfter.getDate()}</h4>
    </span>
    `;

  getEvents((events) => {
    const eventDisplay = calendarContainer.querySelector(".event");
    const thisDate =
      date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
    const foundEvents = events.find((evnt) => evnt.date === thisDate);
    if (foundEvents) {
      eventDisplay.innerHTML = `
            <h3>${foundEvents.tittle}</h3>
            <p>${foundEvents.description}</p>
          `;
    } else {
      eventDisplay.innerHTML = `
           <h3>No events today</h3>
            <p></p>
          `;
    }
  });
}

//function to get teahcers
function getTeachers(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "teachers.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Teachers error", error);
    }
  };
  xhr.send();
}

//function to get all teacher lessons
function getTeacherLessons(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "lesson.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status == 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Teachers error", error);
    }
  };
  xhr.send();
}

//function to get logged in user
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

function displayTeachers() {
  getTeachers((teachers) => {
    //gets teacher details fro database
    getTeacherLessons((lessons) => {
      //gets lessons from databse
      getUser((user) => {
        //gets the loged in user
        teacherContainer.innerHTML = ""; ///cleares the div b4 appending the details to it
        if (user.from !== "student") return;
        const myTeachers = lessons.filter(
          (lesson) =>
            lesson.class === user.class && lesson.stream === user.stream
        ); //gets all teachercodes for all leesons in the class
        const classTeacher = teachers.find(
          (t) => t.classTeacher === user.class + "-" + user.stream
        );
        if (classTeacher) {
          const teacherDiv = document.createElement("div");
          teacherDiv.addEventListener("click" , () => {
             redirectAllTeacher(classTeacher.teacherCode);
          })
          teacherDiv.className = "box";
          const profileImage =
            classTeacher.profileImage || "./teachers/profileimage.png";
          teacherDiv.innerHTML = `
                            <div class="upper">
                              <div class="image">
                                  <img src="${profileImage}" alt="" />
                              </div>
                            </div>
                            <div class="lower">
                              <h3 class="name">${classTeacher.firstname} ${classTeacher.middlename}</h3>
                              <p>classteacher</p>
                              <div class="links">
                                <a href="https://wa.me/+254${classTeacher.phone}" target="_blank"><i class="fa-brands fa-whatsapp"></i></a>
                                <a href="tel:+254${classTeacher.phone}" ><i class="fas fa-phone"></i></a>
                                <a href="mailto:${classTeacher.email}"><i class="fa fa-envelope"></i></a>
                              </div>
                            </div>
                            `;
          teacherContainer.appendChild(teacherDiv);
        }
        if (myTeachers.length > 0) {
          // this checks if there exist lessons
          myTeachers.forEach((myteahcer) => {
            //loops through each lesoson
            const teacherDetails = teachers.find(
              (t) => t.teacherCode === myteahcer.teacherCode
            ); //gets the teachers details
            if (teacherDetails) {
              //if the teacher exists create a teacher box
              const teacherDiv = document.createElement("div");
              teacherDiv.className = "box";
                teacherDiv.addEventListener("click" , () => {
                   redirectAllTeacher(teacherDetails.teacherCode);
                })
              const profileImage =
                teacherDetails.profileImage || "./teachers/profileimage.png";
              teacherDiv.innerHTML = `
                              <div class="upper">
                                <div class="image">
                                    <img src="${profileImage}" alt="" />
                                </div>
                                </div>
                                <div class="lower">
                                <h3 class="name">${teacherDetails.firstname} ${teacherDetails.middlename}</h3>
                                <p>${myteahcer.subject}</p>
                                <div class="links">
                                  <a href="https://wa.me/+254${classTeacher.phone}" target="_blank"><i class="fa-brands fa-whatsapp"></i></a>
                                  <a href="tel:+254${classTeacher.phone}" ><i class="fas fa-phone"></i></a>
                                  <a href="mailto:${classTeacher.email}"><i class="fa fa-envelope"></i></a>
                                </div>
                                </div>
                            `;
              teacherContainer.appendChild(teacherDiv);
            }
          });
        }
      });
    });
  });
}

//function to get notifications
function getNotifications(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "getnotifications.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("Notification error", error);
    }
  };
  xhr.send();
}

//function to diaplay notifications
function displayNotifications() {
  getNotifications((notifications) => {
    getUser((users) => {
      const myNotifications = notifications.filter((notify) => {
        const [user, clas] = notify.destination.split("-");
        return user === "student" && clas === users.class;
      }); //this filters all notification that belong to this user

      if (myNotifications.length > 0) {
        //this checks if the array is not empty
        const ul = notificationContainer.querySelector("ul");
        ul.innerHTML = "";
        myNotifications.forEach((notification) => {
          const li = document.createElement("li");
          const nextLi = document.createElement("li");
          nextLi.className = "expanded";
          li.innerHTML = `
            <i class="fa fa-comment"></i>
            <p>${notification.message}</p>
          `;
          ul.appendChild(li);
          const [type, frum, code] = notification.type.split("-");
          getRedirection(frum, code, (atag) => {
            nextLi.innerHTML = `
               <div class="head">
                  <i class="fa-regular fa-comment"></i>
                  <h3>${type} <i class="fa fa-angle-down"></i></h3>
               </div>
               <div class="body">
                  <p>${notification.desc}</p>
               </div>
               <div class="link">
                  <a href="${atag.href}">${atag.text}</a>
               </div>
          `;

            ul.appendChild(nextLi);

            nextLi.style.display = "none";
            li.addEventListener("click", function () {
              nextLi.style.display = "flex";
              li.style.display = "none";
            });

            const close = nextLi.querySelector(".fa-angle-down");
            close.addEventListener("click", function () {
              nextLi.style.display = "none";
              li.style.display = "flex";
            });
          });
        });
      } else {
        console.log("rada");
      }
    });
  });
}

//function to get rediresction
function getRedirection(from, code, callback) {
  getUser((user) => {
    let result;
    if (from === "quiz") {
      result = {
        href: `postquiz.html?quiz-code=${code}`,
        text: "check it out",
      };
    } else if (from === "event") {
      result = {
        href: `admincalendar.html`,
        text: "view event",
      };
    } else if (from === "assignment") {
      result = {
        href: `assignment.html?class=${user.class}`,
        text: "check it out",
      };
    } else if (from === "change") {
      result = {
        href: `#`,
        text: "mark as read",
      };
    }
    callback(result);
  });
}

//slideshow functions
const slideShows = [
  {
    tittle: `View Scheduled Events`,
    text: `You may have important events or activities scheduled in your calendar.
            To stay informed and avoid missing out, we recommend checking your event list regularly.`,
    image: ["./slideshow/eventsImage.avif","./slideshow/eventsback.avif"],
    link: {
      link: "admincalendar.html",
      text: "View your events",
    },
  },
  {
    tittle: ` Review Your Assignments`,
    text: ` You might have new assignments available for your class. 
  We recommend checking the assignments section regularly to stay updated and avoid missing any tasks or deadlines. 
  Click the link below to view your assignments and ensure you’re keeping up with your academic progress.`,
    image: ["./slideshow/assignment4.webp","./slideshow/assignmentback.jpg"],
    link: {
      link: "assignment.html",
      text: "View your assignment",
    },
  },
  {
    tittle: `🕒 View Your Class Timetable`,
    text: `Your class timetable may have been updated or contains important details for your weekly schedule.
            We recommend checking it regularly to stay organized and ensure you're aware of any changes to your lessons.`,
    image: ["./slideshow/timetable2.jpg","./slideshow/timetableback2.jpg"],
    link: {
      link: "displaytimetable.html",
      text: "View your timetable",
    },
  },
  {
    tittle: `Test Your Knowledge 🤔`,
    text: `A quiz may be available for your class.
          Quizzes help reinforce your understanding and track your progress. We recommend checking the quiz section to see if any have been assigned.`,
    image: ["./slideshow/quiz.avif" , "./slideshow/quizback.jpg"],
    link: {
      link: "postquiz.html",
      text: "Go to Quiz Page",
    },
  },
  {
    tittle: `Welcome back muia <span class="emoji"><i class="fas fa-hand-paper"></i></span>!`,
    text: `A quiz may be available for your class.
          Quizzes help reinforce your understanding and track your progress. We recommend checking the quiz section to see if any have been assigned.`,
    image: ["./subjects/download (2).jpeg","./subjects/mobilebooks.jpg"],
    link: {
      link: "#",
      text: today,
    },
  },
];

let viewedSlides = []; 

function createSlideshow() {
  if (viewedSlides.length === slideShows.length) viewedSlides = [];
  let currentSlide;
  do {
    const random = Math.floor(Math.random() * slideShows.length);
    currentSlide = slideShows[random];
  } while (viewedSlides.includes(currentSlide));

  viewedSlides.push(currentSlide);

  const text = welcomeMesage.querySelector(".text");
  const image = welcomeMesage.querySelector("img");
  image.setAttribute("src", currentSlide.image[0]);
  image.parentElement.style.minWidth = "fit-content";
  text.innerHTML = `
    <h2>${currentSlide.tittle}</h2>
    <p>${currentSlide.text}</p>
    <h3><a style="text-decoration:none; color:black; font-size:1.2rem;" href="${currentSlide.link.link}">${currentSlide.link.text}</a></h3>
  `;

  const mediaQuery = window.matchMedia("(max-width: 600px)")
  if(mediaQuery.matches){
    welcomeMesage.style.background = `url(${currentSlide.image[1]})`
    welcomeMesage.style.backgroundRepeat = `no-repeat`;
    welcomeMesage.style.backgroundPosition = `center`;
    welcomeMesage.style.backgroundSize = `cover`;
    welcomeMesage.querySelector("h3 a").style.color = "#eee";
  }else{
     welcomeMesage.style.background = `#fff`
  }
}

setInterval(createSlideshow, 4000);

function redirectAllTeacher(code){
  window.location.href = `allteacher.html?code=${code}`;
}

//function calls
updateCalendar();
displayTeachers();
displayNotifications();
createSlideshow();
//event listeners
notificationBtn.addEventListener("click", showNotification);
