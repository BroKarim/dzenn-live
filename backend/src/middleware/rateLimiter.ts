import rateLimit from "express-rate-limit";

export const createRateLimiter = (windowMs: number, max: number, message?: string) => {
  return rateLimit({
    windowMs,
    max,
    message: message || "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: message || "Too many requests, please try again later.",
        retryAfter: Math.ceil(windowMs / 1000),
      });
    },
  });
};

export const apiRateLimiter = createRateLimiter(
  15 * 60 * 1000,
  100,
  "Too many link preview requests, please try again later."
);

export const strictRateLimiter = createRateLimiter(
  60 * 1000,
  10,
  "Rate limit exceeded. Please slow down."
);

