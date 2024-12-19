import { randomBytes } from "crypto";
export async function createSession(userId, connection) {
  try {
    // generate a session token
    const sessionToken = randomBytes(43).toString("hex");
    // retrieve connection information
    const { ip, userAgent } = connection;

    // database insert for session
    const { session } = await import("../session/session.js");

    await session.insertOne({
      sessionToken,
      userId,
      valid: true,
      userAgent,
      ip,
      udatedAt: new Date(),
      createdAt: new Date(),
    });
    // return a session tpken
    return sessionToken;
  } catch (error) {
    throw new Error("Session creation failed");
  }
}
