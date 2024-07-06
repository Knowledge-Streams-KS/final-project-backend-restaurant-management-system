import e from "express";
import ingredientsCode from "../../model/ingredients/ingredientsCode.js";

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
      await ingredients.destroy();
      res.status(200).json({ message: "Ingredient Deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
export default ingredientsName;
