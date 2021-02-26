import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner(); // ❗ 👌 svg loading need much time, you may not see it if the following data fetching is not slow enough.

    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Rending recipe
    recipeView.render(model.state.recipe); // ❓ 👌 为何叫 render 与 constructor 有何不同？
    // const recipeView = new recipeView(model.state.recipe) 与上面的等价
  } catch (err) {
    console.error(err); // It helps to locate the error ❗
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Rending results
    console.log(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

init();
