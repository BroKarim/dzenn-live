import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";

const baseURL = process.env.BETTER_AUTH_URL;
const isProduction = process.env.NODE_ENV === "production";

const trustedOrigins = baseURL
  ? [baseURL, ...(isProduction && baseURL.includes("www.") ? [baseURL.replace("www.", "")] : [])]
  : ["http://localhost:3000"];

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  advanced: {
    useSecureCookies: isProduction,
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: isProduction,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});

