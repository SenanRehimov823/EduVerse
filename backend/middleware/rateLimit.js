import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 3, 
  message: {
    message: "Çox tez-tez daxil olmağa cəhd edirsiniz. 1 dəqiqədə maksimum 3 dəfə login etmək mümkündür.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});