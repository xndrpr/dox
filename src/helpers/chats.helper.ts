import { existsSync, readFileSync, writeFileSync } from "fs";
import { IChat } from "../models/IChat";

export class ChatsHelper {
  static async storeChat(chat: IChat) {
    try {
      if (!existsSync("chats.json")) {
        writeFileSync("chats.json", "[]");
      }

      const chats = JSON.parse(readFileSync("chats.json", "utf-8"));
      chats.push(chat);

      writeFileSync("chats.json", JSON.stringify(chats));

    } catch (error) {
      console.error(error);
    }
  }
}