import type { ServerRoute } from "@hapi/hapi";
import type { ExportHandler } from "../../interface/handlerInterface";


export const route = (handler: ExportHandler) : ServerRoute[] => [
    {
        method : 'POST',
        path : '/exports/books',
        handler : handler.postExportHandler,
        options : {
            auth : 'booksapp_jwt'
        }
    }
]