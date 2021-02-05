'use strict'

let sitesStructurebtn = document.getElementById('sitesStructurebtn');
let carouselTrack = document.querySelector('.carousel__track');
let carouselDotssBlock = document.querySelector('.carousel__dotsblock');
let carouselItems = document.querySelectorAll('.carousel__item');
let dotsBorders = document.querySelectorAll('.carousel__dotborder');
let activeSlideDot = 0;
let nav = document.querySelector('.nav');
let navItems = document.querySelectorAll('.nav__item');
let headerLinksBlock = document.querySelector('.header__links');
let headerLinks = document.querySelectorAll('.header__links span');

function highlightLink(event) {
  if (event.target.dataset.headerLink === undefined) {return}

  for (let i = 0; i < headerLinks.length; i++) {
    headerLinks[i].classList.remove('active');
  }

  event.target.classList.add('active');
}

function highlightNav(event) {
  if (event.target.dataset.navItem === undefined) {return}
  
  for (let i = 0; i < navItems.length; i++) {
    navItems[i].firstElementChild.classList.remove('active');
  }

  event.target.classList.add('active');
}

function dispLogContCorrect() {
  let logInputs = document.querySelectorAll('.log__input');
  let loginDiv = document.querySelector('.login');
  let openConBtn = document.querySelector('.login__openaccbtn');

  for (let input of logInputs) {
    input.style.left = loginDiv.offsetWidth / 2 - input.offsetWidth / 2 + 'px';
  }

  openConBtn.style.left = loginDiv.offsetWidth / 2 - openConBtn.offsetWidth / 2 + 'px';
}

function initSlideShow() {
  for (let i = 0; i < dotsBorders.length; i++) {
    dotsBorders[i].classList.remove('active');
  }
  
  for(let i = 0; i < carouselItems.length; i++) {
    carouselItems[i].style.display = 'none';
  }
  
  carouselItems[activeSlideDot].style.display = 'block';
  dotsBorders[activeSlideDot].classList.add('active');
}

function showSlides(event) {
  if (event.target.dataset.dot != undefined) {

    for (let i = 0; i < dotsBorders.length; i++) {
      dotsBorders[i].classList.remove('active');
    }

    for(let i = 0; i < carouselItems.length; i++) {
      carouselItems[i].style.display = 'none';
    }

    carouselItems[event.target.dataset.dot].style.display = 'block';
    dotsBorders[event.target.dataset.dot].classList.add('active');
  }
}

headerLinksBlock.addEventListener('click', highlightLink);
nav.addEventListener('click', highlightNav);
initSlideShow();
dispLogContCorrect();
carouselDotssBlock.addEventListener('click', showSlides);
