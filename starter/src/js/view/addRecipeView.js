import View from './View';
import icons from 'url:../../img/icons.svg';
import { MODAL_CLOSE_SEC } from '../config';

class addRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe added successfully :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this.addHandlerShowWindow();
    this.addHandlerHiddenWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  addHandlerHiddenWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      const arrData = [...new FormData(this)]; //formdan verileri alma dizi seklinde
      const data = Object.fromEntries(arrData); //objeye cevirme

      handler(data);
    });
  }
  closeWindow() {
    setTimeout(this.toggleWindow.bind(this), MODAL_CLOSE_SEC * 1000);
  }
}

export default new addRecipeView();
