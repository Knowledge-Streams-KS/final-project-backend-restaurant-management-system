import Joi from "joi";

const otpValidator = {
  create: (req, res, next) => {
    const schema = Joi.object({
      customerId: Joi.number().positive().integer().required().messages({
        "any.required": "Customer ID is required",
        "number.base": "Customer ID should be a number",
        "number.positive": "Customer ID should be a positive number",
        "number.integer": "Customer ID should be an integer",
      }),
      otpCode: Joi.string()
        .pattern(/^\d{5}$/)
        .required()
        .messages({
          "any.required": "OTP code is required",
          "string.base": "OTP code should be a string",
          "string.pattern.base": "OTP code should be a 5-digit number",
        }),
    });

    validateSchema(req, res, next, schema);
  },
};

function validateSchema(req, res, next, schema) {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Invalid Data",
      error: error.details.map((detail) => detail.message),
    });
  }
  next();
}

export default otpValidator;
