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

function getSetup(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "getsetup.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        console.log("response" , response)
        callback(response);
      }
    } catch (error) {
      console.log("setup error", error);
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
  if(!openNav) return
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

function updateSideNav(){
  getUser((user) => {
    if(user.from === "teacher"){
      body.innerHTML = teacherSidenav;
    }else if(user.from === "student"){
      body.innerHTML = studentSidenav;
    }else if(user.from === "admin"){
      body.innerHTML = adminNav;
    }else if(idofschool === null) {
      window.location.href = "main.html";
    }
  })
}

updateSideNav();

//select fields aupdate

let databaseClases;
let databaseStream;

getUser((user) => {
getSetup((schoolSetups) => {
  const thisSchool = schoolSetups.find(s => s.schoolId === user.schoolId);

  if(thisSchool){
    const clases = getClases(thisSchool.clases);
    const subjects = getSubjects(thisSchool.subjects);
    const streams = getStreams(thisSchool.streams)
    databaseClases = clases;
    databaseStream = streams;
    const allClassSelects = document.querySelectorAll("#class");
    const allStreamSelects = document.querySelectorAll("#stream");
    if(allClassSelects.length > 0){
      allClassSelects.forEach(classSelect => {
        classSelect.innerHTML = "";
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "--select class--";
        classSelect.appendChild(defaultOption);

        clases.forEach(clas => {
          const option = document.createElement("option");
          option.value = clas;
          option.textContent = clas;
          classSelect.appendChild(option);
        })

        classSelect.addEventListener("change" , () => {
          const classStreams = streams[classSelect.value];
          allStreamSelects.forEach(select => {
            select.innerHTML = ""
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "--select stream--";
            select.appendChild(defaultOption);

             classStreams.forEach(stream => {
              const option = document.createElement("option");
              option.value = stream;
              option.textContent = stream;
              select.appendChild(option);
            })
            
          })
        })

     })
    }


  }

})
})
function getClases(rawClases){
  const rawclasesArray = rawClases.split("-");
  const classArray = rawclasesArray.map(s => {
    const [classes] = s.split("/");
    return classes
  })
  return classArray;
}

function getSubjects(rawSubjects){
  const rawstreamArray = rawSubjects.split("-");
  const streamArray = rawstreamArray.map(s => {
    const [classes] = s.split("/");
    return classes
  })
  return streamArray;
}

function getStreams(rawStreams) {
  let result = {};
  const rawstreamArray = rawStreams.split("-");

  rawstreamArray.forEach(stream => {
    const parts = stream.split(":");
    if (parts.length === 2) {
      const [clas, streams] = parts;
      result[clas] = streams.split("/");
    }
  });

  return result;
}


function loadSchoolData(callback) {
  // If it's already loaded globally, use it directly
  if (window.schoolData) {
    callback(window.schoolData);
    return;
  }

  // Otherwise fetch fresh
  getUser((user) => {
    getSetup((schoolSetups) => {
      const thisSchool = schoolSetups.find(s => s.schoolId === user.schoolId);

      if (thisSchool) {
        const clases = getClases(thisSchool.clases);
        const subjects = getSubjects(thisSchool.subjects);
        const streams = getStreams(thisSchool.streams);

        const schoolData = {
          classes: clases,
          subjects: subjects,
          streams: streams
        };

        window.schoolData = schoolData; // store globally
        callback(schoolData);
      } else {
        console.log("School not found for user.");
      }
    });
  });
}

function showLoader() {
  getSetup((setups) => {
    getUser((user) => {
      const thisSchool = setups.find(s => s.schoolId === user.schoolId);
      const loader = document.createElement("div");
      loader.className = "loading-page";

      const school = document.createElement("div");
      school.className = "school";

      const img = document.createElement("img");
      img.src = thisSchool.badge;

      const h3 = document.createElement("h3");
      h3.innerHTML = "Preparing your learning environment… <i class='fa-solid fa-wave-square'></i>";

      school.appendChild(img);
      school.appendChild(h3);
      loader.appendChild(school);

      loader.style.opacity = "0";
      loader.style.transform = "scale(0.5)";
      document.body.appendChild(loader);

      requestAnimationFrame(() => {
        loader.style.opacity = "1";
        loader.style.transform = "scale(1)";
      });

      console.log("am showing loader");

      const hideLoader = () => {
        console.log("already loaded");
        loader.style.opacity = "0";
        loader.style.transform = "scale(0.5)";
        setTimeout(() => loader.remove(), 400);
      };

      if (document.readyState === "complete") {
        hideLoader(); // Page already loaded
      } else {
        window.addEventListener("load", hideLoader);
      }
    });
  });
}

showLoader();


