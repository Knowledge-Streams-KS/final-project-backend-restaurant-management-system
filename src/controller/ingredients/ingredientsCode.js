import recipeIngredients from "../../model/ingredients/index.js";
import ingredientsCode from "../../model/ingredients/ingredientsCode.js";
import recipe from "../../model/Recipe/index.js";

const ingredientsName = {
  getAll: async (req, res) => {
    try {
      const ingredients = await ingredientsCode.findAll();
      res.status(200).json({ ingredients });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  create: async (req, res) => {
    try {
      let { name, code, unit } = req.body;
      name = name.toLowerCase();
      const ingredient = await ingredientsCode.findOne({
        where: { name: name },
      });
      if (ingredient) {
        return res
          .status(400)
          .json({ message: "Ingredient with this name already exits" });
      }
      const ingredientCode = await ingredientsCode.findOne({
        where: { code: code },
      });
      if (ingredientCode) {
        return res
          .status(400)
          .json({ message: "Ingredient with this code already exits" });
      }
      const newIngredients = await ingredientsCode.create({
        name: name,
        code: code,
        unit: unit,
      });
      res
        .status(201)
        .json({ message: "New ingredients Created", newIngredients });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  delete: async (req, res) => {
    try {
      const code = req.params.id;

      const ingredients = await ingredientsCode.findOne({
        where: {
          code: code,
        },
      });
      if (!ingredients) {
        return res
          .status(404)
          .json({ message: `No ingredient code with ${code}` });
      }
      const checkRecipe = await recipeIngredients.findAll({
        where: {
          ingredCode: code,
        },
      });
      console.log(checkRecipe);
      if (checkRecipe.length > 0) {
        return res.status(409).json({
          message: `Ingredient code ${code} is used in a recipe and cannot be deleted`,
        });
      }
      await ingredients.destroy();
      res.status(200).json({ message: `Ingredient with code ${code} deleted` });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
export default ingredientsName;
