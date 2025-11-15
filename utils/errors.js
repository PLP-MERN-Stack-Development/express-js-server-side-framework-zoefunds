// utils/errors.js
class AppError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class NotFoundError extends AppError {}
class ValidationError extends AppError {}
class AuthError extends AppError {}

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  AuthError
};