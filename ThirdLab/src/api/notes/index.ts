import BookServices from "../../services/inMemory/booksService"
import type {Server, Plugin} from "@hapi/hapi";
import BookHandler from "./bookHandler";
import routes from "./routes";
import type { BooksValidatorInterface } from "../../interface/interface";
interface BooksPluginOptions {
    service : BookServices,
    validator : BooksValidatorInterface
}

const bookPlugin : Plugin<BooksPluginOptions> = { 
    name : "book",
    version : "1.0.0",
    register : async (server : Server, {service,validator} : BooksPluginOptions) => {
        const bookHandler = new BookHandler(service,validator)
        server.route(routes(bookHandler))
    }
}


export default bookPlugin;