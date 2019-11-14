var noteList = [];
var selectedNote;

/* reminder object från array påverkar arrayen
noteList [{},{},{}]
let note = noteList[0]
note.favourite = true
noteList[0].favourite = true
*/

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
  quill.focus();
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


const navbar = {}
navbar.newNote = document.querySelector('#newNote');
navbar.favorite = document.querySelector('#favorite');

const form = {}
form.editnote = document.querySelector('#editor-container');
form.saveBtn = document.querySelector('#formAddButton');
form.color = document.querySelector('#formColor');

form.color.addEventListener('input', function (e) {
  console.log(e.target.value);
})

const notes = document.querySelector('#notes');
form.editnote.focus();

/*FUNKTIONER*/

function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(noteList));

}

function addNote() {
  let note = {
    id: Date.now(),
    content: quill.getContents(),
    title: quill.getText(0, 20),
    favourite: false,
    color: form.color.value
  }

  if (!noteList) {
    noteList = [];
  }
  noteList.unshift(note);
  saveNotes();
  quill.setText('');
}

function selectNote(noteID) {
  console.log("id: " + noteID)
  // hitta en note i noteList vars ID stämmer överrens med argumentet id.
  // setcontents note.content
  selectedNote = noteList.find(note => note.id === noteID)
  quill.setContents(selectedNote.content);
  quill.setText(selectedNote.title);

  form.color.value = selectedNote.color;
}


function renderDiv(note) {
  let noteDivs = document.querySelector("#notes");
  let myDiv = document.createElement('div');
  let deleteButton = document.createElement('span');

  myDiv.classList.add('note');
  myDiv.classList.add(note.color);
  myDiv.id = note.id;

  myDiv.innerHTML = `${note.title} ${new Date(note.id).toLocaleDateString()} ${new Date(note.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  myDiv.addEventListener("click", () => selectNote(note.id));

  deleteButton.classList.add('note-delete');
  deleteButton.innerHTML = '&times;';

  noteDivs.appendChild(myDiv);
  myDiv.appendChild(deleteButton);

  form.editnote.value === "";
  form.editnote.focus();

  addListenerDeleteButton(deleteButton);
}


/*
const showDeleted = (note) => note.deleted === true;
const showFavorites = (note) => note.favorite === true;

 
function filterNotes(func = () => true) {
//console.log(func(1));
  let filtered = noteList.filter(func)
  return filtered;
}
 
function showOnlyFavs() {
  let notes = document.querySelector('#notes');
  notes.innerHTML = "";
 
  let onlyFavs = filterNotes(showDeleted);
  onlyFavs.forEach(function (note) {
      renderNotelist();
  });
  */




function addListenerDeleteButton(deleteButton) {
  deleteButton.addEventListener('click', function (e) {
    e.stopPropagation();
    deleteNote(e);
  });
}

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
  if (noteList) {
    noteList.forEach(note => {
      renderDiv(note);
    })
  }
}



// Event Listeners
navbar.newNote.addEventListener('click', function (e) {
  e.preventDefault();
  addNote();
  renderNoteList();
})

/*function updateNote() {
  let selectedNote = {
    id: Date.now(),
    content: quill.getContents(),
    title: quill.getText(0, 20),
    }
}
*/

document.querySelector('#formAddButton').addEventListener('click', function (e) {
  e.preventDefault();
  console.log(selectedNote);

  selectedNote.content = quill.getContents();
  selectedNote.title = quill.getText(0, 20);



  saveNotes();
  document.querySelector("#notes").innerHTML = "";
  noteList.forEach(note => {
    renderDiv(note);
  })
  //quill.setContents(selectedNote.content); // detta laddar editor
  //quill.getText();
  //renderNoteList();
})

/*quill.getContents(selectedNote.content);
quill.getText(selectedNote.title);
quill.setContent(selectedNote.content);
quill.getText(selectedNote.title);*/


// utgå ifrån att selectedNote innehåller noten som för tillfället ändras
// titta på hur addnote ser ut
// ändra selectedNote så att innehållet från editorn i nuläget hamnar i selectedNote, glöm inte title!
// när detta funkar (verifiera med en console.log(selectedNote))
// anropa saveNotes()
/*

  document.getElementById("fname").onchange = function()
  {myFunction()};
function myFunction() {
  var x = document.getElementById("fname");
  x.value = x.value.toUpperCase();
}

  selectedNote = noteList.find(note => note.id === noteID)
    quill.setContents(selectedNote.content);
    quill.setText(selectedNote.title);

    form.color.value = selectedNote.color;



  function addNote() {
  let note = {
    id: Date.now(),
    content: quill.getContents(),
    title: quill.getText(0, 20),
    favourite: false,
    color: form.color.value
  }

  if (!noteList) {
    noteList = [];
  }
  noteList.unshift(note);
  saveNotes();
  quill.setText('');
}
    */


/*
navbar.favorite.addEventListener('click', function () {
})

navbar.newNote.addEventListener('click', function () {
})
*/