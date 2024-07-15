import Joi from "joi";

const tableValidator = {
  create: (req, res, next) => {
    const schema = Joi.object({
      tableNo: Joi.number().positive().integer().required().messages({
        "any.required": "Table number is required",
        "number.base": "Table number should be a number",
        "number.integer": "Table number should be an integer",
        "number.positive": "Table number should be a positive number",
      }),
      seats: Joi.number().positive().integer().optional().messages({
        "number.base": "Seats should be a number",
        "number.integer": "Seats should be an integer",
        "number.positive": "Seats should be a positive number",
      }),
    });

    validateSchema(req, res, next, schema);
  },

  update: (req, res, next) => {
    const schema = Joi.object({
      seats: Joi.number().positive().integer().required().messages({
        "any.required": "Seats are required for update",
        "number.base": "Seats should be a number",
        "number.integer": "Seats should be an integer",
        "number.positive": "Seats should be a positive number",
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

export default tableValidator;
