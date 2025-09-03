import InvariantError from "../exceptions/invariantError";

export const getValidateResult = (schema, payload) => {
  return schema.validate(payload);
}

export const checkValidateResult = (validationResult) => {
  if (validationResult.error) {
    throw new InvariantError(validationResult.error.message);
  }
}