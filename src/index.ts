import { NewMessage } from "telegram/events";
import * as dox from "./dox";
import { Telegram } from "./helpers/telegram.helper";
import * as cfg from "./config";
import { Command } from "./models/Command";
import { shared } from "./shared";

async function init() {
  const telegram = new Telegram(cfg.API_ID, cfg.API_HASH);
  const config = cfg.CONFIG;

  let id = 0;
  config.messages = config.messages.map((message) => {
    id += 1;
    message.id = id;

    return message;
  });

  return { telegram, config };
}

async function cli(): Promise<Command> {
  const options = process.argv.slice(2);

  if (options.includes("--help") || options.includes("-h") || options.includes("help")) {
    console.log("Usage: dox [command] [options]\n\n");
    console.log("Options:");
    console.log("\t--help - Show this message");
    console.log("\t--config - Show the config\n");
    console.log("Commands:");
    console.log("\tstart - Start the bot");

    return Command.Help;
  } else if (options.includes("start")) {
    if (options.includes("-su") || options.includes("--store-usernames")) {
      shared.storeUsernames = true;
    }

    return Command.Start;
  }

  return Command.Help;
}

async function main() {
  const cliResult = await cli();

  if (cliResult === Command.Start) {
    const { telegram, config } = await init();
    shared.telegram = telegram;

    telegram.client.addEventHandler(dox.handle_update, new NewMessage({}));
    await telegram.start();

    await dox.check_block(config);
    await dox.START(config);
  }
}

main();