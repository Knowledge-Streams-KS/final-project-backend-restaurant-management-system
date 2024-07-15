import Joi from "joi";
import { roles } from "../../roles";

const authValidators = {
  signUp: (req, res, next) => {
    const strongPasswordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/;
    const alphaRegex = /^[A-Za-z]+$/;
    const schema = Joi.object({
      firstName: Joi.string()
        .regex(alphaRegex)
        .min(3)
        .max(20)
        .required()
        .messages({
          "string.pattern.base": "First name should be a type of text",
          "string.min": "First name should have at least 3 characters",
          "string.max": "First name should have at most 20 characters",
          "any.required": "First name is required",
        }),
      lastName: Joi.string()
        .regex(alphaRegex)
        .min(3)
        .max(20)
        .required()
        .messages({
          "string.pattern.base": "Last name should be a type of text",
          "string.min": "Last name should have at least 3 characters",
          "string.max": "Last name should have at most 20 characters",
          "any.required": "Last name is required",
        }),
      email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email",
        "any.required": "Email is required",
      }),
      password: Joi.string().regex(strongPasswordRegex).required().messages({
        "string.pattern.base":
          "Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum eight in length",
        "any.required": "Password is required",
      }),
      role: Joi.string()
        .valid(roles.ADMIN, roles.WAITER, roles.CHEF)
        .required()
        .messages({
          "any.only": `Role must be one of [${roles.ADMIN}, ${roles.WAITER},${roles.CHEF}]`,
          "any.required": "Role is required",
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
  signIn: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.required().string().email().messages({
        "any.required": "Email is required",
        "string.email": "Email must be a valid email",
      }),
      password: Joi.required().messages({
        "any.required": "Password is required",
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
    const strongPasswordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/;
    const schema = Joi.object({
      email: Joi.required().messages({
        "any.required": "Email is required",
      }),
      oldPassword: Joi.required().messages({
        "any.required": "Password is required",
      }),
      newPassword: Joi.string().regex(strongPasswordRegex).required().messages({
        "string.pattern.base":
          "Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum eight in length",
        "any.required": "Password is required",
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
export default authValidators;
