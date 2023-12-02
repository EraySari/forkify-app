import * as model from './model.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarksView.js';
import addRecipeView from './view/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    //0 - Update recipe View to mark selected recipe and bookmark
    resultsView.update(model.getSearchResultsPage());

    //recipe in secili kalmamasi icin
    bookmarksView.update(model.state.bookmarks);

    //1-Loading Recipe
    await model.loadRecipe(id);

    //2-Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};
if (module.hot) {
  module.hot.accept;
}

const searchControlResult = async function () {
  try {
    // 1 - Get Search Query
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    // 2 - Load query (Modul side)
    await model.loadSearchResult(query); //Tüm sonuclcar state.search.resulta ataniyor

    // 3 - Render Results (resultView)
    resultsView.render(model.getSearchResultsPage()); // verilen indexler arasi kadarini page'e yazdiriyor

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    resultsView.renderError();
  }
};

const controlPagination = function (data) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(data));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServing = function (newServing) {
  //Update recipe
  model.updateServing(newServing); //quantity ve serving sayisi degisir

  //Update the recipe View
  //recipeView.render(model.state.recipe);
  //recipeView.update(model.state.recipe);
};

const addBookmarkControl = function () {
  //bookmark kismi
  //1 - Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  model.parsistBookmarks();

  //2 - Update Recipe view
  recipeView.update(model.state.recipe); //bookmarked degisimi oldugu icin update yapiliyor view icin

  //3- Render Bookmark
  bookmarksView.render(model.state.bookmarks); //bookmarks ayarlaniyor
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (data) {
  //console.log(data);
  try {
    // Upload the new recipe data
    await model.uploadRecipe(data);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //window.history.back(); sayfa otomatik olarak geri döndürülür

    //Added message
    addRecipeView.renderMessage();

    //Close form window
    addRecipeView.closeWindow();
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};
const newFeatures = function () {
  console.log('Welcome');
};
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.renderMessage();
  recipeView.addHandlerUpdateServings(controlServing);
  recipeView.addBookmarkAddHandler(addBookmarkControl);

  searchView.addHandler(searchControlResult);
  paginationView.addHandlerClick(controlPagination);
  bookmarksView.addHandlerRender(controlBookmarks);

  addRecipeView.addHandlerUpload(controlAddRecipe);

  newFeatures();
};
init(); // olayi controllerde tutuyoruz cunku islendigi yer burasi(controlRecipes)

// Display number of pages between the pagination buttons;
// Ability to sort search results by duration or number of ingredients;
// Perform ingredient validation in view, before submitting the form;
// Improve recipe ingredient input: separate in multiple fields and allow more than 6 ingredients;
// Shopping list feature: button on recipe to add ingredients to a list;
// Weekly meal planning feature: assign recipes to the next 7 days and show on a weekly calendar;
// Get nutrition data on each ingredient from spoonacular API (https://spoonacular.com/food-api) and calculate total calories of recipe
