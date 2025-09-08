import ClientError from "./clientError.js";

export default class InternalServerError extends ClientError{
    constructor(message){
        super(message,500);
        this.name = 'InternalServerError';
    }
}