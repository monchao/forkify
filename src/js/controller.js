import * as model from "./model.js";
import { MODAL_CLOSE_SEC, FORM_REST_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

// parcel hot module reloading
// if (module.hot) {
// module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    // Get hash id ⭐
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner(); // ❗✅ svg loading need much time, you may not see it if the following data fetching is not slow enough.

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // debugger; //  ⭐
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Rending recipe
    recipeView.render(model.state.recipe); // ❓ 为何叫 render 与 constructor 有何不同? ✅ NOT constructor. A method with special meaning.
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

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlServings = function (newServings) {
  // 1) Update the recipe servings (in state)
  model.updateServings(newServings);

  // 2) Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlPagination = function (goToPage) {
  // Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render NEW pagination
  paginationView.render(model.state.search);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // 2) Update recipeView
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    console.log("uploaded recipe:", newRecipe);
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe); // ✅ need await here ❗
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmarksView
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL ⭐
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    // window.history.back()

    // Close form window automatically after seconds
    // MZ: The user cannot upload unless reloading the page. 🐞 Reset the default form content. ✅
    setTimeout(function () {
      addRecipeView.isHiddenWindow() ? "" : addRecipeView.toggleWindow(); // 🐞 : User may click the btnClose... ✅
      setTimeout(function () {
        addRecipeView.resetForm();
      }, FORM_REST_SEC * 1000);
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    /* handle error */
    console.log("💥", err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerBookmarks(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
