import Joi from "joi";

const recipeValidator = {
  create: (req, res, next) => {
    const schema = Joi.object({
      type: Joi.string().required().messages({
        "any.required": "Type is required",
        "string.base": "Type should be a string",
      }),
      title: Joi.string().required().messages({
        "any.required": "Title is required",
        "string.base": "Title should be a string",
      }),
      size: Joi.string().valid("small", "medium", "large").required().messages({
        "any.required": "Size is required",
        "string.base": "Size should be a string",
        "any.only": "Size must be one of 'small', 'medium', 'large'",
      }),
      price: Joi.number().positive().required().messages({
        "any.required": "Price is required",
        "number.base": "Price should be a number",
        "number.positive": "Price should be a positive number",
      }),
      recipeId: Joi.string().required().messages({
        "any.required": "Recipe ID is required",
        "string.base": "Recipe ID should be a string",
      }),
      ingredients: Joi.array()
        .items(
          Joi.object({
            code: Joi.string().required().messages({
              "any.required": "Ingredient code is required",
              "string.base": "Ingredient code should be a string",
            }),
            quantity: Joi.number().positive().required().messages({
              "any.required": "Quantity is required",
              "number.base": "Quantity should be a number",
              "number.positive": "Quantity should be a positive number",
            }),
          })
        )
        .min(1)
        .required()
        .messages({
          "array.base": "Ingredients should be an array",
          "array.min": "Ingredients should contain at least one item",
          "any.required": "Ingredients are required",
        }),
    });

    validateSchema(req, res, next, schema);
  },

  update: (req, res, next) => {
    const schema = Joi.object({
      type: Joi.string().messages({
        "string.base": "Type should be a string",
      }),
      title: Joi.string().messages({
        "string.base": "Title should be a string",
      }),
      size: Joi.string().valid("small", "medium", "large").messages({
        "string.base": "Size should be a string",
        "any.only": "Size must be one of 'small', 'medium', 'large'",
      }),
      price: Joi.number().positive().messages({
        "number.base": "Price should be a number",
        "number.positive": "Price should be a positive number",
      }),
      recipeId: Joi.string().messages({
        "string.base": "Recipe ID should be a string",
      }),
      ingredients: Joi.array()
        .items(
          Joi.object({
            code: Joi.string().messages({
              "string.base": "Ingredient code should be a string",
            }),
            quantity: Joi.number().positive().messages({
              "number.base": "Quantity should be a number",
              "number.positive": "Quantity should be a positive number",
            }),
          })
        )
        .min(1)
        .messages({
          "array.base": "Ingredients should be an array",
          "array.min": "Ingredients should contain at least one item",
        }),
    });

    validateSchema(req, res, next, schema);
  },
};

function validateSchema(req, res, next, schema) {
  const { value, error } = schema.validate(req.body);
  console.log(value);
  if (error) {
    return res.status(400).json({
      message: "Invalid Data",
      error,
    });
  }
  next();
}

export default recipeValidator;
