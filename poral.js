const discplineForm = document.querySelector(".inputs");
const submitDispline = document.querySelector(".btn .submit");

const date = new Date();
const today = `${date.getDate()}/${date.getMonth() +1}/${date.getFullYear()}`;

//function getUser

function getUser(callback){
    const formDate = new FormData(discplineForm);
    const xhr = new XMLHttpRequest();
    xhr.open('GET' , 'saved_user.php' , true);
    xhr.onload = () => {
        if(xhr.status == 200){
            const response = JSON.parse(xhr.responseText);
            callback(response);
        }
    }
    xhr.send();
}

function postDisplineForm(){
    const formDate = new FormData(discplineForm);
    getUser((user) => {
        formDate.append("user" , user.code);
        formDate.append("date" , today);
        const xhr = new XMLHttpRequest();
        xhr.open('POST' , 'postrecords.php' , true);
        xhr.onload = () => {
            if(xhr.status == 200){
                const response = (xhr.responseText);
                console.log(response);
            }
        }
        xhr.send(formDate);
    })
}

submitDispline.addEventListener("click" , postDisplineForm)