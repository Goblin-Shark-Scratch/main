const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const convertIngredientsToParams = (ingredients) => {
  let res = '';
  for (const [ingredient, quantity] of Object.entries(ingredients)) {
    res += `+${ingredient},`;
  }
  return res.slice(1, -1);
};

const mainController = {};
// import API

mainController.searchRecipe = async (req, res, next) => {
  // connect to API to find recipes matching a query
  // ranking 2 orders by least missing ingredients
  // ignore pantry ignores common pantry items like water, flour, sugar, etc.
  try {
    const OPTIONS = {
      ranking: 2,
      ignorePantry: true,
    };

    const baseUrl = 'https://api.spoonacular.com/recipes/findByIngredients';
    const apiKeyAsParam = `apiKey=${process.env.API_KEY}`;
    const ingredientsAsParams =
      'ingredients=' + convertIngredientsToParams(req.user.ingredients);
    const optionsAsParams = new URLSearchParams(OPTIONS).toString();

    const response = await fetch(
      `${baseUrl}?${apiKeyAsParam}&${ingredientsAsParams}&${optionsAsParams}`
    );
    res.locals.recipes = await response.json();
    next();
  } catch (err) {
    return next({
      log: `mainController.searchRecipes ERROR: ${err}`,
    });
  }
};

// return all ingredients in the user's inventory
mainController.fetchIngredients = (req, res, next) => {
  res.locals.ingredients = req.user.ingredients;
  next();
};

// { eggs: 1 }
// { eggs: 12 }

// update user's ingredients inventory
mainController.updateIngredients = (req, res, next) => {
  req.user.ingredients = { ...req.user.ingredients, ...req.body };
  req.user.save(); // consider await ?
  res.locals.ingredients = req.user.ingredients;
  next();
};

// get the favorites from the fav history
mainController.getFavorites = (req, res, next) => {
  res.locals.favorites = req.user.favorites;
  next();
};

// update the favorites array
mainController.addFavorite = (req, res, next) => {
  req.user.favorites.push(req.body.favorite);
  req.user.save();
  res.locals.favorites = req.user.favorites;
  next();
};

mainController.removeFavorite = (req, res, next) => {
  req.user.favorites = req.user.favorites.filter(
    (fav) => fav !== req.body.favorite
  );
  req.user.save();
  res.locals.favorites = req.user.favorites;
  next();
};

// get recently viewed recipes
mainController.getRecents = (req, res, next) => {
  next();
};

module.exports = mainController;