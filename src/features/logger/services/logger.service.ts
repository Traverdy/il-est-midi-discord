import _ from "lodash";
import { ServiceNameEnum } from "../../../enums/service-name.enum";
import { wrapInQuotes } from "../../../functions/formatters/wrap-in-quotes";
import { CoreEventService } from "../../core/services/core-event.service";
import { TimeService } from "../../time/services/time.service";
import { LoggerConfigLevelValueEnum } from "../enums/logger-config-level-value.enum";
import { LoggerConfigLevelEnum } from "../enums/logger-config-level.enum";
import { IJobDateLog } from "../interfaces/job-date-log";
import { ILoggerLog } from "../interfaces/logger-log";
import { ILoggerLogInternal } from "../interfaces/logger-log-internal";
import { ILoggerServiceCreated } from "../interfaces/logger-service-created";
import { ChalkService } from "./chalk/chalk.service";
import { LoggerConfigService } from "./config/logger-config.service";

export class LoggerService {
  private static _instance: LoggerService;

  public static getInstance(): LoggerService {
    if (_.isNil(LoggerService._instance)) {
      LoggerService._instance = new LoggerService();
    }

    return LoggerService._instance;
  }

  private readonly _logPrefix = `● `;
  private readonly _serviceName: ServiceNameEnum =
    ServiceNameEnum.LOGGER_SERVICE;

  public init(): void {
    this._handleServiceCreatedEvent();
    this.serviceCreated({
      service: this._serviceName,
    });
  }

  public error(loggerLog: Readonly<ILoggerLog>): void {
    if (this._isErrorEnabled()) {
      this._log({
        ...loggerLog,
        loggerLogType: LoggerConfigLevelEnum.ERROR,
      });
    }
  }

  public warning(loggerLog: Readonly<ILoggerLog>): void {
    if (this._isWarningEnabled()) {
      this._log({
        ...loggerLog,
        loggerLogType: LoggerConfigLevelEnum.WARNING,
      });
    }
  }

  public success(loggerLog: Readonly<ILoggerLog>): void {
    if (this._isSuccessEnabled()) {
      this._log({
        ...loggerLog,
        loggerLogType: LoggerConfigLevelEnum.SUCCESS,
      });
    }
  }

  public log(loggerLog: Readonly<ILoggerLog>): void {
    if (this._isLogEnabled()) {
      this._log({
        ...loggerLog,
        loggerLogType: LoggerConfigLevelEnum.LOG,
      });
    }
  }

  public debug(loggerLog: Readonly<ILoggerLog>): void {
    if (this._isDebugEnabled()) {
      this._log({
        ...loggerLog,
        loggerLogType: LoggerConfigLevelEnum.DEBUG,
      });
    }
  }

  public serviceCreated(
    loggerServiceCreated: Readonly<ILoggerServiceCreated>
  ): void {
    this.debug({
      context: loggerServiceCreated.service,
      message: ChalkService.getInstance().text(`created`),
    });
  }

  public getStringArray<T = string>(array: Readonly<T[]>): string {
    return `[ ${_.join(
      _.map(array, (value: Readonly<T>): string => {
        return wrapInQuotes<T>(value);
      }),
      `, `
    )} ]`;
  }

  public getValueUpdateWithHint(
    text: Readonly<string>,
    value: Readonly<string>,
    hint: Readonly<string>
  ): string {
    return `${ChalkService.getInstance().text(
      text
    )}${ChalkService.getInstance().value(
      value
    )}${ChalkService.getInstance().hint(hint)}`;
  }

  public getHiddenValueUpdate(
    text: Readonly<string>,
    isStringValue = false
  ): string {
    let value = `********`;

    if (_.isEqual(isStringValue, true)) {
      value = wrapInQuotes(value);
    }

    return this.getValueUpdateWithHint(text, value, ` (hidden)`);
  }

  public getHiddenValueArrayUpdate(
    text: Readonly<string>,
    isStringValue = false
  ): string {
    let value = `********`;

    if (_.isEqual(isStringValue, true)) {
      value = wrapInQuotes(value);
    }

    value = `[ ${value} ]`;

    return this.getValueUpdateWithHint(text, value, ` (hidden)`);
  }

  public getSnowflakeContext(
    context: Readonly<string>,
    message: Readonly<string | null | undefined> | unknown
  ): string {
    return `${ChalkService.getInstance().context(
      `[${context}] `
    )}${ChalkService.getInstance().text(message)}`;
  }

  public logJobDate(jobDateLog: Readonly<IJobDateLog>): void {
    this.debug({
      context: jobDateLog.context,
      message: ChalkService.getInstance().text(
        `${jobDateLog.jobName} job: ${ChalkService.getInstance().value(
          jobDateLog.jobDateHumanized
        )} ${ChalkService.getInstance().hint(`(${jobDateLog.jobDate})`)}`
      ),
    });
  }

  private _log(loggerLogInternal: Readonly<ILoggerLogInternal>): void {
    if (_.isEqual(LoggerConfigService.getInstance().isEnabled(), true)) {
      const logTypePrefix: string = this._getLogTypePrefix(
        loggerLogInternal.loggerLogType
      );

      if (
        _.isString(loggerLogInternal.context) &&
        !_.isEmpty(loggerLogInternal.context)
      ) {
        console.log(
          `${logTypePrefix}${this._context(
            loggerLogInternal.context,
            loggerLogInternal.extendedContext
          )}${loggerLogInternal.message}`
        );
      } else {
        console.log(`${logTypePrefix}${loggerLogInternal.message}`);
      }
    }
  }

  private _context(
    name: Readonly<string>,
    hasExtendedContext: Readonly<boolean> = false
  ): string {
    let message = `[${name}][${TimeService.getInstance().now(`HH:mm:ss:SSS`)}]`;

    if (
      _.isEqual(hasExtendedContext, false) ||
      !_.isBoolean(hasExtendedContext)
    ) {
      message = `${message} `;
    }

    return ChalkService.getInstance().context(message);
  }

  private _getLogTypePrefix(logType: Readonly<LoggerConfigLevelEnum>): string {
    return ChalkService.getInstance()[logType](this._logPrefix);
  }

  private _isErrorEnabled(): boolean {
    return _.gte(
      LoggerConfigLevelValueEnum[LoggerConfigService.getInstance().getLevel()],
      0
    );
  }

  private _isWarningEnabled(): boolean {
    return _.gte(
      LoggerConfigLevelValueEnum[LoggerConfigService.getInstance().getLevel()],
      1
    );
  }

  private _isSuccessEnabled(): boolean {
    return _.gte(
      LoggerConfigLevelValueEnum[LoggerConfigService.getInstance().getLevel()],
      2
    );
  }

  private _isLogEnabled(): boolean {
    return _.gte(
      LoggerConfigLevelValueEnum[LoggerConfigService.getInstance().getLevel()],
      3
    );
  }

  private _isDebugEnabled(): boolean {
    return _.gte(
      LoggerConfigLevelValueEnum[LoggerConfigService.getInstance().getLevel()],
      4
    );
  }

  private _handleServiceCreatedEvent(): void {
    this._logAlreadyCreatedServices();
    this._listenServiceCreatedEvent();
  }

  private _logAlreadyCreatedServices(): void {
    const createdServices: ServiceNameEnum[] = CoreEventService.getInstance().getCreatedServices();

    _.forEach(
      createdServices,
      (createdService: Readonly<ServiceNameEnum>): void => {
        this.serviceCreated({
          service: createdService,
        });
      }
    );
  }

  private _listenServiceCreatedEvent(): void {
    CoreEventService.getInstance()
      .serviceCreated$()
      .subscribe({
        next: (createdService: Readonly<ServiceNameEnum>): void => {
          this.serviceCreated({
            service: createdService,
          });
        },
      });
  }
}
