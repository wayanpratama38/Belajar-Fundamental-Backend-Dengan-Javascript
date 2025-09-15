import { checkValidateResult, getValidateResult } from "../utils"
import { postExportSchema } from "./schema"

export const ExportValidator = {
    validatePostExportPayload : (payload) => {
        const validateResult = getValidateResult(postExportSchema,payload)
        return checkValidateResult(validateResult);
    }
}