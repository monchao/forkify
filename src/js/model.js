import { API_URL, RES_PER_PAGE } from "./config.js";
import { getJSON } from "./helper.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

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
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥💥💥💥 `);
    throw err; // NOTE: the flow of Error
  }
};

export const loadSearchResults = async function (query) {
  try {
    const data = await getJSON(`${API_URL}?search=${query}`);
    console.log(data);
    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        ingredients: rec.ingredients,
        imgUrl: rec.image_url,
        publisher: rec.publisher,
        sourceUrl: rec.source_url,
        servings: rec.servings,
        cookingTime: rec.cooking_time,
      };
    });
  } catch (err) {
    console.error(`${err} 💥💥💥💥💥💥 `);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; // 9
  return state.search.results.slice(start, end);
};
