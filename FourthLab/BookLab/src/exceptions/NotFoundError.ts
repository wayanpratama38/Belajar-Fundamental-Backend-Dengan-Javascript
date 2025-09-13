import ClientError from "./ClientError";

export default class NotFoundError extends ClientError {
    constructor(message:string) {
        super(message);
        this.name = "NotFoundError";
    }
}