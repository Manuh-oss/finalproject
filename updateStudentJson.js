
document.getElementById("form").addEventListener("submit" , 
function updateStudentJson(){

    const xhr = new XMLHttpRequest();

    xhr.open('POST' , 'examples.php' , true);

    const name = document.getElementById("text");

    name.addEventListener("input" , function (e) {

    const param = "name="+e.target.value;

    console.log(name)

    xhr.setRequestHeader('Content-type' , 'application/x-www-form-urlencoded');

    xhr.onload = function () {
       if(this.status == 200){
        console.log(this.responseText)
       }
    }

    xhr.send(param);

    })

}
)


