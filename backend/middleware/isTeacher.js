export const isTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Yalnız müəllimlər bu əməliyyatı yerinə yetirə bilər" });
  }
  next();
};