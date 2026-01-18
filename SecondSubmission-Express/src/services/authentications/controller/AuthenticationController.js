import AuthenticationError from "../../../exceptions/AuthenticationError.js";
import InvariantError from "../../../exceptions/InvariantError.js";
import TokenManager from "../../../security/TokenManager.js";
import response from "../../../utils/Response.js";
import UserRepositories from "../../users/repositories/UserRepositories.js";
import AuthenticationRepositories from "../repositories/AuthenticationRepositories.js";

const AuthenticationController = {
 async login(req,res,next){
  const {username, password} = req.validate;

  // Verify username available or not
  const isUserAvailable = await UserRepositories.isUsernameAvailable(username);
  if(isUserAvailable){
   return next(new AuthenticationError("Username tidak ditemukan"))
  }

  // Verify user credential
  const isUserVerified = await UserRepositories.verifyUserCredential({username,password});
  if(!isUserVerified){
   return next(new AuthenticationError("Username dan Password tidak valid"))
  }

  // Get user information
  const userData = await UserRepositories.getUserByUsername(username);
  
  const accesToken = TokenManager.generateAccessToken({userId : userData.id})
  const refreshToken = TokenManager.generateRefreshToken({userId : userData.id})

  await AuthenticationRepositories.addRefreshToken(refreshToken)


  return response(res,201,'Berhasil login ke sistem',{accessToken : accesToken, refreshToken : refreshToken})
 },

 async refreshToken(req,res,next){
  const {refreshToken} = req.validate;
  
  const isRefreshTokenAvail = await AuthenticationRepositories.verifyRefreshToken(refreshToken);
 
  if(!isRefreshTokenAvail){
   return response(res,400,'Refresh Key tidak ditemukan')
  }
  const result  = TokenManager.verifyRefreshToken(refreshToken);
  
  if(!result){
   return next(new InvariantError("Refresh Token tidak valid"))
  }



  const accessToken = TokenManager.generateAccessToken({userId : result.id});

  return response(res,200,'Access token berhasil diperbarui', {accessToken : accessToken})
 },

 async logout(req,res,next){
  const {refreshToken} = req.validate;

   const isRefreshTokenAvail = await AuthenticationRepositories.verifyRefreshToken(refreshToken);
 
  if(!isRefreshTokenAvail){
   return response(res,400,'Refresh Key tidak ditemukan')
  }  
  const result  = TokenManager.verifyRefreshToken(refreshToken);

  if(!result){
   return next(new InvariantError("Refresh Token tidak valid"))
  }

  await AuthenticationRepositories.deleteRefreshToken(refreshToken);
  
  return response(res,200,'Berhasil keluar dari sistem');
 }
}

export default AuthenticationController;