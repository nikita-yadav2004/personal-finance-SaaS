import bcrypt from "bcryptjs";

export const generateHash = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export const compareHash = async (password, hashedPassword) => {
  const comparePassword = await bcrypt.compare(password, hashedPassword);
  return comparePassword;
};
