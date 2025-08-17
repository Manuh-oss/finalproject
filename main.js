function getSliders(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "getSlidesho.php", true);
  xhr.onload = () => {
    try {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(response);
      }
    } catch (error) {
      console.log("slideshow error", error);
    }
  };
  xhr.send();
}

const slideshowCont = document.querySelector(".slideshow");
let currentIndex = 0;

function showSliders(){
  getSliders((sliders) => {
    const thisSchool = sliders.filter(s => s.schoolId === "1");
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