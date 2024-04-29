import { NewMessage } from "telegram/events";
import * as dox from "./dox";
import { Telegram } from "./helpers/telegram.helper";
import * as cfg from "./config";


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

async function main() {
  const { telegram, config } = await init();

  telegram.client.addEventHandler(dox.handle_update, new NewMessage({}));
  await telegram.start();

  await dox.check_block(telegram, config);
  await dox.START(telegram, config);
}

main();