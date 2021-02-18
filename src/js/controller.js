import * as model from "./model.js";
import recipeView from "./views/recipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

const recipeContainer = document.querySelector(".recipe");

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);
    if (!id) return;

    recipeView.renderSpinner(); //FIXME! svg loading need much time, you may not see it if the following data fetching is not slow enough.

    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Rending recipe
    recipeView.render(model.state.recipe); // ❓ 👌
    // const recipeView = new recipeView(model.state.recipe) 与上面的等价
  } catch (err) {
    alert(err);
  }
};

// Listen to hashchange
["hashchange", "load"].forEach((ev) =>
  window.addEventListener(ev, controlRecipes)
);
