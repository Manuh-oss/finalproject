const shortMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const fullDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const qrColors = [
  "#004080", // Deep Blue
  "#00796B", // Teal
  "#D32F2F", // Strong Red
  "#388E3C", // Forest Green
  "#5D4037"  // Rich Brown
];

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

function getClassRegister(callback){
   getUser((user) => {
   const xhr = new XMLHttpRequest();
   xhr.open('POST','getclassattendance.php',true);
   xhr.onload = () => {
    try{
      if(xhr.status === 200){
        const response = JSON.parse(xhr.responseText);
        const thisSchool = response.filter(t => t.schoolId === user.schoolId)
        callback(thisSchool);
      }
    }catch(error){
      console.log(xhr.responseText);
    }
   }
   })
}

const sessionPeriods = {};
const navBtns = Array.from(document.querySelectorAll(".options button"));

const date = new Date();

const addZero = new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 });
document.querySelector(".today").textContent =
  fullDays[date.getDay()] +
  " " +
  "|" +
  " " +
  date.getDate() +
  " " +
  shortMonths[date.getMonth()] +
  "," +
  " " +
  date.getFullYear();
document.querySelector(".now").textContent =
  date.getHours() + ":" + addZero.format(date.getMinutes());




//qr codes function start here
const qrCodeBox = document.querySelector(".qr-codes-container");
function showQrCodes(){
 loadSchoolData((schoolData) => {
   const school = schoolData.streams;
   qrCodeBox.style.display = "flex";
   const categorisedData = getCategory(school);
   qrCodeBox.innerHTML = ""
   
   Object.entries(categorisedData).forEach(([category , categoryData]) => {
     const categoryBox = document.createElement("div");
     categoryBox.className = "category-box";
     const h2 = document.createElement("h2");
     h2.textContent = category;
     categoryBox.appendChild(h2)

     const classBody = document.createElement("div");
     classBody.className = "body";

     Object.entries(categoryData).forEach(([clas , streams]) => {
      const classBox = document.createElement("div");
      classBox.className = "class-box";
      
      const h3 = document.createElement("h3");
      h3.textContent = clas;
      classBox.appendChild(h3);

      const streamBox = document.createElement("div");
      streamBox.className = "streams";

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "download";

      streams.forEach(stream => {
        const span = document.createElement("span");
        const text = clas+"-"+stream;
        const imgDiv = document.createElement("div");
        imgDiv.className = "img";
        generateQrCode(text,imgDiv);
        const h3 = document.createElement("h3");
        h3.textContent = stream;
        span.appendChild(imgDiv);
        span.appendChild(h3);

        streamBox.appendChild(span);
      })
       
       classBox.appendChild(streamBox);
       classBox.appendChild(button);
       classBody.appendChild(classBox);
       categoryBox.appendChild(classBody);

       button.addEventListener("click" , (e) => {
         e.stopPropagation();
         downloadClassQRCodes(classBox, clas)
       })
     })
      qrCodeBox.appendChild(categoryBox);
   })
 })
}

function downloadClassQRCodes(classElement, className) {
  const canvases = classElement.querySelectorAll("canvas");
  const streams = Array.from(classElement.querySelectorAll("h3"))
                        .map(h3 => h3.textContent.trim());

  canvases.forEach((canvas, index) => {
    const dataURL = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = dataURL;
    a.download = `${className}_${streams[index]}_QrCode.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}


function getCategory(data){
  const categorisedData = {};
  Object.entries(data).forEach(([clas,streams]) => {
     if(!categorisedData[getCategories(clas)]) categorisedData[getCategories(clas)] = {};
     if(!categorisedData[getCategories(clas)][clas]) categorisedData[getCategories(clas)][clas] = [];

     streams.forEach(stream => {
      categorisedData[getCategories(clas)][clas].push(stream);
     })

  })
  return categorisedData;
}

function getCategories(clas) {
  const formattedKey = clas.replace(/\s+/g, "").toLowerCase();
  const streamCategories = {
    playgroup: "pre-primary",
    pp1: "pre-primary",
    pp2: "pre-primary",
    grade1: "primary",
    grade2: "primary",
    grade3: "primary",
    grade4: "primary",
    grade5: "primary",
    grade6: "primary",
    grade7: "junior secondary",
    grade8: "junior secondary",
    grade9: "junior secondary",
    grade10: "senior secondary",
    grade11: "senior secondary",
    grade12: "senior secondary",
  };

  return streamCategories[formattedKey] || "uncategorised";
}

function generateQrCode(text,html){
  const random = Math.floor(Math.random() * qrColors.length);
  const qrCode = new QRCodeStyling({
    width : 200,
    height : 200,
    data : text,
    dotsOptions: {
        color: qrColors[random],
        type: "extra-rounded" 
    },
    backgroundOptions: {
      color: "#ffffff"
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 5
    }
  });
   
  html.innerHTML = "";
  qrCode.append(html);
}

//event listeners
navBtns[2].addEventListener("click" , showQrCodes);