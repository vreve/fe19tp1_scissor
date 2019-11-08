
window.addEventListener('DOMContentLoaded', popUpLoad);

function popUpLoad() {

    if (!localStorage.getItem('savePopUp')) {
        document.getElementById('popUp').classList.toggle('showPopUp');
        //localStorage["alertdisplayed"] = true
        localStorage.setItem('savePopUp', true);
    }
}
/*
function removePopUpOnHide() {
  if (localStorage.getItem('savePopUp', true)) {
    document.setElementById('popUpNone'); 
  } else {
    document.getElementById('popUp').classList.toggle('showPopUp');
    }
  }
  */
 
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








const form = {}
form.noteText = document.querySelector('#editor-container');
form.addButton = document.querySelector('#formAddButton');
form.color = document.querySelector('#formColor');

const notes = document.querySelector('#notes');

form.noteText.focus();

// Functions
function addNote() {
  let text = form.value;
  let note = document.createElement('div');
  let deleteButton = document.createElement('span');

  note.classList.add('note');
  note.classList.add(form.color.value);
  note.innerHTML = `<div id="#editor-container>${text}</div>`;
  deleteButton.classList.add('note-delete');
  deleteButton.innerHTML = '&times;';

  note.appendChild(deleteButton);  
  notes.appendChild(note);

  form.noteText.value = '';
  form.noteText.focus();

  addListenerDeleteButton(deleteButton);
}

function addListenerDeleteButton(deleteButton) {
  deleteButton.addEventListener('click', function (e) {
    e.stopPropagation();      
    deleteNote(e);
  });
}

function deleteNote(e) {
  let eventNote = e.target.parentNode;
  eventNote.parentNode.removeChild(eventNote);
}


// Event Listeners
form.addButton.addEventListener('click', function (e) {
  e.preventDefault();  
  if (form.value != '') {
    addNote();
  }
})