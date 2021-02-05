'use strict'


let message = document.querySelector('.message');
let btnCreateNote = document.getElementById('btnId');
let topIndent = -360;
let container = document.getElementById('containerId');
let notesArray = localStorage.getItem('notesInStorage') ?
  JSON.parse(localStorage.getItem('notesInStorage')) : [];
let countNotes = notesArray.length;
let btnClearStor = document.querySelector('.clear__stor__btn');

function createNote() {
  topIndent += 410;
  let noteClass = `note${countNotes}`; 
  countNotes++;
  let note = document.createElement('div');
  note.classList.add('note');
  note.classList.add(noteClass);
  note.innerHTML = 
  `
  <div class="note__header">
    <div class="time"></div>
    <div class="check-pen"><i class="fas fa-check"></i></i></div>
    <div class="bucket"><i data-trash class="fas fa-trash-alt"></i></div>
  </div>
  <textarea class="textarea"></textarea>
  `;
  note.style.top = topIndent + 'px';
  container.append(note);
  setCurrTime(noteClass);
  notesArray.push(note.innerHTML);
  localStorage.setItem('notesInStorage', JSON.stringify(notesArray));
}

function setCurrTime(noteClass) {
  let timeSelector = `.${noteClass} .time`;

  let now = new Date();
  let month = '';
  let date = now.getDate();
  let hours = now.getHours();
  if (hours < 10) {
    hours = '0' + hours;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  let seconds = now.getSeconds();
  if (seconds < 10) {seconds = '0' + seconds;}
  let timeDiv = document.querySelector(timeSelector);
  switch (now.getMonth()) {
    case 0:
      month = 'January';
      break;
    case 1:
      month = 'February';
      break;
    case 2:
      month = 'March';
      break;
    case 3:
      month = 'April';
      break;
    case 4:
      month = 'May';
      break;
    case 5:
      month = 'June';
      break;
    case 6:
      month = 'July';
      break;
    case 7:
      month = 'Augast';
      break;
    case 8:
      month = 'September';
      break;
    case 9:
      month = 'October';
      break;
    case 10:
      month = 'November';
      break;
    case 11:
      month = 'December';
      break;
  }
  
  let timeStr = month + ' ' + date + ', ' + hours + ':' + minutes + ':' + seconds;
  timeDiv.textContent = timeStr;
}

function saveText(event) {
  if (event.target.className === 'textarea') {
    let textarea = event.target;
    textarea.innerHTML = textarea.value;
    let noteNumb = +textarea.closest('.note').classList[1].slice(-1);
    notesArray[noteNumb] = textarea.closest('.note').innerHTML;
    localStorage.setItem('notesInStorage', JSON.stringify(notesArray));
  }
}

function showPen(event) {
  if (event.target.className === 'textarea') {
    let noteNumb = +event.target.closest('.note').classList[1].slice(-1);
    let checkPen = document.querySelector(`.note${noteNumb} .check-pen`);
    checkPen.innerHTML = `<i class="fas fa-pen"></i>`;
  }
}

function showCheck(event) {
  if (event.target.className === 'textarea') {
    let noteNumb = +event.target.closest('.note').classList[1].slice(-1);
    let checkPen = document.querySelector(`.note${noteNumb} .check-pen`);
    checkPen.innerHTML = `<i class="fas fa-check"></i>`;
  }
}

function delNote(event) {
  if (event.target.dataset.trash != undefined) {
    let bucket = event.target;
    let noteNumb = +bucket.closest('.note').classList[1].slice(-1);
    bucket.closest('.note').remove();
    notesArray.splice(noteNumb, 1);
    reDisplayNotes();
    localStorage.setItem('notesInStorage', JSON.stringify(notesArray));
  }
}

function reDisplayNotes() {
  let i = 0;
  countNotes--;
  topIndent = -360;
  for (let note of document.querySelectorAll('.note')) {
    topIndent += 410;
    note.style.top = topIndent + 'px';
    note.className = `note note${i}`;
    i++;
  }
}

function initDispFromStor() {
  if (notesArray.length) {
    notesArray.forEach((item, index) => {
      let note = document.createElement('div');
      note.innerHTML = item;
      note.classList.add('note');
      note.classList.add(`note${index}`);
      let checkPen = note.querySelector('.check-pen');
      checkPen.innerHTML = `<i class="fas fa-check"></i>`;
      topIndent += 410;
      note.style.top = topIndent + 'px';
      container.append(note);
    });
  }
}

function showMessage(event) {
  if (event.target.dataset.btn != undefined)  {
    switch (event.target.dataset.btn) {
      case 'Очистить память':
        if (document.documentElement.clientWidth < 630) {
          message.classList.add('small');
          message.style.left = btnClearStor.offsetLeft - 58 + btnClearStor.offsetWidth + 'px';
        } else {
          message.style.left = btnClearStor.offsetLeft - 120 + btnClearStor.offsetWidth + 'px';
        }
        message.style.top = btnClearStor.offsetTop + 10 + btnClearStor.offsetHeight + 'px';
        message.innerHTML = event.target.dataset.btn;
        message.style.display = 'block';
        break;
      case 'Создать новую заметку':
        if (document.documentElement.clientWidth < 630) {
          message.classList.add('small');
          message.style.left = btnCreateNote.offsetLeft - 85 + btnCreateNote.offsetWidth + 'px';
        } else {
          message.style.left = btnCreateNote.offsetLeft - 120 + btnCreateNote.offsetWidth + 'px';
        }
        message.style.top = btnCreateNote.offsetTop + 10 + btnCreateNote.offsetHeight + 'px';
        message.innerHTML = event.target.dataset.btn;
        message.style.display = 'block';
        break;
    }
  }
}

function hideMessage(event) {
  if (event.target.dataset.btn != undefined)  {
    switch (event.target.dataset.btn) {
      case 'Очистить память':
        message.classList.remove('small');
        message.style.display = 'none';
        break;
      case 'Создать новую заметку':
        message.classList.remove('small');
        message.style.display = 'none';
        break;
    }
  }
}

document.addEventListener('mouseover', showMessage);
document.addEventListener('mouseout', hideMessage);
btnCreateNote.addEventListener('click', createNote);

initDispFromStor();

btnClearStor.addEventListener('click', () => localStorage.clear());
document.addEventListener('input', saveText);
document.addEventListener('focusin', showPen);
document.addEventListener('focusout', showCheck);
document.addEventListener('click', delNote);
