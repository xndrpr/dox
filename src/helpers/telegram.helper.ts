
// * That is because @types/input is 404. 
// TODO: Switch to another library in the future.
// @ts-ignore
import input from "input";

import { read, readFileSync, writeFileSync } from "fs";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { config } from "dotenv";
import { LogLevel } from "telegram/extensions/Logger";
import { SESSION } from "../config";

export class Telegram {
  client: TelegramClient;

  constructor(apiId: number, apiHash: string) {
    const session = new StringSession(SESSION);

    this.client = new TelegramClient(session, apiId, apiHash, {
      connectionRetries: 5
    });
    this.client.setLogLevel(LogLevel.ERROR);
  }

  async start() {
    await this.client.start({
      phoneNumber: async () => await input.text("Please enter your number: "),
      password: async () => await input.text("Please enter your password: "),
      phoneCode: async () =>
        await input.text("Please enter the code you received: "),
      onError: (err) => console.log(err),
    });
    const session = this.client.session.save();
    const env = readFileSync(".env", "utf-8");
    const newEnv = env.replace(/SESSION=.*/g, `SESSION=${session}`);

    writeFileSync(".env", newEnv);
  }
}