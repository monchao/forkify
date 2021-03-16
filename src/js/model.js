import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { AJAX } from "./helper.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    ingredients: recipe.ingredients,
    imgUrl: recipe.image_url,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }), // ⭐ a very handy trick
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`); // ❓ Why use key here

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥💥💥💥 `);
    throw err; // NOTE: the flow of Error
  }
};

export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`); // Why use key here ❓
    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        imgUrl: recipe.image_url,
        publisher: recipe.publisher,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    // reset start page of search resultus
    state.search.page = 1;
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

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings // double the servings: 2 * 8/4 = 4
  });

  state.recipe.servings = newServings;
};

const persitBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persitBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  persitBookmarks();
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};

// clearBookmarks()

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim()); // 🐞 fixed!
        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient format! Please use the correct format :)"
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    // Add the uploaded recipe to bookmarks.
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
