export class WaitMessage {
  target: string = "";
  reply: string = "";
  wait_message: WaitMessage | undefined = new WaitMessage();
  timeout: number = 0;
}