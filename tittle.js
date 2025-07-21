const openSearch = document.querySelector(".open-search");
const searchDropdown = document.querySelector(".search-dropdown");
const collapsedStates = document.querySelectorAll(".collapsed");
const expandStates = document.querySelector(".expanded");
const angleDowns = document.querySelectorAll(".expanded .fa-bell");
const notificationIcon = document.querySelector(".notification .fa-bell");
const notificationBox = document.querySelector(
  ".notification .notification-dropdown"
);
const navigation = document.querySelector(".navigation");
const openNav = document.querySelector(".mobile-tablet .open")
const tabletMode = window.matchMedia("(max-width:1025px)");
const mobiletMode = window.matchMedia("(max-width:620px)");

if(openSearch){
openSearch.addEventListener("click", function () {
  if (searchDropdown.classList.contains("hide")) {
    searchDropdown.style.display = "flex";
    searchDropdown.classList.remove("hide");
    openSearch.classList.remove("fa-beat");
    notificationBox.style.display = "none";
    notificationBox.classList.add("closed");
  } else {
    searchDropdown.style.display = "none";
    searchDropdown.classList.add("hide");
    openSearch.classList.add("fa-beat");
  }
});
}

if(notificationIcon){
notificationIcon.addEventListener("click", function () {
  if (notificationBox.classList.contains("closed")) {
    notificationBox.classList.remove("closed");
    notificationBox.style.display = "flex";
    searchDropdown.style.display = "none";
    searchDropdown.classList.add("hide");
    openSearch.classList.add("fa-beat");
  } else {
    notificationBox.classList.add("closed");
    notificationBox.style.display = "none";
  }
});
}

if(collapsedStates){
collapsedStates.forEach((collapsedState) => {
  function openNotificationBox() {
    collapsedState.innerHTML = "";
    let okay = this.nextElementSibling.innerHTML;
    collapsedState.className = "expanded";
    collapsedState.innerHTML = okay;
    setTimeout(closeNotificationBox, 5000);
  }

  const collapsedStateHtml = collapsedState.innerHTML;
  collapsedState.addEventListener("click", openNotificationBox);

  function closeNotificationBox() {
    collapsedState.innerHTML = "";
    collapsedState.className = "collapsed";
    collapsedState.innerHTML = collapsedStateHtml;
  }
});

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


//function to open navigation
const icon = openNav.querySelector(".fa-bars");
function openSideNav() {
  let width;
  let position;
  let translate;

  if(icon){
    icon.classList.add("fa-times")
    icon.classList.remove("fa-bars")
  }

  if (mobiletMode.matches) {
    width = "80vw";
    translate = "translateX(0)";
    position = "fixed";
  } else if (tabletMode.matches) {
    width = "40vw";
    translate = "translateX(0)";
    position = "fixed";
  } else {
    width = "18%";
    translate = "translateX(0)";
    position = "sticky";
  }

  navigation.style.transform = translate;
  navigation.style.zIndex = "1000";
  navigation.style.width = width;
  navigation.style.backdropFilter = "blur(10px)";
  navigation.style.top = "0";
  navigation.style.position = position;
  navigation.style.visibility = "visible";
}

function closeNav(){
    let width;
    let position;
    let translate;

    if (mobiletMode.matches) {
    width = "80vw";
    translate = "translateX(-100%)";
    position = "absolute";
  } else if (tabletMode.matches) {
    width = "40vw";
    translate = "translateX(-100%)";
    position = "absolute";
  } else {
    width = "18%";
    translate = "translateX(0)";
    position = "sticky";
  }

  navigation.style.transform = translate;
  navigation.style.zIndex = "0";
  navigation.style.width = width;
  navigation.style.backdropFilter = "blur(10px)";
  navigation.style.top = "0";
  navigation.style.position = position;
  navigation.style.visibility = "hidden";
}

document.addEventListener("DOMContentLoaded" , () => {
    openNav.addEventListener("click" , () => {
      const icon = openNav.querySelector("i");
      if(icon){
        if(icon.classList.contains("fa-times")){
          closeNav()
          console.log("closing")
          icon.classList.add("fa-bars")
          icon.classList.remove("fa-times")
        }else{
          openSideNav();
          console.log("rada")
        }
      }
    })
})

const body = navigation.querySelector(".body");
const teacherSidenav = `
            <a href="tuser.html"
              ><i class="fa fa-home"></i>
              <span class="writing">Dashboard</span></a
            >
            <a href="tadminprofile.html"
              ><i class="fa fa-user"></i>
              <span class="writing">profile</span></a
            >
            <a href="marks2.html"
              ><i class="fa fa-upload"></i>
              <span class="writing">marks</span></a
            >
             <a href="myclasses.html"
              ><i class="fa fa-chalkboard"></i>
              <span class="writing">my clases</span></a
            >
            <a href="result.html"
              ><i class="fa fa-book"></i>
              <span class="writing">Result</span></a
            >
              <a href="quiz.html"
              ><i class="fa fa-clock"></i>
              <span class="writing">quiz</span></a
            >
            <a href="tnotes.html"
            ><i class="fa fa-pen"></i>
            <span class="writing">notes</span></a
             >
             <a href="postassignment.html"
             ><i class="fa fa-chair"></i>
             <span class="writing">assignment</span></a
           >
            <a href="admincalendar.html"
              ><i class="fa fa-calendar"></i>
              <span class="writing">event</span></a
            >
            <a href="displaytimetable.html"
              ><i class="fa fa-table"></i>
              <span class="writing">Timetable</span></a
            >
`;

const studentSidenav = `
    <div class="body">
            <a href="dashboard.html"
              ><i class="fa fa-home"></i>
              <span class="writing">Dashboard</span></a
            >
            <a href="profile.html"
              ><i class="fa fa-user"></i>
              <span class="writing">profile</span></a
            >
            <a href="sresult.html"
              ><i class="fa fa-book"></i>
              <span class="writing">Result</span></a
            >
              <a href="postquiz.html"
              ><i class="fa fa-clock"></i>
              <span class="writing">quiz</span></a
            >
             <a href="assignment.html"
             ><i class="fa fa-chair"></i>
             <span class="writing">assignment</span></a
           >
            <a href="admincalendar.html"
              ><i class="fa fa-calendar"></i>
              <span class="writing">event</span></a
            >
            <a href="displaytimetable.html"
              ><i class="fa fa-table"></i>
              <span class="writing">Timetable</span></a
            >
             <a href="transcripts.html"
              ><i class="fa fa-chart-bar"></i>
              <span class="writing">Transcript</span></a
            >
          </div>
`;

function updateSideNav(){
  getUser((user) => {
    if(user.from === "teacher"){
      body.innerHTML = teacherSidenav;
    }else if(user.from === "student"){
      body.innerHTML = studentSidenav;
    }
  })
}

updateSideNav();