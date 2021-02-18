import { async } from "regenerator-runtime";
import { API_URL } from "./config.js";

import { getJSON } from "./helper.js";

export const state = {
  recipe: {},
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      ingredients: recipe.ingredients,
      imgUrl: recipe.image_url,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
    };

    console.log(recipe);
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥💥💥💥 `);
    throw err; // NOTE: the flow of Error
  }
};
