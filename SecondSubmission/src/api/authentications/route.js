import AuthenticationHandler from "./authenticationHandler.js"

const authenticationHandler = new AuthenticationHandler();
const route = [
    {
        method : "POST",
        path : '/authentications',
        handler : authenticationHandler.postAuthentication
    },
    {
        method : "PUT",
        path : '/authentications',
        handler : authenticationHandler.putAuthentication
    },
    {
        method : "DELETE",
        path : '/authentications',
        handler : authenticationHandler.deleteAuthentication
    },
]

export default route;