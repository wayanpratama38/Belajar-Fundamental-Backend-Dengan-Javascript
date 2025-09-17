import ExportHandler from "./exportHandler.js"

const exportHandler = new ExportHandler();

export const route = [
    {
        method : 'POST',
        path : '/export/playlists/{id}',
        handler : exportHandler.postExportHandler,
        options : {
            auth : 'musicapp_jwt'
        }
    }
]