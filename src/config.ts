import { config } from "dotenv";
import { readFileSync } from "fs";
import { IConfig } from "./models/IConfig";

config();

export const API_ID: number = parseInt(process.env.API_ID || "0");
export const API_HASH: string = process.env.API_HASH || "";
export const SESSION: string = process.env.SESSION || "";
export const CONFIG: IConfig = JSON.parse(readFileSync("config.json", "utf-8") || "{}");