import { getValidateResult, checkValidateResult } from "../utils.js"
import { DeleteAuthenticationScheme, PostAuthenticationScheme, PutAuthenticationScheme } from "./schema.js"


export const AuthenticationValidator = {
    validatePostAuthentication : (payload) => {
        const validateResult = getValidateResult(PostAuthenticationScheme,payload);
        return checkValidateResult(validateResult);
    },
    validatePutAuthentication : (payload) => {
        const validateResult = getValidateResult(PutAuthenticationScheme,payload);
        return checkValidateResult(validateResult);
    },
    validateDeleteAuthentication : (payload) => {
        const validateResult = getValidateResult(DeleteAuthenticationScheme,payload);
        return checkValidateResult(validateResult);
    }
}