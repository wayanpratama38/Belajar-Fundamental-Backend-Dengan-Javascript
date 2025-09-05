import CollaborationHandler from "./collaborationHandler.js"

const collaborationHandler = new CollaborationHandler();
const route = [
    {
        method : 'POST',
        path : '/collaborations',
        handler : collaborationHandler.postCollaboration,
        options : {
            auth : 'musicapp_jwt'
        }
    },
    {
        method : 'DELETE',
        path : '/collaborations',
        handler : collaborationHandler.deleteCollaboration,
        options : {
            auth : 'musicapp_jwt'
        }
    }
]

export default route;