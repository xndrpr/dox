import { Api } from "telegram";
import * as cfg from "./config";
import { Telegram } from "./helpers/telegram.helper";
import { IConfig } from "./models/IConfig";
import { NewMessageEvent } from "telegram/events";
import { shared } from "./shared";

export async function check_block(telegram: Telegram, config: IConfig) {
  try {
    await telegram.client.sendMessage(config.target, { message: "ENTER" });
  } catch (e: any) {
    if (e.errorMessage === "YOU_BLOCKED_USER") {
      await telegram.client.invoke(new Api.contacts.Unblock({ id: config.target }));

      await telegram.client.sendMessage(config.target, { message: "UNBLOCKED ENTER" });
    } else {
      console.error(e);
    }
  }
}

export async function handle_update(event: NewMessageEvent) {
  if (!event.isPrivate) return;

  if (shared.waiting_message) {
    if (event.message.text === shared.waiting_message.target) {
      console.log(shared.waiting_message);
      await event.message.reply({ message: shared.waiting_message.reply });

      if (shared.waiting_message.wait_message) {
        shared.waiting_message = shared.waiting_message.wait_message;
      } else {
        shared.waiting_message = undefined;
      }
    }
  }
}

export async function START(telegram: Telegram, config: IConfig) {
  while (true) {
    try {
      if (shared.waiting_message) { await new Promise((resolve) => setTimeout(resolve, 1 * 1000)); continue; }

      const message = config.messages.find((message) => message.id === shared.last_message + 1);
      if (!message) { shared.last_message = 0; continue; }

      await telegram.client.sendMessage(config.target, { message: message.text });

      if (message.wait_message) { shared.waiting_message = message.wait_message; }
      shared.last_message = message.id;

      await new Promise((resolve) => setTimeout(resolve, message.delay * 1000));
    } catch (e: any) {
      console.error(e);
    }
  }
}
