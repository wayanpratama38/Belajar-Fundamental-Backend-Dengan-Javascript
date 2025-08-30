import type { Authentication } from "../../interface/authenticationsInterface";
import { DeleteAuthenticationSchema, PostAuthenticationSchema, PutAuthenticationSchema } from "./schema";


export const AuthenticationValidator = {
    validatePostAuthentication : (payload : Authentication) => {
        const result = PostAuthenticationSchema.validate(payload)
        if(result.error){
            throw new Error(result.error.message);
        }
    },

    validatePutAuthentication : (payload : string) => {
        const result = PutAuthenticationSchema.validate(payload);
        if(result.error){
            throw new Error(result.error.message);
        }
    },

    validateDeleteAuthentication : (payload : string) => {
        const result = DeleteAuthenticationSchema.validate(payload);
        if(result.error){
            throw new Error(result.error.message);
        }
    }
};