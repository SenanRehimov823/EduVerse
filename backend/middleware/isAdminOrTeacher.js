


export const isAdminOrTeacher = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Token tələb olunur" });
  }

  if (req.user.role === "admin" || req.user.role === "teacher") {
    return next();
  }

  return res.status(403).json({ message: "Yalnız müəllim və ya admin icazəlidir" });
};
