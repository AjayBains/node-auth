import jwt from "jsonwebtoken";

const JWTSignature = process.env.JWT_SIGNATURE;

export async function createTokens(sessionToken, userId) {
  try {
    // create a refresh token
    // session id required for refresh token
    const refreshToken = jwt.sign({ sessionToken }, JWTSignature);
    //  Create Access token
    // session ID,userID
    const accessToken = jwt.sign({ sessionToken, userId }, JWTSignature);
    // return refresh token and access tokenoken,
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("create token error", e);
  }
}
