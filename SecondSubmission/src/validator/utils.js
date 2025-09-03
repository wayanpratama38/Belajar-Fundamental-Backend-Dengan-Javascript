import InvariantError from "../exceptions/invariantError.js";

export const getValidateResult = (schema, payload) => {
  return schema.validate(payload);
}

export const checkValidateResult = (validationResult) => {
  if (validationResult.error) {
    throw new InvariantError(validationResult.error.message);
  }
}