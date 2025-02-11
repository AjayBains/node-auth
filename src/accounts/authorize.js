import bcrypt from "bcryptjs";
const { compare } = bcrypt;
export async function authorizeUser(email, password) {
  const { user } = await import("../user/user.js");
  // console.log("Imported user module:", user);
  // lookup user
  const userData = await user.findOne({
    "email.address": email,
  });
  console.log("userData", userData);

  // get user password
  const savedPassword = userData.password;
  // compare thepassword with one in database

  const isAuthorized = await compare(password, savedPassword);
  console.log("isAuthorized", isAuthorized);
  // return the boolean if p[assword is correct]
  return {isAuthorized,userId:userData._id};
}
