import pkg from "bcryptjs";
// import { user } from "../user/user.js";
export async function registerUser(email, password) {
  //dynamic import
  const { user } = await import("../user/user.js");
  const { genSalt, hash } = pkg;
  // generate salt
  const salt = await genSalt(10);
  // hash with salt
  const hashedPassword = await hash(password, salt);

  // strore in db
  const result = await user.insertOne({
    email: {
      address: email,
      verified: false,
    },
    password: hashedPassword,
  });

  console.log("result from storing", result);
  //Return user from DB
  return result.insertedId;
}
