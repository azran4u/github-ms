export abstract class ILogger {
  public constructor(protected label: string) {}
  public abstract info(message: string): void;
  public abstract debug(object: any): void;
  public abstract error(message: string): void;
}
