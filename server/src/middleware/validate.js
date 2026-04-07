import { body, validationResult } from "express-validator";

const usernameRegex = /^[a-z0-9_]+$/;

export const validateSignup = [
  body("username")
    .isString()
    .withMessage("Username must be a string")
    .trim()
    .toLowerCase()
    .matches(usernameRegex)
    .withMessage("Username can only include lowercase letters, numbers, and underscore")
    .isLength({ min: 6, max: 30 })
    .withMessage("Username must be between 6 and 30 characters"),
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 6, max: 72 })
    .withMessage("Password must be between 6 and 72 characters")
];

export const validateLogin = [
  body("username")
    .isString()
    .withMessage("Username must be a string")
    .trim()
    .toLowerCase(),
  body("password").exists().withMessage("Password is required")
];

export const validatePublishText = [
  body("prompt")
    .isString()
    .withMessage("Prompt must be a string")
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Prompt cannot exceed 1000 characters"),
  body("text")
    .isString()
    .withMessage("Text must be a string")
    .trim()
    .notEmpty()
    .withMessage("Text is required")
    .isLength({ max: 50000 })
    .withMessage("Text cannot exceed 50000 characters"),
  body("date")
    .isString()
    .withMessage("Date must be a string")
    .trim()
    .isLength({ max: 20 })
    .withMessage("Date cannot exceed 20 characters")
];

export const validateProfile = [
  body("firstname")
    .optional()
    .isString()
    .withMessage("Firstname must be a string")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Firstname cannot exceed 100 characters"),
  body("surname")
    .optional()
    .isString()
    .withMessage("Surname must be a string")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Surname cannot exceed 100 characters"),
  body("profileBio")
    .optional()
    .isString()
    .withMessage("Profile bio must be a string")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Profile bio cannot exceed 500 characters"),
  body("profileFavoriteAuthors")
    .optional()
    .isString()
    .withMessage("Favorite authors must be a string")
    .trim()
    .isLength({ max: 200 })
    .withMessage("Favorite authors cannot exceed 200 characters"),
  body("profileFavoriteGenres")
    .optional()
    .isString()
    .withMessage("Favorite genres must be a string")
    .trim()
    .isLength({ max: 200 })
    .withMessage("Favorite genres cannot exceed 200 characters"),
  body("profileFavoriteBook")
    .optional()
    .isString()
    .withMessage("Favorite book must be a string")
    .trim()
    .isLength({ max: 200 })
    .withMessage("Favorite book cannot exceed 200 characters")
];

export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    error: "Validation failed",
    details: errors.array()
  });
}
