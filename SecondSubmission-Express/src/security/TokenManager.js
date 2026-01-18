import jwt from 'jsonwebtoken';
import InvariantError from '../exceptions/InvariantError.js';

const TokenManager = {
 generateAccessToken : (payload) => jwt.sign(payload,process.env.ACCESS_TOKEN_KEY),
 generateRefreshToken : (payload) => jwt.sign(payload,process.env.REFRESH_TOKEN_KEY),
 verifyRefreshToken : (refreshToken) => {
  try {
   const payload = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_KEY);
   return payload
  } catch ( err ){
   console.log(err);
   throw new InvariantError("Refresh Token Tidak Valid")
  }
 },
 verify : (accessToken) => jwt.verify(accessToken,process.env.ACCESS_TOKEN_KEY)
}

export default TokenManager;