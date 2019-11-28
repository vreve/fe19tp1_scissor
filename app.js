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
var fonts = ['sans-serif', 'courier', 'impact', 'serif'];
var Font = Quill.import('formats/font');
Font.whitelist = ['sans-serif', 'courier', 'impact', 'serif'];
Quill.register(Font, true);

let quill = new Quill('#editor', {
  modules: {
    toolbar: [
      [{ 'font': ['sans-serif', 'courier', 'impact', 'serif'] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      [{ 'align': [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ['image', 'code-block'],
      ['clean'],
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
form.editnote = document.querySelector('#editor');
form.saveBtn = document.querySelector('#saveBtn');
form.color = document.querySelector('#formColor');
form.showAllNotes = document.querySelector('#showAllNotes');
form.showAllNotes = document.querySelector('#sideShowAllNotes');

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

  document.querySelector(".ql-editor").contentEditable = true

  noteList.unshift(note);
  saveNotes();
  selectedNote = noteList.find(n => n.id === note.id)
  console.log(selectedNote)
  //selectedNote = noteList[0];
  quill.setText('');
  //quill.focus();
}

function selectNote(noteID) {
  console.log(selectedNote)

  selectedNote = noteList.find(note => note.id === noteID)
  quill.setContents(selectedNote.content);
  //quill.setText(selectedNote.title);
  document.querySelector(".ql-editor").contentEditable = true;
  quill.focus();
  form.color.value = selectedNote.color;
}


function renderDiv(note) {
  let noteDivs = document.querySelector("#notes");
  let myDiv = document.createElement('div');
  let deleteButton = document.createElement('span');
  /*   let newDeleteButton = document.createElement('i');
    newDeleteButton.classList.add("fa");
    newDeleteButton.classList.add("fa-trash");
    newDeleteButton.classList.add('note-delete'); */
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


  favBtn.classList.add('favBtn');
  if (note.favourite) {
    favBtn.classList.add("favRed");

  } else {
    //favBtn.classList.add('favBtn');
  };

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
  let noteToUpdate = noteList.find(note => note.id === selectedNote.id)
  console.log(noteToUpdate);

  noteToUpdate.content = quill.getContents();
  noteToUpdate.title = quill.getText(0, 20);
  console.log(noteToUpdate);
  selectedNote = noteToUpdate


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
  document.querySelector(".ql-editor").contentEditable = false;
}

// Event Listeners
document.querySelector('#newNote').addEventListener('click', function (e) {
  e.preventDefault();
  addNote();
  renderNoteList();
  document.querySelector(".ql-editor").contentEditable = true;
  quill.focus();
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

var btnBack = document.getElementById('btnBack');
var lastThree;
btnBack.addEventListener('click', function () {
  lastThree = document.querySelector("#darkmode").href.substr(document.querySelector("#darkmode").href.length - 3); // => "tml(ej aktivt" || "css(aktivt)"
  console.log(lastThree)
  // om dark mode icke är aktivt sätt det till aktivt annars sätt det till icke aktivt
  if (lastThree !== "css") {
    document.querySelector("#darkmode").href = "darkmode.css";
  } else {
    document.querySelector("#darkmode").href = "";
  }
});

var btnBack2 = document.getElementById('sideBtnBack');
//var lastThree;
btnBack2.addEventListener('click', function () {
  lastThree = document.querySelector("#darkmode").href.substr(document.querySelector("#darkmode").href.length - 3); // => "tml(ej aktivt" || "css(aktivt)"
  console.log(lastThree)
  // om dark mode icke är aktivt sätt det till aktivt annars sätt det till icke aktivt
  if (lastThree !== "css") {
    document.querySelector("#darkmode").href = "darkmode.css";
  } else {
    document.querySelector("#darkmode").href = "";
  }
});




function openNav() {
  //document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("mySidenav").classList.add("expanded")
}

function closeNav() {
  //document.getElementById("mySidenav").style.width = "0";
  document.getElementById("mySidenav").classList.remove("expanded")
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









document.querySelector('#showAllNotes').addEventListener('click', function (e) {
  e.preventDefault();
  renderNoteList();
})

document.querySelector('#sideShowAllNotes').addEventListener('click', function (e) {
  e.preventDefault();
  document.querySelector("#box").classList.toggle("boxExpanded")
  renderNoteList();
})




