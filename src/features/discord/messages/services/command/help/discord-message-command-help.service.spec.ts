import {
  EmbedFieldData,
  MessageEmbedAuthor,
  MessageEmbedFooter,
  MessageEmbedThumbnail,
} from "discord.js";
import moment from "moment-timezone";
import { createMock } from "ts-auto-mock";
import { ColorEnum } from "../../../../../../enums/color.enum";
import { IconEnum } from "../../../../../../enums/icon.enum";
import { ServiceNameEnum } from "../../../../../../enums/service-name.enum";
import { CoreEventService } from "../../../../../core/services/core-event.service";
import { ILoggerLog } from "../../../../../logger/interfaces/logger-log";
import { LoggerService } from "../../../../../logger/services/logger.service";
import { DiscordSoniaService } from "../../../../users/services/discord-sonia.service";
import { IDiscordMessageResponse } from "../../../interfaces/discord-message-response";
import { IAnyDiscordMessage } from "../../../types/any-discord-message";
import { DiscordMessageConfigService } from "../../config/discord-message-config.service";
import { DiscordMessageCommandHelpService } from "./discord-message-command-help.service";

jest.mock(`../../../../../logger/services/chalk/chalk.service`);

describe(`DiscordMessageCommandHelpService`, (): void => {
  let service: DiscordMessageCommandHelpService;
  let coreEventService: CoreEventService;
  let loggerService: LoggerService;
  let discordSoniaService: DiscordSoniaService;
  let discordMessageConfigService: DiscordMessageConfigService;

  beforeEach((): void => {
    coreEventService = CoreEventService.getInstance();
    loggerService = LoggerService.getInstance();
    discordSoniaService = DiscordSoniaService.getInstance();
    discordMessageConfigService = DiscordMessageConfigService.getInstance();
  });

  describe(`getInstance()`, (): void => {
    it(`should create a DiscordMessageCommandHelp service`, (): void => {
      expect.assertions(1);

      service = DiscordMessageCommandHelpService.getInstance();

      expect(service).toStrictEqual(
        expect.any(DiscordMessageCommandHelpService)
      );
    });

    it(`should return the created DiscordMessageCommandHelp service`, (): void => {
      expect.assertions(1);

      const result = DiscordMessageCommandHelpService.getInstance();

      expect(result).toStrictEqual(service);
    });
  });

  describe(`constructor()`, (): void => {
    let coreEventServiceNotifyServiceCreatedSpy: jest.SpyInstance;

    beforeEach((): void => {
      coreEventServiceNotifyServiceCreatedSpy = jest
        .spyOn(coreEventService, `notifyServiceCreated`)
        .mockImplementation();
    });

    it(`should notify the DiscordMessageCommandHelp service creation`, (): void => {
      expect.assertions(2);

      service = new DiscordMessageCommandHelpService();

      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledTimes(1);
      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledWith(
        ServiceNameEnum.DISCORD_MESSAGE_COMMAND_HELP_SERVICE
      );
    });
  });

  describe(`handleResponse()`, (): void => {
    let anyDiscordMessage: IAnyDiscordMessage;
    let discordMessageResponse: IDiscordMessageResponse;

    let loggerServiceDebugSpy: jest.SpyInstance;
    let getMessageResponseSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageCommandHelpService();
      // @todo remove casting once https://github.com/Typescript-TDD/ts-auto-mock/issues/464 is fixed
      anyDiscordMessage = createMock<IAnyDiscordMessage>(({
        id: `dummy-id`,
      } as unknown) as IAnyDiscordMessage);

      loggerServiceDebugSpy = jest.spyOn(loggerService, `debug`);
      getMessageResponseSpy = jest
        .spyOn(service, `getMessageResponse`)
        .mockReturnValue(discordMessageResponse);
    });

    it(`should log about the command`, (): void => {
      expect.assertions(2);

      service.handleResponse(anyDiscordMessage);

      expect(loggerServiceDebugSpy).toHaveBeenCalledTimes(1);
      expect(loggerServiceDebugSpy).toHaveBeenCalledWith({
        context: `DiscordMessageCommandHelpService`,
        extendedContext: true,
        message: `context-[dummy-id] text-help command detected`,
      } as ILoggerLog);
    });

    it(`should get a message response`, (): void => {
      expect.assertions(2);

      service.handleResponse(anyDiscordMessage);

      expect(getMessageResponseSpy).toHaveBeenCalledTimes(1);
      expect(getMessageResponseSpy).toHaveBeenCalledWith();
    });

    it(`should return the message response`, (): void => {
      expect.assertions(1);

      const result = service.handleResponse(anyDiscordMessage);

      expect(result).toStrictEqual(discordMessageResponse);
    });
  });

  describe(`getMessageResponse()`, (): void => {
    let discordSoniaServiceGetCorporationMessageEmbedAuthorSpy: jest.SpyInstance;
    let discordMessageConfigServiceGetMessageCommandHelpImageColorSpy: jest.SpyInstance;
    let discordSoniaServiceGetImageUrlSpy: jest.SpyInstance;
    let discordMessageConfigServiceGetMessageCommandHelpImageUrlSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageCommandHelpService();

      discordSoniaServiceGetCorporationMessageEmbedAuthorSpy = jest.spyOn(
        discordSoniaService,
        `getCorporationMessageEmbedAuthor`
      );
      discordMessageConfigServiceGetMessageCommandHelpImageColorSpy = jest.spyOn(
        discordMessageConfigService,
        `getMessageCommandHelpImageColor`
      );
      discordSoniaServiceGetImageUrlSpy = jest.spyOn(
        discordSoniaService,
        `getImageUrl`
      );
      discordMessageConfigServiceGetMessageCommandHelpImageUrlSpy = jest.spyOn(
        discordMessageConfigService,
        `getMessageCommandHelpImageUrl`
      );
    });

    it(`should return a Discord message response embed with an author`, (): void => {
      expect.assertions(1);
      const messageEmbedAuthor: MessageEmbedAuthor = createMock<
        MessageEmbedAuthor
      >();
      discordSoniaServiceGetCorporationMessageEmbedAuthorSpy.mockReturnValue(
        messageEmbedAuthor
      );

      const result = service.getMessageResponse();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(result.options.embed.author).toStrictEqual(messageEmbedAuthor);
    });

    it(`should return a Discord message response embed with a color`, (): void => {
      expect.assertions(1);
      discordMessageConfigServiceGetMessageCommandHelpImageColorSpy.mockReturnValue(
        ColorEnum.CANDY
      );

      const result = service.getMessageResponse();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(result.options.embed.color).toStrictEqual(ColorEnum.CANDY);
    });

    it(`should return a Discord message response embed with a description`, (): void => {
      expect.assertions(1);

      const result = service.getMessageResponse();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(result.options.embed.description)
        .toStrictEqual(`Below is the complete list of commands.
    You can either use *-*, *!* or *$* as prefix to run a command.`);
    });

    it(`should return a Discord message response embed with 8 fields`, (): void => {
      expect.assertions(1);

      const result = service.getMessageResponse();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(result.options.embed.fields).toHaveLength(8);
    });

    it(`should return a Discord message response embed with a cookie field`, (): void => {
      expect.assertions(1);

      const result = service.getMessageResponse();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(result.options.embed.fields[0]).toStrictEqual({
        name: `Cookie (*cookie*, *cookies* or *c*)`,
        value: `Because I am good, life gave me cookies. Now it is my turn to give you some.`,
      } as EmbedFieldData);
    });

    it(`should return a Discord message response embed with an error field`, (): void => {
      expect.assertions(1);

      const result = service.getMessageResponse();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(result.options.embed.fields[1]).toStrictEqual({
        name: `Error (*error* or *bug*)`,
        value: `Create a bug in my core system. Do not do this one, of course!`,
      } as EmbedFieldData);
    });

    it(`should return a Discord message response embed with a feature field`, (): void => {
      expect.assertions(1);

      const result = service.getMessageResponse();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(result.options.embed.fields[2]).toStrictEqual({
        name: `Feature (*feature* or *f*)`,
        value: `Change my behavior on this guild. Help me to be better!`,
      } as EmbedFieldData);
    });

    it(`should return a Discord message response embed with a help field`, (): void => {
      expect.assertions(1);

      const result = service.getMessageResponse();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(result.options.embed.fields[3]).toStrictEqual({
        name: `Help (*help* or *h*)`,
        value: `Ask for my help, it is obvious! And maybe I will, who knows?`,
      } as EmbedFieldData);
    });

    it(`should return a Discord message response embed with a lunch field`, (): void => {
      expect.assertions(1);

      const result = service.getMessageResponse();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(result.options.embed.fields[4]).toStrictEqual({
        name: `Lunch (*lunch* or *l*)`,
        value: `There is a time to eat.`,
      } as EmbedFieldData);
    });

    it(`should return a Discord message response embed with a release notes field`, (): void => {
      expect.assertions(1);

      const result = service.getMessageResponse();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(result.options.embed.fields[5]).toStrictEqual({
        name: `Release notes (*release-notes* or *r*)`,
        value: `Display the last version release notes.`,
      } as EmbedFieldData);
    });

    it(`should return a Discord message response embed with a version field`, (): void => {
      expect.assertions(1);

      const result = service.getMessageResponse();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(result.options.embed.fields[6]).toStrictEqual({
        name: `Version (*version* or *v*)`,
        value: `Display my current application version.`,
      } as EmbedFieldData);
    });

    it(`should return a Discord message response embed with a more help field`, (): void => {
      expect.assertions(1);

      const result = service.getMessageResponse();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(result.options.embed.fields[7]).toStrictEqual({
        name: `Further help`,
        value: `You can also checkout the [readme](https://github.com/Sonia-corporation/il-est-midi-discord/blob/master/README.md).
      It contains more information about how I work.`,
      } as EmbedFieldData);
    });

    it(`should return a Discord message response embed with a footer containing an icon and a text`, (): void => {
      expect.assertions(1);
      discordSoniaServiceGetImageUrlSpy.mockReturnValue(`dummy-image-url`);

      const result = service.getMessageResponse();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(result.options.embed.footer).toStrictEqual({
        iconURL: `dummy-image-url`,
        text: `At your service`,
      } as MessageEmbedFooter);
    });

    describe(`when the Sonia image url is null`, (): void => {
      beforeEach((): void => {
        discordSoniaServiceGetImageUrlSpy.mockReturnValue(null);
      });

      it(`should return a Discord message response embed with a footer but without an icon`, (): void => {
        expect.assertions(1);

        const result = service.getMessageResponse();

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(result.options.embed.footer).toStrictEqual({
          iconURL: undefined,
          text: `At your service`,
        } as MessageEmbedFooter);
      });
    });

    describe(`when the Sonia image url is "image-url"`, (): void => {
      beforeEach((): void => {
        discordSoniaServiceGetImageUrlSpy.mockReturnValue(`image-url`);
      });

      it(`should return a Discord message response embed with a footer containing an icon and a text`, (): void => {
        expect.assertions(1);

        const result = service.getMessageResponse();

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(result.options.embed.footer).toStrictEqual({
          iconURL: `image-url`,
          text: `At your service`,
        } as MessageEmbedFooter);
      });
    });

    it(`should return a Discord message response embed with a thumbnail`, (): void => {
      expect.assertions(1);
      discordMessageConfigServiceGetMessageCommandHelpImageUrlSpy.mockReturnValue(
        IconEnum.ARTIFICIAL_INTELLIGENCE
      );

      const result = service.getMessageResponse();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(result.options.embed.thumbnail).toStrictEqual({
        url: IconEnum.ARTIFICIAL_INTELLIGENCE,
      } as MessageEmbedThumbnail);
    });

    it(`should return a Discord message response embed with a timestamp`, (): void => {
      expect.assertions(2);

      const result = service.getMessageResponse();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(moment(result.options.embed.timestamp).isValid()).toStrictEqual(
        true
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(moment(result.options.embed.timestamp).fromNow()).toStrictEqual(
        `a few seconds ago`
      );
    });

    it(`should return a Discord message response embed with a title`, (): void => {
      expect.assertions(1);

      const result = service.getMessageResponse();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(result.options.embed.title).toStrictEqual(
        `So, you need my help? Cool.`
      );
    });

    it(`should return a Discord message response splitted`, (): void => {
      expect.assertions(1);

      const result = service.getMessageResponse();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(result.options.split).toStrictEqual(true);
    });

    it(`should return a Discord message response without a response text`, (): void => {
      expect.assertions(1);

      const result = service.getMessageResponse();

      expect(result.response).toStrictEqual(``);
    });
  });

  describe(`hasCommand()`, (): void => {
    let message: string;

    let discordMessageConfigServiceGetMessageCommandPrefixSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageCommandHelpService();
      message = `dummy-message`;

      discordMessageConfigServiceGetMessageCommandPrefixSpy = jest
        .spyOn(discordMessageConfigService, `getMessageCommandPrefix`)
        .mockImplementation();
    });

    describe(`when the message command prefix is "@"`, (): void => {
      beforeEach((): void => {
        discordMessageConfigServiceGetMessageCommandPrefixSpy.mockReturnValue(
          `@`
        );
      });

      describe(`when the given message is an empty string`, (): void => {
        beforeEach((): void => {
          message = ``;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message without a command`, (): void => {
        beforeEach((): void => {
          message = `hello world`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with another command starting with @`, (): void => {
        beforeEach((): void => {
          message = `@version`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with another command starting with -`, (): void => {
        beforeEach((): void => {
          message = `-version`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with another command starting with !`, (): void => {
        beforeEach((): void => {
          message = `!version`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost help command starting with @`, (): void => {
        beforeEach((): void => {
          message = `@hel`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost help command starting with -`, (): void => {
        beforeEach((): void => {
          message = `-hel`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost help command starting with !`, (): void => {
        beforeEach((): void => {
          message = `!hel`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost help command starting with @ and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `@hel dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost help command starting with - and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `-hel dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost help command starting with ! and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `!hel dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the help command starting with @`, (): void => {
        beforeEach((): void => {
          message = `@help`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the help command starting with -`, (): void => {
        beforeEach((): void => {
          message = `-help`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the help command starting with !`, (): void => {
        beforeEach((): void => {
          message = `!help`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the help command starting with @ and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `@help dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the help command starting with - and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `-help dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the help command starting with ! and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `!help dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut help command starting with @`, (): void => {
        beforeEach((): void => {
          message = `@h`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut help command starting with -`, (): void => {
        beforeEach((): void => {
          message = `-h`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut help command starting with !`, (): void => {
        beforeEach((): void => {
          message = `!h`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut help command starting with @ and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `@h dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut help command starting with - and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `-h dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut help command starting with ! and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `!h dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the help command starting uppercase with @`, (): void => {
        beforeEach((): void => {
          message = `@HELP`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the help command uppercase starting with -`, (): void => {
        beforeEach((): void => {
          message = `-HELP`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the help command uppercase starting with !`, (): void => {
        beforeEach((): void => {
          message = `!HELP`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the help command uppercase starting with @ and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `@HELP dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the help command uppercase starting with - and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `-HELP dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the help command uppercase starting with ! and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `!HELP dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut help command starting uppercase with @`, (): void => {
        beforeEach((): void => {
          message = `@H`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut help command uppercase starting with -`, (): void => {
        beforeEach((): void => {
          message = `-H`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut help command uppercase starting with !`, (): void => {
        beforeEach((): void => {
          message = `!H`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut help command uppercase starting with @ and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `@H dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut help command uppercase starting with - and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `-H dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut help command uppercase starting with ! and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `!H dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });
    });

    describe(`when the message command prefix is "-" or "!"`, (): void => {
      beforeEach((): void => {
        discordMessageConfigServiceGetMessageCommandPrefixSpy.mockReturnValue([
          `-`,
          `!`,
        ]);
      });

      describe(`when the given message is an empty string`, (): void => {
        beforeEach((): void => {
          message = ``;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message without a command`, (): void => {
        beforeEach((): void => {
          message = `hello world`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with another command starting with @`, (): void => {
        beforeEach((): void => {
          message = `@version`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with another command starting with -`, (): void => {
        beforeEach((): void => {
          message = `-version`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with another command starting with !`, (): void => {
        beforeEach((): void => {
          message = `!version`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost help command starting with @`, (): void => {
        beforeEach((): void => {
          message = `@hel`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost help command starting with -`, (): void => {
        beforeEach((): void => {
          message = `-hel`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost help command starting with !`, (): void => {
        beforeEach((): void => {
          message = `!hel`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost help command starting with @ and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `@hel dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost help command starting with - and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `-hel dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost help command starting with ! and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `!hel dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the help command starting with @`, (): void => {
        beforeEach((): void => {
          message = `@help`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the help command starting with -`, (): void => {
        beforeEach((): void => {
          message = `-help`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the help command starting with !`, (): void => {
        beforeEach((): void => {
          message = `!help`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the help command starting with @ and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `@help dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the help command starting with - and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `-help dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the help command starting with ! and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `!help dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the help command uppercase starting with @`, (): void => {
        beforeEach((): void => {
          message = `@HELP`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the help command uppercase starting with -`, (): void => {
        beforeEach((): void => {
          message = `-HELP`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the help command uppercase starting with !`, (): void => {
        beforeEach((): void => {
          message = `!HELP`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the help command uppercase starting with @ and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `@HELP dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the help command uppercase starting with - and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `-HELP dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the help command uppercase starting with ! and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `!HELP dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut help command starting with @`, (): void => {
        beforeEach((): void => {
          message = `@h`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut help command starting with -`, (): void => {
        beforeEach((): void => {
          message = `-h`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut help command starting with !`, (): void => {
        beforeEach((): void => {
          message = `!h`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut help command starting with @ and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `@h dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut help command starting with - and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `-h dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut help command starting with ! and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `!h dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut help command uppercase starting with @`, (): void => {
        beforeEach((): void => {
          message = `@H`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut help command uppercase starting with -`, (): void => {
        beforeEach((): void => {
          message = `-H`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut help command uppercase starting with !`, (): void => {
        beforeEach((): void => {
          message = `!H`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut help command uppercase starting with @ and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `@H dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut help command uppercase starting with - and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `-H dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut help command uppercase starting with ! and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `!H dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });
    });
  });
});
