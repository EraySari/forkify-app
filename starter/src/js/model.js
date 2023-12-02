import { async } from 'regenerator-runtime';
import { API_URL, KEY, RES_PER_PAGE } from './config';

import { AJAX } from './helpers';
import { entries } from 'core-js/./es/array';
import recipeView from './view/recipeView';

export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: 1,
    resultPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const addStateRecipe = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    publisher: recipe.publisher,
    title: recipe.title,
    imageUrl: recipe.image_url,
    cookingTime: recipe.cooking_time,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = addStateRecipe(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.page = 1;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.query = query;
    state.search.result = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        key: rec.key,
        publisher: rec.publisher,
        title: rec.title,
        image: rec.image_url,
      };
    });
  } catch (err) {
    throw err;
  }
};

export const parsistBookmarks = function () {
  //her eklemede veya delete isleminde cagrilacak - localstorage guncellemes
  //Add bookmarks to localstorage
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);
  console.log(recipe);
  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  parsistBookmarks();
  console.log(localStorage.bookmarks);
};
export const deleteBookmark = function (id) {
  //Add bookmark
  const index = state.bookmarks.findIndex(recipe => recipe.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  parsistBookmarks();
};

export const getSearchResultsPage = function (page = state.search.page) {
  let start = (page - 1) * RES_PER_PAGE;
  let end = page * RES_PER_PAGE;

  state.search.page = page;

  return state.search.result.slice(start, end);
};

export const updateServing = function (servings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * servings) / state.recipe.servings;
  });

  state.recipe.servings = servings;
};

//localden veriler aliniyor sonra veriler state.bookmarks dizisine atiyor controllerde sayfa yuklenirken bookmarks dizisinden veriler alinip viewe yaziliyor
const init = function () {
  const storage = localStorage.getItem('bookmarks'); //localden veri aliniyor
  if (storage) state.bookmarks = JSON.parse(storage); //veri varsa bookmarks dizisine ataniyor
}; // bu islem sayfa yüklendirken basta yapiliyor

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

//clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredients format. Please use the correct format :)'
          );
        const [quantity, unit, description] = ingArr;

        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe); //girilen recip i apiye upload etme
    state.recipe = addStateRecipe(data);
    addBookmark(state.recipe);
    console.log(state.recipe);
  } catch (error) {
    throw error;
  }
};
