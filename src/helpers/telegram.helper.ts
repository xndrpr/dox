import { readFileSync, writeFileSync } from "fs";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { LogLevel } from "telegram/extensions/Logger";
import { SESSION } from "../config";
import * as reaedline from "readline";

export class Telegram {
  client: TelegramClient;

  constructor(apiId: number, apiHash: string) {
    const session = new StringSession(SESSION);

    this.client = new TelegramClient(session, apiId, apiHash, {
      connectionRetries: 5
    });
    this.client.setLogLevel(LogLevel.ERROR);
  }

  async logout() {
    const env = readFileSync(".env", "utf-8");
    const newEnv = env.replace(/SESSION=.*/g, 'SESSION=');

    writeFileSync(".env", newEnv);
  }

  async input(text: string) {
    const rl = reaedline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise<string>((resolve) => {
      rl.question(text, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }

  async start() {
    await this.client.start({
      phoneNumber: async () => await this.input("Please enter your number: "),
      password: async () => await this.input("Please enter your password: "),
      phoneCode: async () =>
        await this.input("Please enter the code you received: "),
      onError: (err) => console.log(err),
    });
    const session = this.client.session.save();
    const env = readFileSync(".env", "utf-8");
    const newEnv = env.replace(/SESSION=.*/g, `SESSION=${session}`);

    writeFileSync(".env", newEnv);
  }
}