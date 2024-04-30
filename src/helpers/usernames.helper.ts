import { existsSync, readFileSync, writeFileSync } from "fs";

export class UsernamesHelper {
  static async storeUsername(username: string) {
    try {
      if (!existsSync("usernames.json")) {
        writeFileSync("usernames.json", "[]");
      }

      const usernames = JSON.parse(readFileSync("usernames.json", "utf-8"));
      usernames.push({
        username: 'https://t.me/' + username,
        date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      });

      writeFileSync("usernames.json", JSON.stringify(usernames));

    } catch (error) {
      console.error(error);
    }
  }
}