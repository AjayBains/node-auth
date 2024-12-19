import "./env.js";
import { fastify } from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "fastify-cookie";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./db.js ";
import { registerUser } from "./accounts/register.js";
import { authorizeUser } from "./accounts/authorize.js";
import { logUserIn } from "./accounts/logUserIn.js";
import { getUserFromCookies } from "./accounts/user.js";
import { logUserOut } from "./accounts/loguserOut.js";

// form ESM specific
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();

async function startApp() {
  try {
    app.register(fastifyCookie, {
      secret: process.env.COOKIE_SIGNATURE,
    });
    app.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
    });
    app.post("/api/register", {}, async (request, reply) => {
      try {
        console.log(
          "request to server**",
          request.body.email,
          request.body.password
        );
        const userId = await registerUser(
          request.body.email,
          request.body.password
        );
        console.log("userID**", userId);
      } catch (error) {
        console.error("Posterror**", error);
      }
    });
    app.post("/api/authorize", {}, async (request, reply) => {
      try {
        console.log(
          "resquest body login",
          request.body.email,
          request.body.password
        );

        const { isAuthorized, userId } = await authorizeUser(
          request.body.email,
          request.body.password
        );
        if (isAuthorized) {
          await logUserIn(userId, request, reply);
          reply.send({
            data: "user logged in",
          });
        }
        reply.send({
          data: "auth failed",
        });

        console.log("userIDLogin**", isAuthorized);
      } catch (error) {
        console.error("PE2**", error);
      }
    });
    app.post("/api/logout", {}, async (request, reply) => {
      try {
        await logUserOut(request, reply);
        reply.send({
          data: "User Logged Out",
        });
      } catch (error) {
        console.error("logout srver error**", error);
      }
    });
    app.get("/test", {}, async (request, reply) => {
      try {
        //verify user login
        const user = await getUserFromCookies(request, reply);
        console.log("userrrrrr", user);
        //return user email if it exists,otherwise return undeifned
        console.log("request.cookies", request.cookies);
        console.log(
          "request.headers.user-agent",
          request.headers["user-agent"]
        );
        if (user?._id) {
          reply.send({
            data: user,
          });
        } else {
          reply.send({
            data: "user lookup failed",
          });
        }
      } catch (error) {
        throw new Error("error in get test", error);
      }
    });
    await app.listen({ port: 3000 });
    console.log("🚀 ,listening to port 3000");
  } catch (error) {
    console.error(error);
  }
}
connectDb().then(() => {
  startApp();
});

// startApp();
