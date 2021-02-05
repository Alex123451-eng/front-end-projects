'use strict'

let container = document.querySelector('.container');
let grid = document.querySelector('.grid');
let currTarg;
let checkSimilarArr = [];
let count = 0;
let timer = document.querySelector('.timer');
let winCheck = 0;

let arrEasy = [
  'gold', 'gold', 'teal', 'teal',
  'silver', 'silver', 'khaki', 'khaki',
  'red', 'red', 'ivory', 'ivory',
  'green', 'green', 'wheat', 'wheat'
];

let arrMedium = [
  'gold', 'gold', 'teal', 'teal', 'tan', 'tan',
  'silver', 'silver', 'khaki', 'khaki', 'violet' , 'violet',
  'red', 'red', 'ivory', 'ivory', 'aqua', 'aqua',
  'green', 'green', 'tomato', 'tomato', 'lime', 'lime'
]

let arrHard = [
  'gold', 'gold', 'teal', 'teal', 'tan', 'tan', 'coral', 'coral',
  'silver', 'silver', 'khaki', 'khaki', 'violet' , 'violet', 'salmon', 'salmon',
  'red', 'red', 'ivory', 'ivory', 'aqua', 'aqua', 'linen', 'linen', 
  'green', 'green', 'tomato', 'tomato', 'lime', 'lime', 'olive', 'olive',
];


let difficulty = prompt(`Type in preferred difficulty
 (easy, medium, hard) or just do any action to play medium`, '');

function setGameDiff(difficulty) {
  switch(difficulty) {
    case 'easy':
      grid.classList.add(difficulty);
      winCheck = 16;
      easy();
      timerFunc(150);
      break;
    case 'medium':
      grid.classList.add(difficulty);
      winCheck = 24;
      medium();
      timerFunc(250);
      break;
    case 'hard':
      grid.classList.add(difficulty);
      winCheck = 32;
      hard();
      timerFunc(400);
      break;
    default:
      grid.classList.add('medium');
      winCheck = 24;
      medium();
      timerFunc(250);
      break;
  }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

function easy() {
  let arrEasyCopy = arrEasy.slice();
  for (let i = 0; i < 16; i++) {
    let flipContainer = document.createElement('div');

    let numb = getRandomIntInclusive(0, arrEasyCopy.length - 1)
    let data = arrEasyCopy[numb];
    arrEasyCopy.splice(numb, 1);

    flipContainer.classList = `flip-container ${data}`;

    flipContainer.innerHTML = 
    `
    <div class="flipper">
      <div class="front"></div>
      <div class="back" style="background-color: ${data}">
        <div>${data}</div>
      </div>
    </div>
    `;

    grid.append(flipContainer);
  }
}

function medium() {
  let arrMediumCopy = arrMedium;
  for (let i = 0; i < 24; i++) {
    let flipContainer = document.createElement('div');

    let numb = getRandomIntInclusive(0, arrMediumCopy.length - 1)
    let data = arrMediumCopy[numb];
    arrMediumCopy.splice(numb, 1);

    flipContainer.classList = `flip-container ${data}`;

    flipContainer.innerHTML = 
    `
    <div class="flipper">
      <div class="front"></div>
      <div class="back" style="background-color: ${data}">
        <div>${data}</div>
      </div>
    </div>
    `;

    grid.append(flipContainer);
  }
}

function hard() {
  let arrHardCopy = arrHard;
  for (let i = 0; i < 32; i++) {
    let flipContainer = document.createElement('div');

    let numb = getRandomIntInclusive(0, arrHardCopy.length - 1)
    let data = arrHardCopy[numb];
    arrHardCopy.splice(numb, 1);

    flipContainer.classList = `flip-container ${data}`;

    flipContainer.innerHTML = 
    `
    <div class="flipper">
      <div class="front"></div>
      <div class="back" style="background-color: ${data}">
        <div>${data}</div>
      </div>
    </div>
    `;

    grid.append(flipContainer);
  }
}

function rollOver(event) {
  if (event.target.classList[0] == 'grid'
  || event.target.closest('.back')
  || event.target.classList[0] == 'flip-container') return;

  let target = event.target.closest('.flipper');
  target.style.transform = 'rotateY(180deg)';
  let card = event.target.closest('.flip-container').classList[1];
  checkSimilar(card);
}

function checkSimilar(card) {
  count++;
  if (!checkSimilarArr.includes(card) && checkSimilarArr.length && count % 2 == 0) {
    let allCards = document.querySelectorAll('.flip-container .flipper');
    setTimeout(() => {
      for (let i = 0; i < allCards.length; i++) {
        allCards[i].style.transform = 'rotate(0deg)';
      }
      checkSimilarArr.length = 0;
      count = 0;
    }, 1000)
  }
  checkSimilarArr.push(card);
  if (count == winCheck) {
    setTimeout(() => {
      alert('You have won!');

      let answer = confirm('Do you wanna try again?)');
    
      if (answer) {
        location.reload();
      }

      timer.innerHTML = '';
      timer.style.display = 'none';
      grid.style.display = 'none';
    }, 1000);
  }
}

function timerFunc(timeLeft) {
  let time =  1000 * timeLeft;

  timer.innerHTML = `${timeLeft}`;
  timeLeft--;

  let timerId = setInterval(() => {
    timer.innerHTML = `${timeLeft}`;
    timeLeft--;
    
    if (count == 16) {
      clearInterval(timerId);
      clearTimeout(timerId2);

      timerId = null;
      timerId2 = null;

      timer.innerHTML = '';
      timer.style.display = 'none';
    }

  }, 1000);

  let timerId2 = setTimeout(() => {
    clearInterval(timerId);
    timerId = null;

    alert('You have lost!');
    let answer = confirm('Do you wanna try again?)');

    if (answer) {
      location.reload();
    }

    timer.innerHTML = '';
    timer.style.display = 'none';
    grid.style.display = 'none';
  }, time);

}

setGameDiff(difficulty);

grid.addEventListener('click', rollOver);