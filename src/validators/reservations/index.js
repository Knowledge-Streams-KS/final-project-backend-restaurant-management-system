import Joi from "joi";

const reservationValidator = {
  create: (req, res, next) => {
    const schema = Joi.object({
      fName: Joi.string().required().messages({
        "any.required": "First name is required",
        "string.base": "First name should be a string",
      }),
      lName: Joi.string().required().messages({
        "any.required": "Last name is required",
        "string.base": "Last name should be a string",
      }),
      email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.email": "Email should be a valid email address",
      }),
      phoneNo: Joi.string()
        .pattern(/^\d{11}$/)
        .required()
        .messages({
          "any.required": "Phone number is required",
          "string.pattern.base": "Phone number should be exactly 11 digits",
        }),
      date: Joi.string().isoDate().required().messages({
        "any.required": "Date is required",
        "string.isoDate": "Date should be in ISO format (YYYY-MM-DD)",
      }),
      reservedBy: Joi.string()
        .valid("customer", "employee")
        .required()
        .messages({
          "any.required": "Reservation type is required",
          "any.only": "Reservation type must be 'customer' or 'employee'",
        }),
      TimeSlotId: Joi.number().positive().integer().required().messages({
        "any.required": "Time slot ID is required",
        "number.base": "Time slot ID should be a number",
        "number.positive": "Time slot ID should be a positive number",
        "number.integer": "Time slot ID should be an integer",
      }),
      seats: Joi.number().positive().integer().required().messages({
        "any.required": "Number of seats is required",
        "number.base": "Number of seats should be a number",
        "number.positive": "Number of seats should be a positive number",
        "number.integer": "Number of seats should be an integer",
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

export default reservationValidator;
