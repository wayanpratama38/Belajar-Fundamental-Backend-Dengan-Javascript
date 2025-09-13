
import ExportHandler from "./exportHandler";
import { route } from "./route";


export const ExportPlugin = {
    name : 'exports',
    version : '1.0.0',
    register : async(server : any ,{service,validator} : any ) => {
        const exportHandler = new ExportHandler(validator,service);
        server.route(route(exportHandler));
    }
}