import { Message } from "discord.js";
import { createMock } from "ts-auto-mock";
import { ServiceNameEnum } from "../../../../../enums/service-name.enum";
import { CoreEventService } from "../../../../core/services/core-event.service";
import { IDiscordMessageResponse } from "../../interfaces/discord-message-response";
import { DiscordMessageConfigService } from "../config/discord-message-config.service";
import { DiscordMessageCommandCookieService } from "./cookie/discord-message-command-cookie.service";
import { DiscordMessageCommandService } from "./discord-message-command.service";
import { DiscordMessageCommandErrorService } from "./error/discord-message-command-error.service";
import { DiscordMessageCommandFeatureService } from "./feature/discord-message-command-feature.service";
import { DiscordMessageCommandHelpService } from "./help/discord-message-command-help.service";
import { DiscordMessageCommandLunchService } from "./lunch/discord-message-command-lunch.service";
import { DiscordMessageCommandReleaseNotesService } from "./release-notes/discord-message-command-release-notes.service";
import { DiscordMessageCommandVersionService } from "./version/discord-message-command-version.service";

describe(`DiscordMessageCommandService`, (): void => {
  let service: DiscordMessageCommandService;
  let discordMessageCommandVersionService: DiscordMessageCommandVersionService;
  let discordMessageCommandErrorService: DiscordMessageCommandErrorService;
  let discordMessageCommandHelpService: DiscordMessageCommandHelpService;
  let discordMessageCommandCookieService: DiscordMessageCommandCookieService;
  let discordMessageCommandLunchService: DiscordMessageCommandLunchService;
  let discordMessageCommandReleaseNotesService: DiscordMessageCommandReleaseNotesService;
  let discordMessageCommandFeatureService: DiscordMessageCommandFeatureService;
  let discordMessageConfigService: DiscordMessageConfigService;
  let coreEventService: CoreEventService;

  let discordMessageConfigServiceGetMessageCommandPrefixSpy: jest.SpyInstance;

  beforeEach((): void => {
    discordMessageCommandVersionService = DiscordMessageCommandVersionService.getInstance();
    discordMessageCommandErrorService = DiscordMessageCommandErrorService.getInstance();
    discordMessageCommandHelpService = DiscordMessageCommandHelpService.getInstance();
    discordMessageCommandCookieService = DiscordMessageCommandCookieService.getInstance();
    discordMessageCommandLunchService = DiscordMessageCommandLunchService.getInstance();
    discordMessageCommandReleaseNotesService = DiscordMessageCommandReleaseNotesService.getInstance();
    discordMessageCommandFeatureService = DiscordMessageCommandFeatureService.getInstance();
    discordMessageConfigService = DiscordMessageConfigService.getInstance();
    coreEventService = CoreEventService.getInstance();

    discordMessageConfigServiceGetMessageCommandPrefixSpy = jest
      .spyOn(discordMessageConfigService, `getMessageCommandPrefix`)
      .mockImplementation();
  });

  describe(`getInstance()`, (): void => {
    it(`should create a DiscordMessageCommand service`, (): void => {
      expect.assertions(1);

      service = DiscordMessageCommandService.getInstance();

      expect(service).toStrictEqual(expect.any(DiscordMessageCommandService));
    });

    it(`should return the created DiscordMessageCommand service`, (): void => {
      expect.assertions(1);

      const result = DiscordMessageCommandService.getInstance();

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

    it(`should notify the DiscordMessageCommand service creation`, (): void => {
      expect.assertions(2);

      service = new DiscordMessageCommandService();

      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledTimes(1);
      expect(coreEventServiceNotifyServiceCreatedSpy).toHaveBeenCalledWith(
        ServiceNameEnum.DISCORD_MESSAGE_COMMAND_SERVICE
      );
    });
  });

  describe(`hasCommand()`, (): void => {
    let message: string;

    beforeEach((): void => {
      service = DiscordMessageCommandService.getInstance();
      message = `dummy-message`;

      discordMessageConfigServiceGetMessageCommandPrefixSpy.mockReturnValue(
        `-`
      );
    });

    describe(`when the given message does not contains a command`, (): void => {
      beforeEach((): void => {
        message = `dummy-message`;
      });

      it(`should return false`, (): void => {
        expect.assertions(1);

        const hasCommandResult = service.hasCommand(message);

        expect(hasCommandResult).toStrictEqual(false);
      });
    });

    describe(`when the given message does not contains a command and has multiple prefixes`, (): void => {
      beforeEach((): void => {
        discordMessageConfigServiceGetMessageCommandPrefixSpy.mockReturnValue([
          `-`,
          `!`,
        ]);

        message = `dummy-message`;
      });

      it(`should return false`, (): void => {
        expect.assertions(1);

        const hasCommandResult = service.hasCommand(message);

        expect(hasCommandResult).toStrictEqual(false);
      });
    });

    describe(`when the given message does not contains a command and has an invalid prefix`, (): void => {
      beforeEach((): void => {
        discordMessageConfigServiceGetMessageCommandPrefixSpy.mockReturnValue(
          undefined
        );

        message = `dummy-message`;
      });

      it(`should return false`, (): void => {
        expect.assertions(1);

        const hasCommandResult = service.hasCommand(message);

        expect(hasCommandResult).toStrictEqual(false);
      });
    });

    describe(`when the given message contains the version command`, (): void => {
      beforeEach((): void => {
        message = `-version`;
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const hasCommandResult = service.hasCommand(message);

        expect(hasCommandResult).toStrictEqual(true);
      });
    });

    describe(`when the given message contains the shortcut version command`, (): void => {
      beforeEach((): void => {
        message = `-v`;
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const hasCommandResult = service.hasCommand(message);

        expect(hasCommandResult).toStrictEqual(true);
      });
    });

    describe(`when the given message contains the error command`, (): void => {
      beforeEach((): void => {
        message = `-error`;
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const hasCommandResult = service.hasCommand(message);

        expect(hasCommandResult).toStrictEqual(true);
      });
    });

    describe(`when the given message contains the bug command`, (): void => {
      beforeEach((): void => {
        message = `-bug`;
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const hasCommandResult = service.hasCommand(message);

        expect(hasCommandResult).toStrictEqual(true);
      });
    });

    describe(`when the given message contains the help command`, (): void => {
      beforeEach((): void => {
        message = `-help`;
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const hasCommandResult = service.hasCommand(message);

        expect(hasCommandResult).toStrictEqual(true);
      });
    });

    describe(`when the given message contains the shortcut help command`, (): void => {
      beforeEach((): void => {
        message = `-h`;
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const hasCommandResult = service.hasCommand(message);

        expect(hasCommandResult).toStrictEqual(true);
      });
    });

    describe(`when the given message contains the cookie command`, (): void => {
      beforeEach((): void => {
        message = `-cookie`;
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const hasCommandResult = service.hasCommand(message);

        expect(hasCommandResult).toStrictEqual(true);
      });
    });

    describe(`when the given message contains the alias "cookies" cookie command`, (): void => {
      beforeEach((): void => {
        message = `-cookies`;
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const hasCommandResult = service.hasCommand(message);

        expect(hasCommandResult).toStrictEqual(true);
      });
    });

    describe(`when the given message contains the shortcut cookie command`, (): void => {
      beforeEach((): void => {
        message = `-c`;
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const hasCommandResult = service.hasCommand(message);

        expect(hasCommandResult).toStrictEqual(true);
      });
    });

    describe(`when the given message contains the lunch command`, (): void => {
      beforeEach((): void => {
        message = `-lunch`;
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const hasCommandResult = service.hasCommand(message);

        expect(hasCommandResult).toStrictEqual(true);
      });
    });

    describe(`when the given message contains the shortcut lunch command`, (): void => {
      beforeEach((): void => {
        message = `-l`;
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const hasCommandResult = service.hasCommand(message);

        expect(hasCommandResult).toStrictEqual(true);
      });
    });

    describe(`when the given message contains the release notes command`, (): void => {
      beforeEach((): void => {
        message = `-release-notes`;
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const hasCommandResult = service.hasCommand(message);

        expect(hasCommandResult).toStrictEqual(true);
      });
    });

    describe(`when the given message contains the shortcut release notes command`, (): void => {
      beforeEach((): void => {
        message = `-r`;
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const hasCommandResult = service.hasCommand(message);

        expect(hasCommandResult).toStrictEqual(true);
      });
    });

    describe(`when the given message contains the feature command`, (): void => {
      beforeEach((): void => {
        message = `-feature`;
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const hasCommandResult = service.hasCommand(message);

        expect(hasCommandResult).toStrictEqual(true);
      });
    });

    describe(`when the given message contains the shortcut feature command`, (): void => {
      beforeEach((): void => {
        message = `-f`;
      });

      it(`should return true`, (): void => {
        expect.assertions(1);

        const hasCommandResult = service.hasCommand(message);

        expect(hasCommandResult).toStrictEqual(true);
      });
    });
  });

  describe(`handleVersionCommand()`, (): void => {
    let anyDiscordMessage: Message;
    let discordMessageResponse: IDiscordMessageResponse;

    let discordMessageCommandVersionServiceHandleResponseSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = DiscordMessageCommandService.getInstance();
      anyDiscordMessage = createMock<Message>();
      discordMessageResponse = createMock<IDiscordMessageResponse>();

      discordMessageCommandVersionServiceHandleResponseSpy = jest
        .spyOn(discordMessageCommandVersionService, `handleResponse`)
        .mockReturnValue(discordMessageResponse);
    });

    it(`should handle the message command version`, (): void => {
      expect.assertions(2);

      service.handleVersionCommand(anyDiscordMessage);

      expect(
        discordMessageCommandVersionServiceHandleResponseSpy
      ).toHaveBeenCalledTimes(1);
      expect(
        discordMessageCommandVersionServiceHandleResponseSpy
      ).toHaveBeenCalledWith(anyDiscordMessage);
    });

    it(`should return a message response`, (): void => {
      expect.assertions(1);

      const result = service.handleVersionCommand(anyDiscordMessage);

      expect(result).toStrictEqual(discordMessageResponse);
    });
  });

  describe(`handleErrorCommand()`, (): void => {
    let anyDiscordMessage: Message;
    let discordMessageResponse: IDiscordMessageResponse;

    let discordMessageCommandErrorServiceHandleResponseSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = DiscordMessageCommandService.getInstance();
      anyDiscordMessage = createMock<Message>();
      discordMessageResponse = createMock<IDiscordMessageResponse>();

      discordMessageCommandErrorServiceHandleResponseSpy = jest
        .spyOn(discordMessageCommandErrorService, `handleResponse`)
        .mockReturnValue(discordMessageResponse);
    });

    it(`should handle the message command error`, (): void => {
      expect.assertions(2);

      service.handleErrorCommand(anyDiscordMessage);

      expect(
        discordMessageCommandErrorServiceHandleResponseSpy
      ).toHaveBeenCalledTimes(1);
      expect(
        discordMessageCommandErrorServiceHandleResponseSpy
      ).toHaveBeenCalledWith(anyDiscordMessage);
    });

    it(`should return a message response`, (): void => {
      expect.assertions(1);

      const result = service.handleErrorCommand(anyDiscordMessage);

      expect(result).toStrictEqual(discordMessageResponse);
    });
  });

  describe(`handleHelpCommand()`, (): void => {
    let anyDiscordMessage: Message;
    let discordMessageResponse: IDiscordMessageResponse;

    let discordMessageCommandHelpServiceHandleResponseSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = DiscordMessageCommandService.getInstance();
      anyDiscordMessage = createMock<Message>();
      discordMessageResponse = createMock<IDiscordMessageResponse>();

      discordMessageCommandHelpServiceHandleResponseSpy = jest
        .spyOn(discordMessageCommandHelpService, `handleResponse`)
        .mockReturnValue(discordMessageResponse);
    });

    it(`should handle the message command help`, (): void => {
      expect.assertions(2);

      service.handleHelpCommand(anyDiscordMessage);

      expect(
        discordMessageCommandHelpServiceHandleResponseSpy
      ).toHaveBeenCalledTimes(1);
      expect(
        discordMessageCommandHelpServiceHandleResponseSpy
      ).toHaveBeenCalledWith(anyDiscordMessage);
    });

    it(`should return a message response`, (): void => {
      expect.assertions(1);

      const result = service.handleHelpCommand(anyDiscordMessage);

      expect(result).toStrictEqual(discordMessageResponse);
    });
  });

  describe(`handleCookieCommand()`, (): void => {
    let anyDiscordMessage: Message;
    let discordMessageResponse: IDiscordMessageResponse;

    let discordMessageCommandCookieServiceResponseSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = DiscordMessageCommandService.getInstance();
      anyDiscordMessage = createMock<Message>();
      discordMessageResponse = createMock<IDiscordMessageResponse>();

      discordMessageCommandCookieServiceResponseSpy = jest
        .spyOn(discordMessageCommandCookieService, `handleResponse`)
        .mockReturnValue(discordMessageResponse);
    });

    it(`should handle the message command cookie`, (): void => {
      expect.assertions(2);

      service.handleCookieCommand(anyDiscordMessage);

      expect(
        discordMessageCommandCookieServiceResponseSpy
      ).toHaveBeenCalledTimes(1);
      expect(
        discordMessageCommandCookieServiceResponseSpy
      ).toHaveBeenCalledWith(anyDiscordMessage);
    });

    it(`should return a message response`, (): void => {
      expect.assertions(1);

      const result = service.handleCookieCommand(anyDiscordMessage);

      expect(result).toStrictEqual(discordMessageResponse);
    });
  });

  describe(`handleLunchCommand()`, (): void => {
    let anyDiscordMessage: Message;
    let discordMessageResponse: IDiscordMessageResponse;

    let discordMessageCommandLunchServiceResponseSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = DiscordMessageCommandService.getInstance();
      anyDiscordMessage = createMock<Message>();
      discordMessageResponse = createMock<IDiscordMessageResponse>();

      discordMessageCommandLunchServiceResponseSpy = jest
        .spyOn(discordMessageCommandLunchService, `handleResponse`)
        .mockReturnValue(discordMessageResponse);
    });

    it(`should handle the message command lunch`, (): void => {
      expect.assertions(2);

      service.handleLunchCommand(anyDiscordMessage);

      expect(
        discordMessageCommandLunchServiceResponseSpy
      ).toHaveBeenCalledTimes(1);
      expect(discordMessageCommandLunchServiceResponseSpy).toHaveBeenCalledWith(
        anyDiscordMessage
      );
    });

    it(`should return a message response`, (): void => {
      expect.assertions(1);

      const result = service.handleLunchCommand(anyDiscordMessage);

      expect(result).toStrictEqual(discordMessageResponse);
    });
  });

  describe(`handleReleaseNotesCommand()`, (): void => {
    let anyDiscordMessage: Message;
    let discordMessageResponse: IDiscordMessageResponse;

    let discordMessageCommandReleaseNotesServiceResponseSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = DiscordMessageCommandService.getInstance();
      anyDiscordMessage = createMock<Message>();
      discordMessageResponse = createMock<IDiscordMessageResponse>();

      discordMessageCommandReleaseNotesServiceResponseSpy = jest
        .spyOn(discordMessageCommandReleaseNotesService, `handleResponse`)
        .mockReturnValue(discordMessageResponse);
    });

    it(`should handle the message command release notes`, (): void => {
      expect.assertions(2);

      service.handleReleaseNotesCommand(anyDiscordMessage);

      expect(
        discordMessageCommandReleaseNotesServiceResponseSpy
      ).toHaveBeenCalledTimes(1);
      expect(
        discordMessageCommandReleaseNotesServiceResponseSpy
      ).toHaveBeenCalledWith(anyDiscordMessage);
    });

    it(`should return a message response`, (): void => {
      expect.assertions(1);

      const result = service.handleReleaseNotesCommand(anyDiscordMessage);

      expect(result).toStrictEqual(discordMessageResponse);
    });
  });

  describe(`handleFeatureCommand()`, (): void => {
    let anyDiscordMessage: Message;
    let discordMessageResponse: IDiscordMessageResponse;

    let discordMessageCommandFeatureServiceResponseSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = DiscordMessageCommandService.getInstance();
      anyDiscordMessage = createMock<Message>();
      discordMessageResponse = createMock<IDiscordMessageResponse>();

      discordMessageCommandFeatureServiceResponseSpy = jest
        .spyOn(discordMessageCommandFeatureService, `handleResponse`)
        .mockReturnValue(discordMessageResponse);
    });

    it(`should handle the message command feature`, (): void => {
      expect.assertions(2);

      service.handleFeatureCommand(anyDiscordMessage);

      expect(
        discordMessageCommandFeatureServiceResponseSpy
      ).toHaveBeenCalledTimes(1);
      expect(
        discordMessageCommandFeatureServiceResponseSpy
      ).toHaveBeenCalledWith(anyDiscordMessage);
    });

    it(`should return a message response`, (): void => {
      expect.assertions(1);

      const result = service.handleFeatureCommand(anyDiscordMessage);

      expect(result).toStrictEqual(discordMessageResponse);
    });
  });

  describe(`handleCommands()`, (): void => {
    let anyDiscordMessage: Message;
    let discordMessageResponse: IDiscordMessageResponse;

    let discordMessageCommandVersionServiceHandleResponseSpy: jest.SpyInstance;
    let discordMessageCommandErrorServiceHandleResponseSpy: jest.SpyInstance;
    let discordMessageCommandHelpServiceHandleResponseSpy: jest.SpyInstance;
    let discordMessageCommandCookieServiceHandleResponseSpy: jest.SpyInstance;
    let discordMessageCommandLunchServiceHandleResponseSpy: jest.SpyInstance;
    let discordMessageCommandReleaseNotesServiceHandleResponseSpy: jest.SpyInstance;
    let discordMessageCommandFeatureServiceHandleResponseSpy: jest.SpyInstance;

    beforeEach((): void => {
      service = DiscordMessageCommandService.getInstance();
      anyDiscordMessage = createMock<Message>();
      discordMessageResponse = createMock<IDiscordMessageResponse>();

      discordMessageConfigServiceGetMessageCommandPrefixSpy.mockReturnValue(
        `-`
      );
      discordMessageCommandVersionServiceHandleResponseSpy = jest
        .spyOn(discordMessageCommandVersionService, `handleResponse`)
        .mockReturnValue(discordMessageResponse);
      discordMessageCommandErrorServiceHandleResponseSpy = jest
        .spyOn(discordMessageCommandErrorService, `handleResponse`)
        .mockReturnValue(discordMessageResponse);
      discordMessageCommandHelpServiceHandleResponseSpy = jest
        .spyOn(discordMessageCommandHelpService, `handleResponse`)
        .mockReturnValue(discordMessageResponse);
      discordMessageCommandCookieServiceHandleResponseSpy = jest
        .spyOn(discordMessageCommandCookieService, `handleResponse`)
        .mockReturnValue(discordMessageResponse);
      discordMessageCommandLunchServiceHandleResponseSpy = jest
        .spyOn(discordMessageCommandLunchService, `handleResponse`)
        .mockReturnValue(discordMessageResponse);
      discordMessageCommandReleaseNotesServiceHandleResponseSpy = jest
        .spyOn(discordMessageCommandReleaseNotesService, `handleResponse`)
        .mockReturnValue(discordMessageResponse);
      discordMessageCommandFeatureServiceHandleResponseSpy = jest
        .spyOn(discordMessageCommandFeatureService, `handleResponse`)
        .mockReturnValue(discordMessageResponse);
    });

    describe(`when the given discord message has no content`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage.content = ``;
      });

      it(`should not handle the version command`, (): void => {
        expect.assertions(1);

        service.handleCommands(anyDiscordMessage);

        expect(
          discordMessageCommandVersionServiceHandleResponseSpy
        ).not.toHaveBeenCalled();
      });

      it(`should not handle the error command`, (): void => {
        expect.assertions(1);

        service.handleCommands(anyDiscordMessage);

        expect(
          discordMessageCommandErrorServiceHandleResponseSpy
        ).not.toHaveBeenCalled();
      });

      it(`should not handle the help command`, (): void => {
        expect.assertions(1);

        service.handleCommands(anyDiscordMessage);

        expect(
          discordMessageCommandHelpServiceHandleResponseSpy
        ).not.toHaveBeenCalled();
      });

      it(`should not handle the cookie command`, (): void => {
        expect.assertions(1);

        service.handleCommands(anyDiscordMessage);

        expect(
          discordMessageCommandCookieServiceHandleResponseSpy
        ).not.toHaveBeenCalled();
      });

      it(`should not handle the lunch command`, (): void => {
        expect.assertions(1);

        service.handleCommands(anyDiscordMessage);

        expect(
          discordMessageCommandLunchServiceHandleResponseSpy
        ).not.toHaveBeenCalled();
      });

      it(`should not handle the release notes command`, (): void => {
        expect.assertions(1);

        service.handleCommands(anyDiscordMessage);

        expect(
          discordMessageCommandReleaseNotesServiceHandleResponseSpy
        ).not.toHaveBeenCalled();
      });

      it(`should not handle the feature command`, (): void => {
        expect.assertions(1);

        service.handleCommands(anyDiscordMessage);

        expect(
          discordMessageCommandFeatureServiceHandleResponseSpy
        ).not.toHaveBeenCalled();
      });

      it(`should return null`, (): void => {
        expect.assertions(1);

        const result = service.handleCommands(anyDiscordMessage);

        expect(result).toBeNull();
      });
    });

    describe(`when the given discord message has content`, (): void => {
      beforeEach((): void => {
        anyDiscordMessage.content = `dummy-content`;
      });

      describe(`when the message does not contains the version command`, (): void => {
        beforeEach((): void => {
          anyDiscordMessage.content = `dummy-content`;
        });

        it(`should not handle the version command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandVersionServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the error command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandErrorServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the help command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandHelpServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the cookie command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandCookieServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the lunch command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandLunchServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the release notes command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandReleaseNotesServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the feature command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandFeatureServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should return null`, (): void => {
          expect.assertions(1);

          const result = service.handleCommands(anyDiscordMessage);

          expect(result).toBeNull();
        });
      });

      describe(`when the message contains the version command`, (): void => {
        beforeEach((): void => {
          anyDiscordMessage.content = `-version`;
        });

        it(`should handle the version command`, (): void => {
          expect.assertions(2);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandVersionServiceHandleResponseSpy
          ).toHaveBeenCalledTimes(1);
          expect(
            discordMessageCommandVersionServiceHandleResponseSpy
          ).toHaveBeenCalledWith(anyDiscordMessage);
        });

        it(`should not handle the error command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandErrorServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the help command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandHelpServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the cookie command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandCookieServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the lunch command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandLunchServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the release notes command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandReleaseNotesServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the feature command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandFeatureServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should return the Discord message response for the version command`, (): void => {
          expect.assertions(1);

          const result = service.handleCommands(anyDiscordMessage);

          expect(result).toStrictEqual(discordMessageResponse);
        });
      });

      describe(`when the message contains the error command`, (): void => {
        beforeEach((): void => {
          anyDiscordMessage.content = `-error`;
        });

        it(`should not handle the version command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandVersionServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should handle the error command`, (): void => {
          expect.assertions(2);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandErrorServiceHandleResponseSpy
          ).toHaveBeenCalledTimes(1);
          expect(
            discordMessageCommandErrorServiceHandleResponseSpy
          ).toHaveBeenCalledWith(anyDiscordMessage);
        });

        it(`should not handle the help command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandHelpServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the cookie command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandCookieServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the lunch command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandLunchServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the release notes command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandReleaseNotesServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the feature command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandFeatureServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should return the Discord message response for the error command`, (): void => {
          expect.assertions(1);

          const result = service.handleCommands(anyDiscordMessage);

          expect(result).toStrictEqual(discordMessageResponse);
        });
      });

      describe(`when the message contains the help command`, (): void => {
        beforeEach((): void => {
          anyDiscordMessage.content = `-help`;
        });

        it(`should not handle the version command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandVersionServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the error command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandErrorServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should handle the help command`, (): void => {
          expect.assertions(2);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandHelpServiceHandleResponseSpy
          ).toHaveBeenCalledTimes(1);
          expect(
            discordMessageCommandHelpServiceHandleResponseSpy
          ).toHaveBeenCalledWith(anyDiscordMessage);
        });

        it(`should not handle the cookie command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandCookieServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the lunch command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandLunchServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the release notes command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandReleaseNotesServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the feature command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandFeatureServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should return the Discord message response for the help command`, (): void => {
          expect.assertions(1);

          const result = service.handleCommands(anyDiscordMessage);

          expect(result).toStrictEqual(discordMessageResponse);
        });
      });

      describe(`when the message contains the cookie command`, (): void => {
        beforeEach((): void => {
          anyDiscordMessage.content = `-cookie`;
        });

        it(`should not handle the version command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandVersionServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the error command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandErrorServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the help command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandHelpServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should handle the cookie command`, (): void => {
          expect.assertions(2);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandCookieServiceHandleResponseSpy
          ).toHaveBeenCalledTimes(1);
          expect(
            discordMessageCommandCookieServiceHandleResponseSpy
          ).toHaveBeenCalledWith(anyDiscordMessage);
        });

        it(`should not handle the lunch command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandLunchServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the release notes command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandReleaseNotesServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the feature command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandFeatureServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should return the Discord message response for the cookie command`, (): void => {
          expect.assertions(1);

          const result = service.handleCommands(anyDiscordMessage);

          expect(result).toStrictEqual(discordMessageResponse);
        });
      });

      describe(`when the message contains the lunch command`, (): void => {
        beforeEach((): void => {
          anyDiscordMessage.content = `-lunch`;
        });

        it(`should not handle the version command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandVersionServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the error command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandErrorServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the help command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandHelpServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the cookie command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandCookieServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should handle the lunch command`, (): void => {
          expect.assertions(2);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandLunchServiceHandleResponseSpy
          ).toHaveBeenCalledTimes(1);
          expect(
            discordMessageCommandLunchServiceHandleResponseSpy
          ).toHaveBeenCalledWith(anyDiscordMessage);
        });

        it(`should not handle the release notes command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandReleaseNotesServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the feature command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandFeatureServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should return the Discord message response for the lunch command`, (): void => {
          expect.assertions(1);

          const result = service.handleCommands(anyDiscordMessage);

          expect(result).toStrictEqual(discordMessageResponse);
        });
      });

      describe(`when the message contains the release notes command`, (): void => {
        beforeEach((): void => {
          anyDiscordMessage.content = `-release-notes`;
        });

        it(`should not handle the version command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandVersionServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the error command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandErrorServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the help command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandHelpServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the cookie command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandCookieServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the lunch command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandLunchServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should handle the release notes command`, (): void => {
          expect.assertions(2);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandReleaseNotesServiceHandleResponseSpy
          ).toHaveBeenCalledTimes(1);
          expect(
            discordMessageCommandReleaseNotesServiceHandleResponseSpy
          ).toHaveBeenCalledWith(anyDiscordMessage);
        });

        it(`should not handle the feature command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandFeatureServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should return the Discord message response for the release notes command`, (): void => {
          expect.assertions(1);

          const result = service.handleCommands(anyDiscordMessage);

          expect(result).toStrictEqual(discordMessageResponse);
        });
      });

      describe(`when the message contains the feature command`, (): void => {
        beforeEach((): void => {
          anyDiscordMessage.content = `-feature`;
        });

        it(`should not handle the version command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandVersionServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the error command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandErrorServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the help command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandHelpServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the cookie command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandCookieServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should not handle the lunch command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandLunchServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should handle the release notes command`, (): void => {
          expect.assertions(1);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandReleaseNotesServiceHandleResponseSpy
          ).not.toHaveBeenCalled();
        });

        it(`should handle the feature command`, (): void => {
          expect.assertions(2);

          service.handleCommands(anyDiscordMessage);

          expect(
            discordMessageCommandFeatureServiceHandleResponseSpy
          ).toHaveBeenCalledTimes(1);
          expect(
            discordMessageCommandFeatureServiceHandleResponseSpy
          ).toHaveBeenCalledWith(anyDiscordMessage);
        });

        it(`should return the Discord message response for the feature command`, (): void => {
          expect.assertions(1);

          const result = service.handleCommands(anyDiscordMessage);

          expect(result).toStrictEqual(discordMessageResponse);
        });
      });
    });
  });
});
