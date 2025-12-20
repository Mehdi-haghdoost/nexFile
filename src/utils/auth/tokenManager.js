import { sign, verify } from "jsonwebtoken";

const generateAccessToken = (data) => {
  const token = sign({ ...data }, process.env.NEXTAUTH_SECRET, {
    expiresIn: "30d",
  });
  return token;
};

const verifyAccessToken = (token) => {
  try {
    const tokenPayload = verify(token, process.env.NEXTAUTH_SECRET);
    return tokenPayload;
  } catch (error) {
    console.error("خطا در تایید توکن:", error.message);
    return false;
  }
};

export { generateAccessToken, verifyAccessToken };