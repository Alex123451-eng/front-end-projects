'use strict'


let sliderFirst = document.querySelector('.slider.first');
let sliderSecond = document.querySelector('.slider.second');
let activeSlideDot = 1;
let buttonsBlock = document.querySelector('.buttons');
let leftButton = document.querySelector('.buttons__item.left');
let rightButton = document.querySelector('.buttons__item.right');
let gallery3 = document.querySelector('.gallery3');
let currentPhoto = null;
let gallery2 = document.querySelector('.gallery2');
let coords = null;

function initSlideShowBoth(activeSlideDot) {
  let slidesFirst = document.querySelectorAll('.slider__img.first');
  let dotsFirst = document.querySelectorAll('.slider__buttons--item.first');

  let thoughts = document.querySelectorAll('.thoughts');
  let slidesSecond = document.querySelectorAll('.slider__img.second');
  let dotsSecond = document.querySelectorAll('.slider__buttons--item.second'); 

  for (let i = 0; i < 4; i++) {
    slidesFirst[i].style.display = 'none';
    dotsFirst[i].classList.remove('slider__buttons--item_active');
    slidesSecond[i].style.display = 'none';
    thoughts[i].style.display = 'none';
    dotsSecond[i].classList.remove('slider__buttons--item_active'); 
  }

  slidesFirst[activeSlideDot].style.display = 'block';
  dotsFirst[activeSlideDot].classList.add('slider__buttons--item_active');
  slidesSecond[activeSlideDot].style.display = 'block';
  thoughts[activeSlideDot].style.display = 'block';
  dotsSecond[activeSlideDot].classList.add('slider__buttons--item_active');
}

function showSlidesSliderFirst(event) {
  if (event.target.classList[0] != 'slider__buttons--item') return;

  let slides = document.querySelectorAll('.slider__img.first');
  let dots = document.querySelectorAll('.slider__buttons--item.first');

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
    dots[i].classList.remove('slider__buttons--item_active');
  }

  slides[event.target.dataset.dot].style.display = 'block';
  dots[event.target.dataset.dot].classList.add('slider__buttons--item_active');
}

function showSlidesSliderSecond(event) {
  if (event.target.classList[0] != 'slider__buttons--item') return;

  let slides = document.querySelectorAll('.slider__img.second');
  let dots = document.querySelectorAll('.slider__buttons--item.second');
  let thoughts = document.querySelectorAll('.thoughts');

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
    dots[i].classList.remove('slider__buttons--item_active');
    thoughts[i].style.display = 'none';
  }

  slides[event.target.dataset.dot].style.display = 'block';
  dots[event.target.dataset.dot].classList.add('slider__buttons--item_active');
  thoughts[event.target.dataset.dot].style.display = 'block';

  leftButton.style.backgroundColor = '#71f6eb';
  rightButton.style.backgroundColor = '#71f6eb';
  leftButton.removeAttribute('disabled');
  rightButton.removeAttribute('disabled');

  if (event.target.dataset.dot == 0) {
    leftButton.style.backgroundColor = '#ffffff';
    leftButton.setAttribute('disabled', true);
  }

  if (event.target.dataset.dot == 3) {
    rightButton.style.backgroundColor = '#ffffff';
    rightButton.setAttribute('disabled', true);
  }
}

function sliderSecondArrows(event) {
  if (event.target.classList[0] != 'buttons__item') return;

  let slides = document.querySelectorAll('.slider__img.second');
  let dots = document.querySelectorAll('.slider__buttons--item.second');
  let thoughts = document.querySelectorAll('.thoughts');
  let activeDot = document.querySelector('.second.slider__buttons--item_active');

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
    dots[i].classList.remove('slider__buttons--item_active');
    thoughts[i].style.display = 'none';
  }

  if (event.target.classList[1] == 'left') {
    slides[activeDot.dataset.dot - 1].style.display = 'block';
    dots[activeDot.dataset.dot - 1].classList.add('slider__buttons--item_active');
    thoughts[activeDot.dataset.dot - 1].style.display = 'block'; 
  }

  if (event.target.classList[1] == 'right') {
    slides[+activeDot.dataset.dot + 1].style.display = 'block';
    dots[+activeDot.dataset.dot + 1].classList.add('slider__buttons--item_active');
    thoughts[+activeDot.dataset.dot + 1].style.display = 'block'; 
  }

  activeDot = document.querySelector('.second.slider__buttons--item_active');

  leftButton.style.backgroundColor = '#71f6eb';
  rightButton.style.backgroundColor = '#71f6eb';
  leftButton.removeAttribute('disabled');
  rightButton.removeAttribute('disabled');

  if (activeDot.dataset.dot == 0) {
    leftButton.style.backgroundColor = '#ffffff';
    leftButton.setAttribute('disabled', true);
  }

  if (activeDot.dataset.dot == 3) {
    rightButton.style.backgroundColor = '#ffffff';
    rightButton.setAttribute('disabled', true);
  }

}

function showPersonInfoHover(event) {
  if (event.target.classList[0] != 'gallery__image3') return;

  currentPhoto = event.target.closest('.gallery__item3');

  event.target.nextElementSibling.classList.add('active');
}

function hidePersonInfoHover(event) {
  if (event.target.classList[0] != 'gallery__image3') return;
  
  if (event.relatedTarget.closest('.gallery__item3') === currentPhoto) return;

  event.target.nextElementSibling.classList.remove('active');
  currentPhoto = null;
}

function showMessage(event) {
  if (event.target.alt != 'arrow') return;

  let defaultMes = event.target.closest('.gallery2__item--default');
  defaultMes.nextElementSibling.classList.add('true');
}

function hideMessage(event) {
  if (event.target.classList[0] != 'gallery2__item--active__cross') return;

  let activeMes = event.target.closest('.gallery2__item--active');
  activeMes.classList.remove('true');
}

initSlideShowBoth(activeSlideDot);

sliderFirst.addEventListener('click', showSlidesSliderFirst);

gallery2.addEventListener('click', showMessage);
gallery2.addEventListener('click', hideMessage);

gallery3.addEventListener('mouseover', showPersonInfoHover);
gallery3.addEventListener('mouseout', hidePersonInfoHover);

sliderSecond.addEventListener('click', showSlidesSliderSecond);
buttonsBlock.addEventListener('click', sliderSecondArrows);