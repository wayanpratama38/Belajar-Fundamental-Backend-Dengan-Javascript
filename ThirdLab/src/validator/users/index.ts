import type { Register } from "../../interface/booksInterface"
import { UserPayloadSchema } from "./schema"


export const UsersValidator = {
    validateUserPayload : (payload : Register) => { 
        const validationResult = UserPayloadSchema.validate(payload);
        if(validationResult.error){
            throw new Error(validationResult.error.message);
        }
    }
}