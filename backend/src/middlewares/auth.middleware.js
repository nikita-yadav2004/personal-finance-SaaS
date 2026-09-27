import jwt from "jsonwebtoken";

const verifyJWT = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

      req.userId = decoded.userId;

      next();
      
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "JWT verification error", error });
  }
};

export default { verifyJWT };
