var noteList = [];
var selectedNote = {};

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
form.saveBtn = document.querySelector('#saveBtn');
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
  console.log(selectedNote)
  // hitta en note i noteList vars ID stämmer överrens med argumentet id.
  // setcontents note.content
  selectedNote = noteList.find(note => note.id === noteID)
  quill.setContents(selectedNote.content);
  quill.setText(selectedNote.title);

  // form.color.value = selectedNote.color;
}


function renderDiv(note) {
  let noteDivs = document.querySelector("#notes");
  let myDiv = document.createElement('div');
  let deleteButton = document.createElement('span');

  let favBtn = document.createElement('button');

  myDiv.classList.add('note');
  myDiv.classList.add(note.color);
  myDiv.id = note.id;

  myDiv.innerHTML = `${note.title} ${new Date(note.id).toLocaleDateString()} ${new Date(note.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  myDiv.addEventListener("click", () => selectNote(note.id));

  deleteButton.classList.add('note-delete');
  deleteButton.innerHTML = '&times;';

  favBtn.classList.add('favBtn');
  favBtn.innerHTML = '&times;';

  noteDivs.appendChild(myDiv);
  myDiv.appendChild(deleteButton);

  myDiv.appendChild(favBtn);

  form.editnote.value === "";
  form.editnote.focus();

  addListenerDeleteButton(deleteButton);
  addListenerfavBtn(favBtn);
}

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

function addListenerfavBtn(favBtn) {
  favBtn.addEventListener('click', function (e) {
    e.preventDefault();
    console.log(selectedNote)

    if (selectedNote.favourite === false) {
      return selectedNote.favourite = true;

    } else if (selectedNote.favourite === true) {
      return selectedNote.favourite = false;

    }

  })
  localStorage.setItem('notes', JSON.stringify(noteList))

}




document.querySelector('#saveBtn').addEventListener('click', function (e) {
  e.preventDefault();
  console.log(selectedNote);

  selectedNote.content = quill.getContents();
  selectedNote.title = quill.getText(0, 20);

  saveNotes();
  document.querySelector("#notes").innerHTML = "";
  noteList.forEach(note => {
    renderDiv(note);
  })
})



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


document.querySelector('#saveBtn').addEventListener('click', function (e) {
  e.preventDefault();
  console.log(selectedNote);

  selectedNote.content = quill.getContents();
  selectedNote.title = quill.getText(0, 20);

  saveNotes();
  document.querySelector("#notes").innerHTML = "";
  noteList.forEach(note => {
    renderDiv(note);
  })
})


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
const showFavourites = (note) => note.favourite === true;
const showDeleted = (note) => note.deleted === true;

function filterNotes(func = () => true) {
  //console.log(func(1));
  let filtered = noteList.filter(func)
  return filtered;
}

function showOnlyFavs(showFavourites) {
  let notes = document.querySelector('#notes');
  notes.innerHTML = "";

  let onlyFavs = filterNotes();
  onlyFavs.forEach(function (note) {
    renderDiv(note);
  })
}

function printout() {
  var newWindow = window.open();
  newWindow.document.write(document.getElementById('editor-container').innerHTML);
  newWindow.print();
}


/*

function printout() {
 var newWindow = window.open();
 newWindow.document.write(document.getElementById('editor-container').innerHTML);
 newWindow.print();
}


function printContent (el) {
 var restorepage = document.body.innerHTML;
 var printconent = document.getElementById(editor-container).innerHTML;
 document.body.innerHTML = printconent;
 window.print();
}


document.getElementById("printBtn").addEventListener("click", function () {
  var printContents = document.getElementById('editor-container').innerHTML;
  var originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
});


*/