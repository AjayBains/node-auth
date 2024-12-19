import mongo from "mongodb";
import jwt from "jsonwebtoken";
import { createTokens } from "./tokens.js";

const { ObjectId } = mongo;

const JWTSignature = process.env.JWT_SIGNATURE;
export async function getUserFromCookies(request, reply) {
  try {
    const { user } = await import("../user/user.js");
    const { session } = await import("../session/session.js");
    // check to make sure access token exists
    if (request?.cookies?.accessToken) {
      // if access token
      const { accessToken } = request.cookies;
      // decode access token
      const decodedAccessToken = jwt.verify(accessToken, JWTSignature);
      console.log("decodedAccessToken", decodedAccessToken);

      return user.findOne({
        _id: new ObjectId(decodedAccessToken?.userId),
      });
    }
    if (request?.cookies?.refreshToken) {
      const { refreshToken } = request.cookies;
      // decode refresh token
      const decodedRefreshToken = jwt.verify(refreshToken, JWTSignature);
      console.log("decodedRefreshToken", decodedRefreshToken);
      // look up session
      const currentSession = await session.findOne({
        sessionToken: decodedRefreshToken?.sessionToken,
      });
      console.log("currentSession", currentSession);
      //confirm session is valid
      if (currentSession.valid) {
        // lookup the current user
        const currentUser = await user.findOne({
          _id: new ObjectId(currentSession?.userId),
        });
        console.log("currr USER", currentUser);
        // refresh tokens
        await refreshTokens(
          decodedRefreshToken?.sessionToken,
          currentUser?._id,
          reply
        );
        // return user
        return currentUser;
      }
    }

    //if session is valid ,refresh tokens
    //look up current user
    //return current user
  } catch (error) {
    console.log("error in getUserFromCookies ", error);
  }
}

export async function refreshTokens(sessionToken, userId, reply) {
  try {
    const { accessToken, refreshToken } = await createTokens(
      sessionToken,
      userId
    );
    // set cookie
    const now = new Date();

    const refreshExpires = now.setDate(now.getDate() + 30);

    reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        domain: "localhost",
        httpOnly: true,
        expires: refreshExpires,
      })
      .setCookie("accessToken", accessToken, {
        path: "/",
        domain: "localhost",
        httpOnly: true,
      });
  } catch (error) {
    console.log("error in refreshTokens", error);
  }
}
