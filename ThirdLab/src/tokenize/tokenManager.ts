import * as JWT from  '@hapi/jwt'
export const TokenManager = {
    generateAccessToken : (payload : JWT.HapiJwt.Payload) => JWT.token.generate(payload,process.env.ACCESS_TOKEN_KEY!!),
    generateRefreshToken : (payload : JWT.HapiJwt.Payload) => JWT.token.generate(payload,process.env.REFRESH_TOKEN_KEY!!),
    verifyRefreshToken : (refreshToken : string) => {
        try {
            const artifact = JWT.token.decode(refreshToken);
            JWT.token.verifySignature(artifact,process.env.REFRESH_TOKEN_KEY!!)
            const { payload } = artifact.decoded;
            return payload;
        } catch ( error ) {
            throw new Error(`ERROR MESSAGE : ${error}`);
        }
    }
}