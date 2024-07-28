import Joi from "joi";

const inventoryValidator = {
  create: (req, res, next) => {
    const schema = Joi.object({
      ingredientsId: Joi.string().required().messages({
        "any.required": "Ingredient ID is required",
        "string.base": "Ingredient ID should be a string",
      }),
      quantity: Joi.number().positive().required().messages({
        "any.required": "Quantity is required",
        "number.base": "Quantity should be a number",
        "number.positive": "Quantity should be a positive number",
      }),
      unitPrice: Joi.number().positive().required().messages({
        "any.required": "Unit price is required",
        "number.base": "Unit price should be a number",
        "number.positive": "Unit price should be a positive number",
      }),
      date: Joi.string()
        .pattern(/^\d{1,2}\/\d{1,2}\/\d{4}$/)
        .required()
        .messages({
          "any.required": "Date is required",
          "string.pattern.base": "Date should be in MM/DD/YYYY format",
        }),
    });

    validateSchema(req, res, next, schema);
  },

  update: (req, res, next) => {
    const schema = Joi.object({
      ingredientsId: Joi.string().required().messages({
        "any.required": "Ingredient ID is required",
        "string.base": "Ingredient ID should be a string",
      }),
      quantity: Joi.number().positive().messages({
        "number.base": "Quantity should be a number",
        "number.positive": "Quantity should be a positive number",
      }),
      unitPrice: Joi.number().positive().messages({
        "number.base": "Unit price should be a number",
        "number.positive": "Unit price should be a positive number",
      }),
      date: Joi.string()
        .pattern(/^\d{1,2}\/\d{1,2}\/\d{4}$/)
        .messages({
          "string.pattern.base": "Date should be in MM/DD/YYYY format",
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

export default inventoryValidator;
