// get all DOM ids and classes

const allRequiredInputs = document.querySelectorAll(".required");
const form = document.querySelector(".form");
const studentForm = document.querySelector(".students-profile");
const parentForm = document.querySelector(".parents-profile");
const submitBtns = document.querySelectorAll(".submit");
const profileImageBox = document.querySelector(".profile-image-container .image img");


//check if required input fields have been field

function profileSubmittion() {
  let allfilled = true;
  allRequiredInputs.forEach((allRequiredInput) => {
    allRequiredInput.classList.remove("errors");
  }); // restore all inputs

  allRequiredInputs.forEach((input) => {
    if (input.value.trim() === "") {
      input.classList.add("errors");
      allfilled = false;
    } else {
      if(profileImageBox.classList.contains("uploaded")){
        allfilled = true;
      }else{
        document.querySelector(".profile-image").value = "./teachers/profileimage.png";
        allfilled = true;
      }
    }
  });

  if(allfilled){
    form.submit();
  }
}

//event listeners

submitBtns.forEach((submitBtn) => {
  submitBtn.addEventListener("click", profileSubmittion);
});


