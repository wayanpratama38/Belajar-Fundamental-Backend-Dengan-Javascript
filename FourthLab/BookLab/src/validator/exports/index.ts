import { ExportBookPayloadSchema } from "./schema";
import InvariantError from "../../exceptions/InvariantError";

export const ExportValidator = {
    validateExportBookPayload : (payload : string) => {
        const validationResult = ExportBookPayloadSchema.validate(payload);
        if(validationResult.error){
            throw new InvariantError(validationResult.error.message);
        }
    }
}