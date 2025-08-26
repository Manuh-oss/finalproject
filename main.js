function getSchool(){
  const hostname = window.location.hostname;
  const hostnameParts = hostname.split(".");
  const subDomain = hostnameParts[0];
  return subDomain
}

function getSetup(callback) {
  const subDomain = getSchool();
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "getsetup.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        const thisSchool = response.find(s => s.domain.toLowerCase() === subDomain);
        callback(thisSchool);
      }
    } catch (error) {
      console.log("setup error", error);
    }finally{
      console.log(xhr.responseText)
    }
  };
  xhr.send();
}

function getSliders(callback) {
  getSetup((setups) => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "getSlidesho.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        const thisSchool = response.filter(s => s.schoolId === setups.schoolId);
        callback(thisSchool);
      }
    } catch (error) {
      console.log("slideshow error", error);
    }
  };
  xhr.send();
  })
}

const slideshowCont = document.querySelector(".slideshow");
let currentIndex = 0;

function showSliders(){
  getSliders((sliders) => {
    const thisSchool = sliders.filter(s => s.type === "slider");
    if(thisSchool.length > 0){
      slideshowCont.innerHTML = "";
      
      if(currentIndex >= thisSchool.length){
        currentIndex = 0;
      }else if(currentIndex < 0){
        currentIndex = 0;
      }
      
      const currentSlide = thisSchool[currentIndex];
      const imageDiv = document.createElement("div");
      imageDiv.className = "image-container";
      imageDiv.style.backgroundImage = `url(${currentSlide.img})`;

      const textDiv = document.createElement("div");
      textDiv.className = "text-content";
      textDiv.innerHTML = `
         <h3>${currentSlide.h2}</h3>
         <p>${currentSlide.p}</p>
      `;

      const dotsCont = document.createElement("div");
      dotsCont.className = "dots"

      for(let x = 0;x < thisSchool.length; x++){
        const span = document.createElement("span");
        dotsCont.appendChild(span);

        span.addEventListener("click" , () => {
          currentIndex = x;
          clearInterval(interval);
          showSliders()
        })

      }

      Array.from(dotsCont.children)[currentIndex].classList.add("active");



      slideshowCont.appendChild(imageDiv);
      slideshowCont.appendChild(textDiv);
      slideshowCont.appendChild(dotsCont);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          imageDiv.style.transform = "translateY(0)";
          imageDiv.style.opacity = "1";

          textDiv.style.transform = "translateY(0) scale(1)";
          textDiv.style.opacity = "1";
        })
      })

      currentIndex++

    }
  })
}
showSliders()
let interval = setInterval(showSliders , 6000);



//function to update school information
const schoolInfoBox = document.querySelectorAll(".school-info .box");
function showSchoolInfo(){
  getSetup((schoolSetups) => {
    const thisSchool = schoolSetups
    const schoolInfo = thisSchool.layout;
    const splited = schoolInfo.split("&");

    const schoolMotto = splited[0];
    showHandles(splited[1]);
    const schoolInfoLayout = getSchoolInfoLayout(schoolMotto);
    
    schoolInfoBox.forEach((box ,idx)=> {
      box.innerHTML = "";
      box.innerHTML = `
       <h2>${schoolInfoLayout[idx].split("-")[0]}</h2>
       <p>${schoolInfoLayout[idx].split("-")[1]}</p>
      `;
    })

  })
}

function getSchoolInfoLayout(rawLyout){
   const [type , data] = rawLyout.split("/");
   const dataArray = data.split(":");
   return dataArray;
}

function showHandles(handles){
  const links = document.querySelector("footer .links");
  const layout =  getSchoolInfoLayout(handles);
  links.innerHTML = "";
  
  for(let x = 0; x< layout.length; x++){
    const a = document.createElement("a");
    a.href = layout[x].split("-")[1];
    a.innerHTML = `
      <i class="fa-brands fa-${layout[x].split("-")[0]}"></i>
    `;
    links.appendChild(a);
  }
}

//function to display schoo heads
let currentIndez = 0;
function displaySchoolHead(){
  getSliders((schoolheads) => {
    const body = document.querySelector(".founders");
    body.innerHTML = "";
    const thisSchool = schoolheads.filter(s => s.type === "head");
    if(thisSchool.length > 0){

      body.innerHTML = "";

      if(currentIndez >= thisSchool.length ){
        currentIndez = 0;
      }

      const head = thisSchool[currentIndez];
      
      const headbox = document.createElement("div");
      headbox.style.opacity = "0";
      headbox.style.transform = "translateX(-100%)";
      headbox.className = "box";
      headbox.innerHTML = `
        <div class="image">
          <img src="${head.img}" alt="">
        </div>
        <div class="text">
          <h3>${head.h2}</h3>
          <p>${head.p}</p>
          <h4>${head.rank}</h4>
        </div>
      `;
      body.appendChild(headbox);

      requestAnimationFrame(() => {
        headbox.style.opacity = "1";
        headbox.style.transform = "translateX(0)";
      })

      currentIndez++;
    }
  })
}

function updateSchoolNames(){
  getSetup((setup) => {
    const schoolName = document.querySelectorAll(".school-namez");
    schoolName.forEach(div => div.innerText = setup.schoolName);
    document.querySelector("#badge").setAttribute('src' , setup.badge)
  })
}

//function class
showSchoolInfo();
updateSchoolNames();
displaySchoolHead();
setInterval(displaySchoolHead , 6000);
getSchool();

//event listeners
const portalDropdown = document.querySelector(".portal");
const icon = portalDropdown.querySelector("i");
const dropDown = portalDropdown.querySelector(".dropdown");

portalDropdown.addEventListener("click" , () => {
  if(icon.classList.contains("fa-angle-down")){
    icon.classList.remove("fa-angle-down");
    icon.classList.add("fa-angle-up");

    dropDown.style.height = "13.5rem";
    dropDown.style.border = "1px dotted #000";

  }else{
    icon.classList.remove("fa-angle-up");
    icon.classList.add("fa-angle-down");

    dropDown.style.height = "0";
    dropDown.style.border = "none";
  }
})