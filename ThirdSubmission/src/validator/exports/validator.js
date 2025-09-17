import { checkValidateResult, getValidateResult } from "../utils.js"
import { postExportSchema } from "./schema.js"

export const ExportValidator = {
    validatePostExportPayload : (payload) => {
        const validateResult = getValidateResult(postExportSchema,payload)
        return checkValidateResult(validateResult);
    }
}