import type { InputBook } from "../../interface/interface"
import { BookPayloadSchema } from "./schema"

export const BooksValidator = {
    validatePayload : (payload : InputBook) => {
        const validationResult = BookPayloadSchema.validate(payload)
        if(validationResult.error){
            throw new Error(validationResult.error.message);
        }
    }
}