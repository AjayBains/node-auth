import jwt from "jsonwebtoken";
const JWTSignature = process.env.JWT_SIGNATURE;
export async function logUserOut(request, reply) {
  try {
    const { session } = await import("../session/session.js");
    if (request?.cookies?.refreshToken) {
      // get refresh token
      const { refreshToken } = request.cookies;
      // decode refresh token
      const { sessionToken } = jwt.verify(refreshToken, JWTSignature);
      console.log("sessionToken", sessionToken);

      // Delete database record for session
      await session.deleteOne({
        sessionToken,
      });
      // remove cookies
      reply.clearCookie("refreshToken").clearCookie("accessToken");
    }
  } catch (error) {
    console.log("sever logout error", error);
  }
}
