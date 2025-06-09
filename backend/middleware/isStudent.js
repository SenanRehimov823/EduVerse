export const isStudent = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    next();
  } else {
    return res.status(403).json({ message: "Yalnız şagirdlər üçün icazə var" });
  }
};