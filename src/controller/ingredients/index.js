import { Op } from "sequelize";
import sequelize from "../../db/config.js";
import recipeIngredients from "../../model/ingredients/index.js";
import ingredientsCode from "../../model/ingredients/ingredientsCode.js";
import recipe from "../../model/Recipe/index.js";
import orderItem from "../../model/order/orderItem.js";

const recipeCurd = {
  getAll: async (req, res) => {
    try {
      const allRecipe = await recipe.findAll({
        include: [
          {
            model: ingredientsCode,
          },
        ],
      });
      res.status(200).json({ allRecipe });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
  getSingle: async (req, res) => {
    try {
      const id = req.params.id;
      const findRecipe = await recipe.findByPk(id, {
        include: [
          {
            model: ingredientsCode,
          },
        ],
      });
      if (findRecipe) {
        return res.status(200).json({ findRecipe });
      }
      res.status(400).json({ message: `No Recipe with this id ${id}` });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
  create: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { type, title, size, recipeId, ingredients, price } = req.body;
      const existingRecipe = await recipe.findOne({
        where: { recipeId: recipeId },
      });
      if (existingRecipe) {
        await t.rollback();
        return res.status(409).json({
          message: `Recipe with recipeId ${recipeId} already exists`,
        });
      }
      const existingRecipeTitle = await recipe.findOne({
        where: { title: title, size: size, type: type },
      });
      if (existingRecipeTitle) {
        return res.status(409).json({
          message: `Recipe with this title ${title} of size ${size} in type ${type} already exists!`,
        });
      }
      if (!["small", "medium", "large"].includes(size)) {
        return res.status(400).json({
          message: "Invalid size. Allowed values are small, medium, large.",
        });
      }
      const createdRecipe = await recipe.create(
        {
          title,
          size,
          type,
          recipeId,
          price,
        },
        { transaction: t }
      );
      for (const ingredient of ingredients) {
        const ingredientRecord = await ingredientsCode.findOne({
          where: { code: ingredient.code },
        });
        if (!ingredientRecord) {
          await t.rollback();
          return res.status(400).json({
            message: `Ingredient with code ${ingredient.code} not found`,
          });
        }
        console.log(ingredient.code, ingredient.quantity);
        await recipeIngredients.create(
          {
            recipeId: createdRecipe.recipeId,
            ingredCode: ingredient.code,
            quantity: ingredient.quantity,
          },
          { transaction: t }
        );
      }
      await t.commit();
      res.status(201).json({ message: "Recipe created successfully" });
    } catch (error) {
      await t.rollback();
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
          message: "Unique constraint error",
          errors: error.errors.map((err) => ({
            message: err.message,
          })),
        });
      }
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
  update: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const id = req.params.id;
      const checkRecipe = await recipe.findByPk(id);
      if (!checkRecipe) {
        return res
          .status(404)
          .json({ message: `No recipe with this id ${id}` });
      }
      const { title, size, type, price, ingredients } = req.body;
      console.log("------------------", ingredients);
      const existingRecipe = await recipe.findOne({
        where: {
          title: title || checkRecipe.title,
          size: size || checkRecipe.size,
          type: type || checkRecipe.type,
          price: price || checkRecipe.price,
          recipeId: { [Op.ne]: id },
        },
      });
      if (existingRecipe) {
        return res.status(409).json({
          message: `Recipe with title '${title || checkRecipe.title}', size '${
            size || checkRecipe.size
          }', and type '${type || checkRecipe.type}' already exists!`,
        });
      }
      const fieldsToUpdate = {};
      if (title && title !== checkRecipe.title) fieldsToUpdate.title = title;
      if (size && size !== checkRecipe.size) fieldsToUpdate.size = size;
      if (type && type !== checkRecipe.type) fieldsToUpdate.type = type;
      if (price && price !== checkRecipe.price) fieldsToUpdate.price = price;
      await checkRecipe.update(fieldsToUpdate, { transaction: t });
      if (ingredients && ingredients.some((ing) => ing.code && ing.quantity)) {
        for (const ingredient of ingredients) {
          if (!ingredient.code || !ingredient.quantity) continue;
          const ingredientRecord = await ingredientsCode.findOne({
            where: { code: ingredient.code },
          });
          if (!ingredientRecord) {
            await t.rollback();
            return res.status(400).json({
              message: `Ingredient with code ${ingredient.code} not found`,
            });
          }
          const recipeIngredient = await recipeIngredients.findOne({
            where: {
              recipeId: id,
              ingredCode: ingredient.code,
            },
          });
          if (recipeIngredient) {
            await recipeIngredient.update(
              { quantity: ingredient.quantity },
              { transaction: t }
            );
          } else {
            await recipeIngredients.create(
              {
                recipeId: id,
                ingredCode: ingredient.code,
                quantity: ingredient.quantity,
              },
              { transaction: t }
            );
          }
        }
      }
      await t.commit();
      res
        .status(200)
        .json({ message: `Recipe with id ${id} updated successfully` });
    } catch (error) {
      await t.rollback();
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const checkRecipe = await recipe.findByPk(id);
      if (!checkRecipe) {
        return res
          .status(404)
          .json({ message: `No recipe with this id ${id}` });
      }

      const checkOrderItems = await orderItem.findAll({
        where: { recipeId: id },
      });
      console.log(checkOrderItems);
      if (checkOrderItems.length > 0) {
        return res.status(400).json({
          message: `Cannot delete recipe with id ${id} as it is being used in orders'`,
        });
      }

      await checkRecipe.destroy();
      res
        .status(200)
        .json({ message: `The Recipe with id ${id} has been deleted` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
};
export default recipeCurd;
