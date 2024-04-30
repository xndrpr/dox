import { Api } from "telegram";
import * as cfg from "./config";
import { IConfig } from "./models/IConfig";
import { NewMessageEvent } from "telegram/events";
import { shared } from "./shared";
import * as keywords from "./keywords";
import { UsernamesHelper } from "./helpers/usernames.helper";
import { WaitMessage } from "./models/WaitMessage";
import LanguageDetect from "languagedetect";
import { ChatsHelper } from "./helpers/chats.helper";

const lngDetector = new LanguageDetect();

; export async function check_block(config: IConfig) {
  try {
    if (shared.storeChats) {
      shared.currentChat?.messages.push({
        from: "me",
        message: "?",
      });
    }

    await shared.telegram?.client.sendMessage(config.target, { message: "?" });
  } catch (e: any) {
    if (e.errorMessage === "YOU_BLOCKED_USER") {
      await shared.telegram?.client.invoke(new Api.contacts.Unblock({ id: config.target }));

      await shared.telegram?.client.sendMessage(config.target, { message: "UNBLOCKED ?" });
    } else {
      console.error(e);
    }
  }
}

export async function handle_update(event: NewMessageEvent) {
  if (!event.isPrivate) return;

  let id;
  if (cfg.CONFIG.target.includes("@")) {
    try {
      const result = await shared.telegram?.client.invoke(new Api.contacts.ResolveUsername({ username: cfg.CONFIG.target.replace("@", "") }));

      const user = result?.users[0];
      if (!user) return;

      id = user.id.toJSNumber();
    } catch (e) {
      console.error(e);
    }
  } else {
    try {
      id = parseInt(cfg.CONFIG.target);
    } catch (e) {
      console.error(e);
      return;
    }
  }

  if (event.message.senderId?.toJSNumber() !== id) return;

  if (shared.storeChats) {
    shared.currentChat?.messages.push({
      from: "user",
      message: event.message.text,
    });
  }

  if (shared.storeUsernames && event.message.text.includes("@")) {
    const username = event.message.text.split("@")[1].split(" ")[0];
    await UsernamesHelper.storeUsername(username);
  }

  cfg.CONFIG.parallel.forEach(async (parallel: WaitMessage) => {
    // TODO: Correct typos based on language. const language = lngDetector.detect(event.message.text)[0][0];

    if (event.message.text.includes(parallel.target)) {
      if (parallel.reply.length < 1) return;
      
      if (shared.storeChats) {
        shared.currentChat?.messages.push({
          from: "me",
          message: parallel.reply,
        });
      }
      if (parallel.reply.includes("@end")) {
        shared.waitingMessage = undefined;
        shared.lastMessage = 0;
        shared.timeSinceLastMessage = 0;
      }
      await shared.telegram?.client.sendMessage(cfg.CONFIG.target, { message: parallel.reply });
    }
  });

  if (shared.waitingMessage) {
    if (shared.waitingMessage.target.includes("@")) {
      switch (shared.waitingMessage.target) {
        case "@all":
          if (!event.message.text) return;
          break;
        case "@num":
          if (!keywords.KEYWORDS["@num"].test(event.message.text)) return;
          break;
        case "@yes":
          if (!keywords.KEYWORDS["@yes"].test(event.message.text)) return;
          break;
        case "@no":
          if (!keywords.KEYWORDS["@no"].test(event.message.text)) return;
          break;
        default:
          return;
      }

      if (shared.waitingMessage.reply.length > 0) {
        if (shared.storeChats) {
          shared.currentChat?.messages.push({
            from: "me",
            message: shared.waitingMessage.reply,
          });
        }
        await event.message.reply({ message: shared.waitingMessage.reply });
      }

      if (shared.waitingMessage.wait_message) {
        shared.waitingMessage = shared.waitingMessage.wait_message;
        shared.timeSinceLastMessage = 0;
      } else {
        shared.waitingMessage = undefined;
      }
    } else {
      if (event.message.text === shared.waitingMessage.target) {
        if (shared.waitingMessage.reply.length > 0) {
          if (shared.storeChats) {
            shared.currentChat?.messages.push({
              from: "me",
              message: shared.waitingMessage.reply,
            });
          }

          await event.message.reply({ message: shared.waitingMessage.reply });
        }

        if (shared.waitingMessage.wait_message) {
          shared.waitingMessage = shared.waitingMessage.wait_message;
          shared.timeSinceLastMessage = 0;
        } else {
          shared.waitingMessage = undefined;
        }
      }
    }
  }
}

export async function START(config: IConfig) {
  while (true) {
    try {
      if (shared.waitingMessage) {
        if (shared.waitingMessage.timeout
          && shared.timeSinceLastMessage
          && (shared.timeSinceLastMessage >= shared.waitingMessage.timeout)) {
          shared.waitingMessage = undefined;
          shared.timeSinceLastMessage = 0;
        } else {
          shared.timeSinceLastMessage = shared.timeSinceLastMessage + 1;
          await new Promise((resolve) => setTimeout(resolve, 1 * 1000));

          continue;
        }
      }

      const message = config.messages.find((message) => message.id === shared.lastMessage + 1);
      if (!message) {
        if (shared.storeChats) {
          ChatsHelper.storeChat(shared.currentChat!);

          const chat = { date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), messages: [] };
          shared.currentChat = chat;
        }
        shared.lastMessage = 0;
        continue;
      }

      if (shared.storeChats) {
        shared.currentChat?.messages.push({
          from: "me",
          message: message.text,
        });
      }
      if (message.text.length < 1) return;
      await shared.telegram?.client.sendMessage(config.target, { message: message.text });

      if (message.wait_message) { shared.waitingMessage = message.wait_message; shared.timeSinceLastMessage = 0; }
      shared.lastMessage = message.id;

      await new Promise((resolve) => setTimeout(resolve, message.delay * 1000));
    } catch (e: any) {
      console.error(e);
    }
  }
}
