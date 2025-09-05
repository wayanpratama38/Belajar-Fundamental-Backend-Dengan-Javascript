import JWT from '@hapi/jwt';

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
    } catch (error) {
      console.log('ERROR KETIKA VERIFIKASI REFRESH TOKEN!');
    }
  },
};
