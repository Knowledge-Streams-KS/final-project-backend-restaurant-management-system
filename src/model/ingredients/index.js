import { DataTypes } from "sequelize";
import sequelize from "../../db/config.js";
import recipe from "../Recipe/index.js";
import ingredientsCode from "./ingredientsCode.js";

const recipeIngredients = sequelize.define("IngredientsRecipe", {
  recipeId: {
    type: DataTypes.STRING,
    references: {
      model: recipe,
      key: "recipeId",
    },
    allowNull: false,
  },
  ingredCode: {
    type: DataTypes.STRING,
    references: {
      model: ingredientsCode,
      key: "code",
    },
    allowNull: false,
  },
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

recipe.belongsToMany(ingredientsCode, {
  through: "IngredientsRecipe",
  foreignKey: "recipeId",
});
ingredientsCode.belongsToMany(recipe, {
  through: "IngredientsRecipe",
  foreignKey: "ingredCode",
});

export default recipeIngredients;
