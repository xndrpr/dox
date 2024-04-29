import { WaitMessage } from "./WaitMessage";

export class Message {
  id: number = 0;
  text: string = "";
  delay: number = 0;
  wait_message: WaitMessage | undefined = undefined;
}