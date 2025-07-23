import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../env"),
});

export const SERVER_URL = process.env.VITE_SERVER_URL;
export const COOKIE_DOMAIN = process.env.VITE_COOKIE_DOMAIN;
export const STUDENT_COOKIE_DOMAIN = process.env.VITE_STUDENT_COOKIE_DOMAIN;
export const ADMIN_COOKIE_DOMAIN = process.env.VITE_ADMIN_COOKIE_DOMAIN;
