
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


var Delta = Quill.import('delta');
var quill = new Quill('#editor-container', {
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        [{ list : "ordered" }, { list : "bullet"}],
        ['image', 'code-block']
      ]
    },
    placeholder: 'Ny anteckning...',
    theme: 'snow'  // or 'bubble'
  });

// Store accumulated changes
var change = new Delta();
quill.on('text-change', function(delta) {
  change = change.compose(delta);
});

// Save periodically
setInterval(function() {
  if (change.length() > 0) {
    console.log('Saving changes', change);
    // Save the entire updated text to localStorage
    const data = JSON.stringify(quill.getContents())
    localStorage.setItem('storedText', data);
    change = new Delta();
  }
}, 5*1000);

// Check for unsaved data
window.onbeforeunload = function() {
  if (change.length() > 0) {
    return 'There are unsaved changes. Are you sure you want to leave?';
  }
} 



