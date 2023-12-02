import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  renderSpinner = function () {
    const add = `<div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', add);
    console.log(icons);
  };

  //render data alip generetaMarkup ile page'e ekleme yapiyor
  /**
   *
   * @param {Object | Object[]} data The data to be rendered
   * @param {boolean} [render = true] If false, create markup string instead of rendering to the DOM
   * @returns
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length == 0))
      return this.renderError();

    this._data = data; // buradaki data, data.recipe den geliyor.(Controller araciligiyla)
    if (this._parentElement !== '') this._clear();
    const markup = this._generateMarkup(); //string döndürüyo (eklencek kodu)

    if (!render) return markup; //results ve bookmarksView de her döngüde eklememsi icin kontrol ediyoruz

    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  update(data) {
    //sanal DOM olusturup asil domla karsilasitiryoruz ve farkli olanlari asil domda degistiriyoruz
    this._data = data;

    const newMarkup = this._generateMarkup();

    //Verilen texti DOM'a cevirir.Böylece asil Dom ile karsilastirip farklarini(güncellenen) bulabiliriz
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*')); //new DOM
    const curElements = Array.from(this._parentElement.querySelectorAll('*')); //ana DOM

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //console.log(curEl, newEl.isEqualNode(curEl));

      //Degisim olan node lari guncelleme
      if (
        !newEl.isEqualNode(curEl) && //Eger text kismi da degismisse orayi guncellyoruz
        curEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderError(message = this._errorMessage) {
    const errorMessage = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', errorMessage);
  }

  renderMessage() {
    const message = `<div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${this._message}</p>
  </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', message);
  }
}
