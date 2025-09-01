
const navigation = document.querySelector(".navigation");
const openNav = document.querySelector(".mobile-tablet .open")
const tabletMode = window.matchMedia("(max-width:1025px)");
const mobiletMode = window.matchMedia("(max-width:620px)");
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
  if(!openNav) return
    openNav.addEventListener("click" , () => {
      const icon = openNav.querySelector("i");
      if(icon){
        if(icon.classList.contains("fa-times")){
          closeNav()
          icon.classList.add("fa-bars")
          icon.classList.remove("fa-times")
        }else{
          openSideNav();
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

const adminNav =  `
<div class="body">
 <a href="#">
   <i class="fa fa-home"></i>
   <span class="writing">Dashboard</span>
 </a>
  <a href="setup.html">
   <i class="fa-solid fa-gear"></i>
   <span class="writing">setup</span>
  </a>
  <a href="enrol.html">
   <i class="fa fa-user-plus"></i>
   <span class="writing">enrol student</span>
 </a>
  <a href="tenarol.html">
   <i class="fa fa-user-plus"></i>
   <span class="writing">enrol teacher</span>
 </a>
 <a href="students.html">
   <i class="fa fa-users"></i>
   <span class="writing">all users</span>
 </a>
  <a href="admincalendar.html">
    <i class="fa fa-calendar"></i>
    <span class="writing">event</span>
  </a>
 <a href="selectsubjects.html">
   <i class="fa fa-layer-group"></i>
   <span class="writing">subject teachers</span>
 </a>
<a href="exam.html">
   <i class="fa fa-clock"></i>
   <span class="writing">exam</span>
 </a>
 <a href="rollcall.html">
  <i class="fa fa-clipboard"></i>
  <span class="writing">rollcall</span>
 </a>
<a href="qrcode.html">
  <i class="fas fa-qrcode"></i>
  <span class="writing">class codes</span>
 </a>
 <a href="timetable.html">
   <i class="fa fa-table-columns"></i>
   <span class="writing">timetable</span>
 </a>
 <a href="analysis.html">
   <i class="fa fa-line-chart"></i>
   <span class="writing">analysis</span>
 </a>
</div>           
`;

const url = new URLSearchParams(window.location.search);
const idofschool = url.get("school");

async function updateSideNav(){
  const user = await getUser();
    if(user.from === "teacher"){
      body.innerHTML = teacherSidenav;
    }else if(user.from === "student"){
      body.innerHTML = studentSidenav;
    }else if(user.from === "admin"){
      body.innerHTML = adminNav;
    }else if(idofschool === null) {
      window.location.href = "main.html";
    }
}

updateSideNav();

//function to dispaly notifications
 async function getNotificaions(){
   const user = await getUser();
   try{
     const response = await fetch("getnotifications.php" , {
        method : 'POST'
     })
     const result = await response.json();

     const thisSchool = result.filter(n => n.schoolId === user.schoolId);
     return thisSchool;
   }catch(error){
     console.log("notification error" , error);
   }
 }

 async function logoutUser(){
  const user = await getUser();
  if(user.from === ""){
    window.location.href = "main.html"
  }
 }

 logoutUser();