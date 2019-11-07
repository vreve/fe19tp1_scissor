
// let user = document.getElementById(infoText);

// function changeColor(newColor) {
//     var elem = document.getElementById('infoText');
//     elem.style.color = newColor;
//   }

//   localStorage.setItem('age', "30");

//   var cat = localStorage.getItem('30');/*  */

window.addEventListener('DOMContentLoaded', myFunction);


function myFunction() {

    if (!localStorage.getItem('savePopUp')) {
        document.getElementById('popUp').classList.toggle('showPopUp');
        //localStorage["alertdisplayed"] = true
        localStorage.setItem('savePopUp', true);
    }
}



