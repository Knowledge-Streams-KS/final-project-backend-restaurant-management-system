import Joi from "joi";
const ingredientsCodeValidator = {
  create: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().required().messages({
        "any.required": "Name is required",
        "string.base": "Name should be a string",
      }),
      code: Joi.string().required().messages({
        "any.required": "Code is required",
        "string.base": "Code should be a string",
      }),
      unit: Joi.string().valid("grams", "unit", "liters").required().messages({
        "any.required": "Unit is required",
        "string.base": "Unit should be a string",
        "any.only": "Unit must be one of 'grams', 'kilograms', 'liters'",
      }),
    });
    const { value, error } = schema.validate(req.body);
    console.log(value);
    if (error) {
      return res.status(400).json({
        message: "Invalid Data",
        error,
      });
    }
    next();
  },
  update: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().messages({
        "string.base": "Name should be a string",
      }),
      code: Joi.string().messages({
        "string.base": "Code should be a string",
      }),
      unit: Joi.string().valid("grams", "kilograms", "liters").messages({
        "string.base": "Unit should be a string",
        "any.only": "Unit must be one of 'grams', 'kilograms', 'liters'",
      }),
    });
    const { value, error } = schema.validate(req.body);
    console.log(value);
    if (error) {
      return res.status(400).json({
        message: "Invalid Data",
        error,
      });
    }
    next();
  },
};

export default ingredientsCodeValidator;
