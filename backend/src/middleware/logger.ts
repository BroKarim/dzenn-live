import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? "ERROR" : "INFO";
    
    console.log(
      `[${logLevel}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
    );
  });
  
  next();
};

