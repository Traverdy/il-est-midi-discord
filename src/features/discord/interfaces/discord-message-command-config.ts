import { IDiscordMessageCommandErrorConfig } from "./discord-message-command-error-config";
import { IDiscordMessageCommandHelpConfig } from "./discord-message-command-help-config";
import { IDiscordMessageCommandVersionConfig } from "./discord-message-command-version-config";

export interface IDiscordMessageCommandConfig {
  error: IDiscordMessageCommandErrorConfig;
  help: IDiscordMessageCommandHelpConfig;
  prefix: string | string[];
  version: IDiscordMessageCommandVersionConfig;
}
