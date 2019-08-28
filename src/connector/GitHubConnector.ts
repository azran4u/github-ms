import { Config, ApiMethod, IConfig } from '../config';
import {
  GitHubGraphQlV4,
  GitHubRestApiV3,
  IGitHubConnector
} from '../connector';
import { User } from '../model';

export class GitHubConnector {
  private config: IConfig;
  constructor() {
    this.config = Config.getConfig();
  }
  public getUser(): Promise<User> {
    const connector: IGitHubConnector =
      this.config.github_connector.apiMethod === ApiMethod.GRAPHQLv4
        ? new GitHubGraphQlV4()
        : new GitHubRestApiV3();
    connector.setCredentials(this.config.github_connector.credentials);
    return connector.fetchUser();
  }
}
