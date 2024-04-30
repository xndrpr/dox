import { IChatMessage } from "./IChatMessage";

export interface IChat {
  date: string;
  messages: IChatMessage[];
}