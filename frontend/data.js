const phones = ['0745057879','0721734207'];
const message = "test messsage from finewave technologies";

async function postSms(){
    try{
      const response = await fetch("http://manuhacademy.myschools.local:3000/smsService?ts=n" + Date.now(), {
        method : 'POST',
        headers : { "Content-Type": "application/json" },
        body : JSON.stringify({phones , message})
      })
      const result = await response.text();
      console.log(response)
      console.log(result);
    }catch(error){
        console.log("error posting" , error);
    }
}

const button = document.querySelector("button");
button.addEventListener("click" , postSms);