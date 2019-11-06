
// let user = document.getElementById(infoText);

// function changeColor(newColor) {
//     var elem = document.getElementById('infoText');
//     elem.style.color = newColor;
//   }

//   localStorage.setItem('age', "30");

//   var cat = localStorage.getItem('30');/*  */

window.addEventListener('DOMContentLoaded', myFunction);


function myFunction() {
    //console.log("yo");

    if (!localStorage.getItem("alertdisplayed")) {
        document.getElementById("myDiv").classList.toggle("nohidden");
        //localStorage["alertdisplayed"] = true
        localStorage.setItem('alertdisplayed', true);
    }
}



