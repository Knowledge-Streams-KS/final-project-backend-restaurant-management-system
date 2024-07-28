import Joi from "joi";

const orderValidator = {
  create: (req, res, next) => {
    const schema = Joi.object({
      userId: Joi.number().positive().required().messages({
        "any.required": "User ID is required",
        "number.base": "User ID should be a number",
        "number.positive": "User ID should be a positive number",
      }),
      customerId: Joi.number().positive().required().messages({
        "any.required": "Customer ID is required",
        "number.base": "Customer ID should be a number",
        "number.positive": "Customer ID should be a positive number",
      }),
      orderItems: Joi.array()
        .items(
          Joi.object({
            recipeId: Joi.string().required().messages({
              "any.required": "Recipe ID is required",
              "string.base": "Recipe ID should be a string",
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
          "array.base": "Order items should be an array",
          "array.min": "Order items should contain at least one item",
          "any.required": "Order items are required",
        }),
    });

    validateSchema(req, res, next, schema);
  },

  update: (req, res, next) => {
    const schema = Joi.object({
      userId: Joi.number().positive().messages({
        "number.base": "User ID should be a number",
        "number.positive": "User ID should be a positive number",
      }),
      customerId: Joi.number().positive().messages({
        "number.base": "Customer ID should be a number",
        "number.positive": "Customer ID should be a positive number",
      }),
      orderItems: Joi.array()
        .items(
          Joi.object({
            recipeId: Joi.string().messages({
              "string.base": "Recipe ID should be a string",
            }),
            quantity: Joi.number().positive().messages({
              "number.base": "Quantity should be a number",
              "number.positive": "Quantity should be a positive number",
            }),
          })
        )
        .min(1)
        .messages({
          "array.base": "Order items should be an array",
          "array.min": "Order items should contain at least one item",
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

export default orderValidator;
