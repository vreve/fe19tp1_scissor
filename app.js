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
})
//}, 5 * 1000);

// Check for unsaved data
window.onbeforeunload = function () {
  if (change.length() > 0) {
    return 'There are unsaved changes. Are you sure you want to leave?';
  }
}

const navbar = {}
navbar.newNote = document.querySelector('#newNote');
navbar.favorite = document.querySelector('#bigFavBtn');

const sidenav = {}
sidenav.newNote = document.querySelector('#sideNewNote');
sidenav.favorite = document.querySelector('#sideBigFavBtn');

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

  selectedNote = noteList.find(note => note.id === noteID)
  quill.setContents(selectedNote.content);

  form.color.value = selectedNote.color;
}


function renderDiv(note) {
  let noteDivs = document.querySelector("#notes");
  let myDiv = document.createElement('div');
  let deleteButton = document.createElement('span');

  let favBtn = document.createElement('button');

  myDiv.classList.add('note');
  myDiv.classList.add(note.color);
  myDiv.id = note.id;

  let noteTitle;
  if (note.title.length > 10) {
    noteTitle = note.title.substring(0, 10) + "..."
  } else {
    noteTitle = note.title;
  }

  myDiv.innerHTML = `${noteTitle} ${new Date(note.id).toLocaleDateString()} ${new Date(note.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  myDiv.addEventListener("click", () => selectNote(note.id));




  deleteButton.classList.add('note-delete');
  deleteButton.innerHTML = '&times;';

  favBtn.classList.add('favBtn');
  favBtn.innerHTML = 'Fav';
  if (note.favourite) {
    favBtn.classList.add("favRed");
  } else {
    favBtn.innerHTML = 'Fav';
  }

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
    let noteID = e.target.closest("div").id;
    selectedNote = noteList.find(note => note.id === Number(noteID))
    console.log(selectedNote)
    if (selectedNote.favourite) {
      e.target.classList.remove("favRed");
    } else {
      favBtn.classList.add("favRed");
    }
    selectedNote.favourite = !selectedNote.favourite;
    saveNotes()
  })
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
sidenav.newNote.addEventListener('click', function (e) {
  e.preventDefault();
  addNote();
  renderNoteList();
})


document.querySelector('#saveBtn').addEventListener('click', function (e) {
  e.preventDefault();
  //console.log(selectedNote);

  selectedNote.content = quill.getContents();
  selectedNote.title = quill.getText(0, 20);

  saveNotes();
  document.querySelector("#notes").innerHTML = "";
  noteList.forEach(note => {
    renderDiv(note);
  })
})


const showFavourites = (note) => note.favourite === true;
const showDeleted = (note) => note.deleted === true;

document.querySelector('#bigFavBtn').addEventListener('click', function (e) {
  console.log('favvis');
  filterNotes();
  showOnlyFavs();
})
document.querySelector('#sideBigFavBtn').addEventListener('click', function (e) {
  console.log('favvis');
  filterNotes();
  showOnlyFavs();
})

function filterNotes(func = () => true) {
  //console.log(func(1));
  let filtered = noteList.filter(func)
  return filtered;
}

function showOnlyFavs() {
  let notes = document.querySelector('#notes');
  notes.innerHTML = "";

  let onlyFavs = filterNotes(showFavourites);
  onlyFavs.forEach(function (note) {
    renderDiv(note);
  })
}

function printout() {
  let myDiv = document.createElement("div")
  myDiv.classList.add("showMe")
  myDiv.innerHTML = document.querySelector(".ql-editor").innerHTML;
  document.body.appendChild(myDiv)
  window.print();
}







// kod för att se om dark mode är aktivt:
// var lastThree = document.querySelector("#darkmode").href.substr(document.querySelector("#darkmode").href.length - 3); // => "Tabs1"
// lastThree == "tml" betyder ej aktivt, == "css" betyder aktivt
// kod för at aktivera dark mode:
// document.querySelector("#darkmode").href="darkmode.css"

// deaktivera:
// document.querySelector("#darkmode").href=""



var btnBack = document.getElementById('btnBack');
var lastThree;
btnBack.addEventListener('click', function () {
  lastThree = document.querySelector("#darkmode").href.substr(document.querySelector("#darkmode").href.length - 3); // => "tml(ej aktivt" || "css(aktivt)"
  console.log(lastThree)
  // om dark mode icke är aktivt sätt det till aktivt annars sätt det till icke aktivt
  if (lastThree == "tml") {
    document.querySelector("#darkmode").href = "darkmode.css";
  } else {
    document.querySelector("#darkmode").href = "";
  }
});

var btnBack = document.getElementById('sideBtnBack');
var lastThree;
btnBack.addEventListener('click', function () {
  lastThree = document.querySelector("#darkmode").href.substr(document.querySelector("#darkmode").href.length - 3); // => "tml(ej aktivt" || "css(aktivt)"
  console.log(lastThree)
  // om dark mode icke är aktivt sätt det till aktivt annars sätt det till icke aktivt
  if (lastThree == "tml") {
    document.querySelector("#darkmode").href = "darkmode.css";
  } else {
    document.querySelector("#darkmode").href = "";
  }
});




function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}





// function searchFunc() {
//   var input, filter, ul, li, a, i, txtValue;
//   input = document.getElementById('search');
//   filter = input.value.toUpperCase('#search');
//   ul = document.getElementById("div");
//   li = ul.getElementsByTagName('title');

//   for (i = 0; i < li.length; i++) {
//     a = ul[i].getElementsByTagName("div")[0];
//     txtValue = a.textContent || a.innerText;
//     if (txtValue.toUpperCase().indexOf(filter) > -1) {
//       ul[i].style.display = "";
//     } else {
//       ul[i].style.display = "none";
//     }
//   }
// }













