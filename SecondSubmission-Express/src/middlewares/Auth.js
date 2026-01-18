import TokenManager from "../security/TokenManager.js";
import response from "../utils/Response.js";

const AuthMiddleware = (req,res,next) => {
 const token = req.headers.authorization;
 if(token && token.indexOf('Bearer ')!==1){
  try{
   const user = TokenManager.verify(token.split('Bearer ')[1]);
   req.user = user;
   return next();
  } catch(err) {
   return response(res,401,err.message,null);
  }
 }


 return response(res,401,'Unauthorized',null);
}

export default AuthMiddleware;