import { DiscordMessageCommandEnum } from "../../enums/command/discord-message-command.enum";

export interface IStrictlyContainsThisCommandWithPrefixData {
  command: DiscordMessageCommandEnum;
  message: string;
  prefix: string;
}
