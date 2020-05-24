import chalk from "chalk";
import _ from "lodash";
import { AbstractService } from "../../../../classes/abstract.service";
import { ServiceNameEnum } from "../../../../enums/service-name.enum";
import { LoggerService } from "../logger.service";
import { ChalkService } from "./chalk.service";

export class ChalkColorService extends AbstractService {
  private static _instance: ChalkColorService;

  public static getInstance(): ChalkColorService {
    if (_.isNil(ChalkColorService._instance)) {
      ChalkColorService._instance = new ChalkColorService();
    }

    return ChalkColorService._instance;
  }

  private readonly _loggerService: LoggerService = LoggerService.getInstance();
  private readonly _chalkService: ChalkService = ChalkService.getInstance();

  public constructor() {
    super(ServiceNameEnum.CHALK_COLOR_SERVICE);
  }

  public init(): void {
    this._logColorLevel();
  }

  private _logColorLevel(): void {
    const chalkLevel: chalk.Level = this._chalkService.getLevel();

    this._loggerService.debug({
      context: this._serviceName,
      message: this._loggerService.getValueUpdateWithHint(
        `chalk color level: `,
        _.toString(chalkLevel),
        ` (${this._getHumanizedColorLevel(chalkLevel)})`
      ),
    });
  }

  private _getHumanizedColorLevel(
    chalkLevel: Readonly<chalk.Level>
  ): string | never {
    if (_.isEqual(chalkLevel, 0)) {
      return `All colors disabled`;
    } else if (_.isEqual(chalkLevel, 1)) {
      return `Basic 16 colors support`;
    } else if (_.isEqual(chalkLevel, 2)) {
      return `ANSI 256 colors support`;
    } else if (_.isEqual(chalkLevel, 3)) {
      return `Truecolor 16 million colors support`;
    }

    throw new Error(`The given chalk level should be between 0 and 3`);
  }
}
