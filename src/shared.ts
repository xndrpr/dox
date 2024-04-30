import { Telegram } from "./helpers/telegram.helper";
import { WaitMessage } from "./models/WaitMessage";

export interface IShared {
  waitingMessage: WaitMessage | undefined;
  lastMessage: number;
  timeSinceLastMessage: number;
  storeUsernames: boolean;
  telegram: Telegram | undefined;
}

export const shared: IShared = {
  telegram: undefined,
  waitingMessage: undefined,
  lastMessage: 0,
  timeSinceLastMessage: 0,
  storeUsernames: false
};