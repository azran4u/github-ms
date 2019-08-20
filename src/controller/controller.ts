import { Config, ApiMethod, IConfig } from '../config';
import {
  GitHubGraphQlV4,
  GitHubRestApiV3,
  IGitHubConnector,
} from '../connector';
import { Logger, ILogger } from '../logger';

export class Controller {
  public static init(): void {
    const config = Config.getConfig();
    const logger: ILogger = new Logger('controller:init');
    const connector: IGitHubConnector =
      config.github_connector.apiMethod === ApiMethod.GRAPHQLv4
        ? new GitHubGraphQlV4()
        : new GitHubRestApiV3();
    connector.setCredentials(config.github_connector.credentials);
    connector
      .fetchUser()
      .then((user) => {
        logger.info('fetch user succeeded');
        logger.debug(user);
      })
      .catch((error) => {
        logger.error(`fetch user failed. ${(error as Error).message}`);
        logger.debug(error);
      });
  }
}
