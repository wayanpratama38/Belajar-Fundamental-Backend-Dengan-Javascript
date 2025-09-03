import { checkValidateResult,getValidateResult } from "../utils.js"
import { UserSchema } from "./schema.js"


export const UserValidator = {
    validateRegisterPayload : (payload) => {
        const validateResult = getValidateResult(UserSchema,payload)
        return checkValidateResult(validateResult);
    }
}