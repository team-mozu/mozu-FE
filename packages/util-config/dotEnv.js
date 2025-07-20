import dotenv from "dotenv";
import path from "path";

export const getEnv = () => {
  dotenv.config({
    path: path.resolve(__dirname, `../../.env`),
  });
};

console.log(process.env.VITE_SERVER_URL);
