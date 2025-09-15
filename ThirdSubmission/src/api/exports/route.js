import ExportHandler from "./exportHandler.js"

const exportHandler = new ExportHandler();

export const route = [
    {
        method : 'POST',
        path : '/exports/playlist/{id}',
        handler : exportHandler.postExportHandler,
        options : {
            auth : 'musicapp_jwt'
        }
    }
]