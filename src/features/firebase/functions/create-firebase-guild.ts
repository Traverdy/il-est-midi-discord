import { FIREBASE_GUILD_CURRENT_VERSION } from "../constants/firebase-guild-current-version";
import { ICreateFirebaseGuild } from "../interfaces/create-firebase-guild";
import { IFirebaseGuild } from "../interfaces/firebase-guild";

export function createFirebaseGuild({
  id,
}: ICreateFirebaseGuild): IFirebaseGuild {
  return {
    id,
    version: FIREBASE_GUILD_CURRENT_VERSION,
  };
}
