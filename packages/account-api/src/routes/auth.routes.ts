import { Router } from 'express';
import { body } from 'express-validator';
import { validateErrors } from '@svdw/common';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.post(
  '/register',
  body('email')
    .exists()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email. Must be in email format.'),
  body('name')
    .exists()
    .withMessage('Name is required')
    .matches(/^[A-Za-z\s]+$/) // Only letters and spaces
    .withMessage('Invalid name. Must be a valid name.'),
  body('password')
    .exists()
    .withMessage('Password is required')
    .isStrongPassword({
      minLength: 5,
      minLowercase: 0,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .escape()
    .withMessage(
      'Password must be at least 5 characters long, have one symbol, one number and one uppercase letter',
    ),
  validateErrors,
  authController.register,
);

router.post(
  '/login',
  body('email')
    .exists()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email. Must be in email format.'),
  body('password').exists().withMessage('Password is required').escape(),
  validateErrors,
  authController.login,
);

export default router;
