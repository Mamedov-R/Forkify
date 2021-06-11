import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
//import { async } from 'regenerator-runtime';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //1)Loading the recipe
    await model.loadRecipe(id);

    //2)Rendering the recipe
    recipeView.render(model.state.recipe);

    //TEST
    controlServings();
  } catch (err) {
    recipeView.renderError();
    console.log(err);
    // recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1)Get search query
    const query = searchView.getQuery();
    //console.log(query);
    if (!query) return;

    //2)load search results
    await model.loadSearchResults(query);

    //3)Render results
    resultsView.render(model.getSearchResultsPage());
    // console.log(model.getSearchResultsPage());
    // resultsView.render(model.state.searc.results);

    //4)Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  //1)Render New results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // console.log(model.getSearchResultsPage());
  // resultsView.render(model.state.searc.results);

  //2)Render New pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);

  //Update the recipe view
  recipeView.render(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
