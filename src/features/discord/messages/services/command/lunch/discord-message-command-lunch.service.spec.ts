import {
  MessageEmbedAuthor,
  MessageEmbedFooter,
  MessageEmbedThumbnail,
} from "discord.js";
import moment from "moment-timezone";
import { createMock } from "ts-auto-mock";
import { ColorEnum } from "../../../../../../enums/color.enum";
import { IconEnum } from "../../../../../../enums/icon.enum";
import { ServiceNameEnum } from "../../../../../../enums/service-name.enum";
import * as GetRandomValueFromEnumModule from "../../../../../../functions/randoms/get-random-value-from-enum";
import { CoreEventService } from "../../../../../core/services/core-event.service";
import { ILoggerLog } from "../../../../../logger/interfaces/logger-log";
import { LoggerService } from "../../../../../logger/services/logger.service";
import { DiscordSoniaService } from "../../../../users/services/discord-sonia.service";
import { DiscordMessageCommandLunchDescriptionEnum } from "../../../enums/command/lunch/discord-message-command-lunch-description.enum";
import { DiscordMessageCommandLunchTitleEnum } from "../../../enums/command/lunch/discord-message-command-lunch-title.enum";
import { IDiscordMessageResponse } from "../../../interfaces/discord-message-response";
import { IAnyDiscordMessage } from "../../../types/any-discord-message";
import { DiscordMessageConfigService } from "../../config/discord-message-config.service";
import { DiscordMessageCommandLunchService } from "./discord-message-command-lunch.service";

jest.mock(`../../../../../logger/services/chalk/chalk.service`);

describe(`DiscordMessageCommandLunchService`, (): void => {
  let service: DiscordMessageCommandLunchService;
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
    it(`should create a DiscordMessageCommandLunch service`, (): void => {
      expect.assertions(1);

      service = DiscordMessageCommandLunchService.getInstance();

      expect(service).toStrictEqual(
        expect.any(DiscordMessageCommandLunchService)
      );
    });

    it(`should return the created DiscordMessageCommandLunch service`, (): void => {
      expect.assertions(1);

      const result = DiscordMessageCommandLunchService.getInstance();

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

    it(`should notify the DiscordMessageCommandLunch service creation`, (): void => {
      expect.assertions(2);

      service = new DiscordMessageCommandLunchService();

      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledTimes(1);
      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledWith(
        ServiceNameEnum.DISCORD_MESSAGE_COMMAND_LUNCH_SERVICE
      );
    });
  });

  describe(`handleResponse()`, (): void => {
    let anyDiscordMessage: IAnyDiscordMessage;
    let discordMessageResponse: IDiscordMessageResponse;

    let loggerServiceDebugSpy: jest.SpyInstance;
    let getMessageResponseSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageCommandLunchService();
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
        context: `DiscordMessageCommandLunchService`,
        extendedContext: true,
        message: `context-[dummy-id] text-lunch command detected`,
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
    let discordMessageConfigServiceGetMessageCommandLunchImageColorSpy: jest.SpyInstance;
    let discordSoniaServiceGetImageUrlSpy: jest.SpyInstance;
    let discordMessageConfigServiceGetMessageCommandLunchImageUrlSpy: jest.SpyInstance;
    let getRandomValueFromEnumSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = new DiscordMessageCommandLunchService();

      discordSoniaServiceGetCorporationMessageEmbedAuthorSpy = jest.spyOn(
        discordSoniaService,
        `getCorporationMessageEmbedAuthor`
      );
      discordMessageConfigServiceGetMessageCommandLunchImageColorSpy = jest.spyOn(
        discordMessageConfigService,
        `getMessageCommandLunchImageColor`
      );
      discordSoniaServiceGetImageUrlSpy = jest.spyOn(
        discordSoniaService,
        `getImageUrl`
      );
      discordMessageConfigServiceGetMessageCommandLunchImageUrlSpy = jest.spyOn(
        discordMessageConfigService,
        `getMessageCommandLunchImageUrl`
      );
      getRandomValueFromEnumSpy = jest.spyOn(
        GetRandomValueFromEnumModule,
        `getRandomValueFromEnum`
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
      discordMessageConfigServiceGetMessageCommandLunchImageColorSpy.mockReturnValue(
        ColorEnum.CANDY
      );

      const result = service.getMessageResponse();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(result.options.embed.color).toStrictEqual(ColorEnum.CANDY);
    });

    it(`should return a Discord message response embed with a description`, (): void => {
      expect.assertions(1);
      getRandomValueFromEnumSpy.mockReturnValue(
        DiscordMessageCommandLunchDescriptionEnum.I_WAS_STARVING
      );

      const result = service.getMessageResponse();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(result.options.embed.description).toStrictEqual(`I was starving.`);
    });

    describe(`when the description can not be found inside the random lunch descriptions`, (): void => {
      beforeEach((): void => {
        getRandomValueFromEnumSpy.mockReturnValue(undefined);
      });

      it(`should return a Discord message response embed with a description`, (): void => {
        expect.assertions(1);

        const result = service.getMessageResponse();

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(result.options.embed.description).toStrictEqual(`Cool.`);
      });
    });

    it(`should return a Discord message response embed with a footer containing an icon and a text`, (): void => {
      expect.assertions(1);
      discordSoniaServiceGetImageUrlSpy.mockReturnValue(`dummy-image-url`);

      const result = service.getMessageResponse();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(result.options.embed.footer).toStrictEqual({
        iconURL: `dummy-image-url`,
        text: `Bon appétit`,
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
          text: `Bon appétit`,
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
          text: `Bon appétit`,
        } as MessageEmbedFooter);
      });
    });

    it(`should return a Discord message response embed with a thumbnail`, (): void => {
      expect.assertions(1);
      discordMessageConfigServiceGetMessageCommandLunchImageUrlSpy.mockReturnValue(
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
      getRandomValueFromEnumSpy.mockReturnValue(
        DiscordMessageCommandLunchTitleEnum.TIME_TO_EAT
      );

      const result = service.getMessageResponse();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(result.options.embed.title).toStrictEqual(`Time to eat!`);
    });

    describe(`when the title can not be found inside the random lunch titles`, (): void => {
      beforeEach((): void => {
        getRandomValueFromEnumSpy.mockReturnValue(undefined);
      });

      it(`should return a Discord message response embed with a title`, (): void => {
        expect.assertions(1);

        const result = service.getMessageResponse();

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(result.options.embed.title).toStrictEqual(`Lunch time!`);
      });
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
      service = new DiscordMessageCommandLunchService();
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

      describe(`when the given message is a message with an almost lunch command starting with @`, (): void => {
        beforeEach((): void => {
          message = `@lun`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost lunch command starting with -`, (): void => {
        beforeEach((): void => {
          message = `-lun`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost lunch command starting with !`, (): void => {
        beforeEach((): void => {
          message = `!lun`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost lunch command starting with @ and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `@lun dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost lunch command starting with - and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `-lun dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost lunch command starting with ! and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `!lun dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the lunch command starting with @`, (): void => {
        beforeEach((): void => {
          message = `@lunch`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the lunch command starting with -`, (): void => {
        beforeEach((): void => {
          message = `-lunch`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the lunch command starting with !`, (): void => {
        beforeEach((): void => {
          message = `!lunch`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the lunch command starting with @ and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `@lunch dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the lunch command starting with - and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `-lunch dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the lunch command starting with ! and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `!lunch dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command starting with @`, (): void => {
        beforeEach((): void => {
          message = `@l`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command starting with -`, (): void => {
        beforeEach((): void => {
          message = `-l`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command starting with !`, (): void => {
        beforeEach((): void => {
          message = `!l`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command starting with @ and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `@l dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command starting with - and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `-l dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command starting with ! and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `!l dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the lunch command starting uppercase with @`, (): void => {
        beforeEach((): void => {
          message = `@LUNCH`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the lunch command uppercase starting with -`, (): void => {
        beforeEach((): void => {
          message = `-LUNCH`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the lunch command uppercase starting with !`, (): void => {
        beforeEach((): void => {
          message = `!LUNCH`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the lunch command uppercase starting with @ and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `@LUNCH dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the lunch command uppercase starting with - and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `-LUNCH dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the lunch command uppercase starting with ! and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `!LUNCH dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command starting uppercase with @`, (): void => {
        beforeEach((): void => {
          message = `@L`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command uppercase starting with -`, (): void => {
        beforeEach((): void => {
          message = `-L`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command uppercase starting with !`, (): void => {
        beforeEach((): void => {
          message = `!L`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command uppercase starting with @ and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `@L dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command uppercase starting with - and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `-L dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command uppercase starting with ! and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `!L dummy`;
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

      describe(`when the given message is a message with an almost lunch command starting with @`, (): void => {
        beforeEach((): void => {
          message = `@lun`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost lunch command starting with -`, (): void => {
        beforeEach((): void => {
          message = `-lun`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost lunch command starting with !`, (): void => {
        beforeEach((): void => {
          message = `!lun`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost lunch command starting with @ and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `@lun dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost lunch command starting with - and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `-lun dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with an almost lunch command starting with ! and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `!lun dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the lunch command starting with @`, (): void => {
        beforeEach((): void => {
          message = `@lunch`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the lunch command starting with -`, (): void => {
        beforeEach((): void => {
          message = `-lunch`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the lunch command starting with !`, (): void => {
        beforeEach((): void => {
          message = `!lunch`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the lunch command starting with @ and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `@lunch dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the lunch command starting with - and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `-lunch dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the lunch command starting with ! and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `!lunch dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the lunch command uppercase starting with @`, (): void => {
        beforeEach((): void => {
          message = `@LUNCH`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the lunch command uppercase starting with -`, (): void => {
        beforeEach((): void => {
          message = `-LUNCH`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the lunch command uppercase starting with !`, (): void => {
        beforeEach((): void => {
          message = `!LUNCH`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the lunch command uppercase starting with @ and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `@LUNCH dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the lunch command uppercase starting with - and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `-LUNCH dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the lunch command uppercase starting with ! and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `!LUNCH dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command starting with @`, (): void => {
        beforeEach((): void => {
          message = `@l`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command starting with -`, (): void => {
        beforeEach((): void => {
          message = `-l`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command starting with !`, (): void => {
        beforeEach((): void => {
          message = `!l`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command starting with @ and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `@l dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command starting with - and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `-l dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command starting with ! and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `!l dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command uppercase starting with @`, (): void => {
        beforeEach((): void => {
          message = `@L`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command uppercase starting with -`, (): void => {
        beforeEach((): void => {
          message = `-L`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command uppercase starting with !`, (): void => {
        beforeEach((): void => {
          message = `!L`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command uppercase starting with @ and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `@L dummy`;
        });

        it(`should return false`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(false);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command uppercase starting with - and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `-L dummy`;
        });

        it(`should return true`, (): void => {
          expect.assertions(1);

          const hasCommandResult = service.hasCommand(message);

          expect(hasCommandResult).toStrictEqual(true);
        });
      });

      describe(`when the given message is a message with the shortcut lunch command uppercase starting with ! and have more text after that`, (): void => {
        beforeEach((): void => {
          message = `!L dummy`;
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
