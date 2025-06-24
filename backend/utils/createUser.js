import bcrypt from "bcryptjs";
import User from "../model/user.js";

export const createUser = async ({
  name,
  email,
  password,
  role,
  subject = null,
  subjectName = "",
  classId = null,
  grade = ""
}) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role,
    subject,
    subjectName, 
    class: classId,
    grade,
  });
  await newUser.save();
  return newUser;
};
