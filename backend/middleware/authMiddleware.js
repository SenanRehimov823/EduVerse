import jwt from "jsonwebtoken";
import User from "../model/user.js"; 

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Giriş icazəsi yoxdur (token tapılmadı)" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); 

    if (!user) {
      return res.status(401).json({ message: "İstifadəçi tapılmadı" });
    }

    if (user.role === "pending") {
      return res.status(403).json({ message: "Hesabınız hələ admin tərəfindən təsdiqlənməyib." });
    }

    req.user = {
      id: user._id,
      role: user.role,
      email: user.email
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token etibarsızdır" });
  }
};


