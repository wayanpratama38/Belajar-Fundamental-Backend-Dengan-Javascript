import JWT from '@hapi/jwt';
import InternalServerError from '../exceptions/internalServerError.js';

export const tokenManager = {
  generateToken: (payload) =>
    JWT.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) =>
    JWT.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifact = JWT.token.decode(refreshToken);
      JWT.token.verifySignature(artifact, process.env.REFRESH_TOKEN_KEY);
      const { payload } = artifact.decoded;
      return payload;
    } catch {
      throw new InternalServerError("Terjadi kesalahan di sisi server");
    }
  },
};
