import { Telegram } from "./helpers/telegram.helper";
import { IChat } from "./models/IChat";
import { WaitMessage } from "./models/WaitMessage";

export interface IShared {
  waitingMessage: WaitMessage | undefined;
  lastMessage: number;
  timeSinceLastMessage: number;
  storeUsernames: boolean;
  storeChats: boolean;
  telegram: Telegram | undefined;
  noCheck: boolean;
  currentChat: IChat | undefined;
}

export const shared: IShared = {
  telegram: undefined,
  waitingMessage: undefined,
  lastMessage: 0,
  timeSinceLastMessage: 0,
  storeUsernames: false,
  storeChats: false,
  noCheck: false,
  currentChat: {
    date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
    messages: [],
  }
};