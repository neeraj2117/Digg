import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // max 100 requests per IP
  message: {
    message: "Too many requests. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
