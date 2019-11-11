var noteList = [];

window.addEventListener('DOMContentLoaded', popUpLoad);
  function closePopUp() {
    let popup = document.querySelector("#popUp")
    popup.style.display = "none"
    localStorage.setItem('savePopUp', true);
  }

function popUpLoad() {
  if (!localStorage.getItem('savePopUp')) {
    document.getElementById('popUp').classList.toggle('showPopUp');
    //localStorage["alertdisplayed"] = true
    //localStorage.setItem('savePopUp', true);
  }
  renderNoteList();
}

var Delta = Quill.import('delta');
var quill = new Quill('#editor-container', {
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: "ordered" }, { list: "bullet" }],
      ['image', 'code-block']
    ]
  },
  placeholder: 'Ny anteckning...',
  theme: 'snow'  // or 'bubble'
});

// Store accumulated changes
var change = new Delta();
quill.on('text-change', function (delta) {
  change = change.compose(delta);
});

// Save periodically
setInterval(function () {
  if (change.length() > 0) {
    console.log('Saving changes', change);
    // Save the entire updated text to localStorage
    const data = JSON.stringify(quill.getContents())
    localStorage.setItem('storedText', data);
    change = new Delta();
  }
}, 5 * 1000);

// Check for unsaved data
window.onbeforeunload = function () {
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

function saveNotes () {
  localStorage.setItem('notes', JSON.stringify(noteList))

}

function addNote() {
  let note = {
    id: Date.now(),
    content: quill.getContents(),
    title: quill.getText(0, 20),
    favourite: false,
  }

  if (!noteList) {
    noteList = [];
  }
  
  noteList.push(note);
  saveNotes();

}
function selectNote(noteID) {
    console.log("id: " + noteID)
    // hitta en note i noteList vars ID stämmer överrens med argumentet id.
    // setcontents note.content
    let note = noteList.find(note => note.id === noteID)
    quill.setContents(note.content);
  } 

function renderDiv(note) {
    let noteDivs = document.querySelector("#notes");
    let myDiv = document.createElement('div');
    let deleteButton = document.createElement('span');

    myDiv.classList.add('note');
    myDiv.id = note.id;
    //color sparas inte på note:n
    myDiv.classList.add(form.color.value);
    myDiv.innerHTML = `${note.title} ${new Date(note.id).toLocaleTimeString()}`
    myDiv.addEventListener("click", () => selectNote(note.id));
    
     //delete funkar ej
    deleteButton.classList.add('note-delete');
    deleteButton.innerHTML = '&times;';

  

    noteDivs.appendChild(myDiv);
    myDiv.appendChild(deleteButton);
    
    form.noteText.value = '';
    form.noteText.focus();

    addListenerDeleteButton(deleteButton);
  }

  

  //delete funkar ej
  //göra       removeItem(note.id) ?
  function addListenerDeleteButton(deleteButton) {
    deleteButton.addEventListener('click', function (e) {
      e.stopPropagation();
      deleteNote(e);
    });
  }
  
  /*
  function deleteNote(e) {
    let clickedID = e.target.querySelector('span').innerHTML;
    console.log(clickedID);
    noteList = noteList.filter(item => item.id !== Number(clickedID));
    e.target.remove();
  }
*/

  function deleteNote(e) {
    let noteID = e.target.parentNode.id
    noteList = noteList.filter(note => note.id !== Number(noteID)); 

    saveNotes();
    let eventNote = e.target.parentNode;
    eventNote.parentNode.removeChild(eventNote);
  }


function renderNoteList() {
    document.querySelector("#notes").innerHTML = "";
    noteList = JSON.parse(localStorage.getItem('notes'));
    console.log(noteList)
  /*
  noteList.forEach(function (note) {
    ...
  }); */
    noteList.forEach(note => {
    renderDiv(note);
  })

}
// Functions
/*
function oldaddNote() {
  let text = quill.getText(0, 20);
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
}*/




// Event Listeners
form.addButton.addEventListener('click', function (e) {
  e.preventDefault();
  if (form.value != '') {
    addNote();
  }
})