import BookServices from "../../services/inMemory/BooksService"
import type {Server, Plugin} from "@hapi/hapi";
import BookHandler from "./bookHandler";
import routes from "./routes";
interface BooksPluginOptions {
    service : BookServices
}

const bookPlugin : Plugin<BooksPluginOptions> = { 
    name : "book",
    version : "1.0.0",
    register : async (server : Server, {service} : BooksPluginOptions) => {
        const bookHandler = new BookHandler(service)
        server.route(routes(bookHandler))
    }
}


export default bookPlugin;