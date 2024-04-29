import { WaitMessage } from "./models/WaitMessage";

export interface IShared {
  waiting_message: WaitMessage | undefined;
  last_message: number;
}

export const shared: IShared = {
  waiting_message: undefined,
  last_message: 0
};