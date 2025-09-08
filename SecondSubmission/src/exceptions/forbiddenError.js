import ClientError from "./clientError.js";

export default class ForbiddenError extends ClientError  {
    constructor(message){
        super(message,403);
        this.name = "ForbiddenError";
    }
}