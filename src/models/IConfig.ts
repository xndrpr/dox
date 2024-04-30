import { Message } from "./Message";
import { WaitMessage } from "./WaitMessage";

export interface IConfig {
  target: string;
  messages: Message[];
  parallel: WaitMessage[];
}