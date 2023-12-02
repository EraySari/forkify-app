import View from './View';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No recipe found for your query. Please try again';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join(''); // renderden string olarak dönmesi gerek. Am o her birini eklemeye calisiyordu previewView.renderde. O yüzden renderde kontrol yaptik
  }
}

export default new BookmarksView();
