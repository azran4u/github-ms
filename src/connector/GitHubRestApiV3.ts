import * as joi from '@hapi/joi';
import axios, { AxiosRequestConfig } from 'axios';
import { Config, GitHubCredentials, IConfig } from '../config';
import { IGitHubConnector } from '.';
import { Repo, User } from '../model';
import { Logger, ILogger } from '../logger';

export class GitHubRestApiV3 implements IGitHubConnector {
  private axiosConfig: AxiosRequestConfig;
  private config: IConfig;
  private logger: ILogger;

  constructor() {
    this.config = Config.getConfig();
    this.logger = new Logger('GitHubRestApiV3');
    this.axiosConfig = {
      auth: {
        password: this.config.github_connector.credentials.password,
        username: this.config.github_connector.credentials.username,
      },
      baseURL: this.config.github_connector.baseUrl,
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
      maxContentLength: 2 * 1024 * 1024, // 2MB
      responseType: 'json',
      timeout: 5 * 1000, // 5sec
    };
  }

  public setCredentials(credentials: GitHubCredentials): void {
    this.axiosConfig.auth.username = credentials.username;
    this.axiosConfig.auth.password = credentials.password;
  }

  public async fetchUser(): Promise<User> {
    try {
      const user = await this.getUserDetails();
      const repos = await this.getUserRepos();
      user.setRepos(repos);
      this.logger.info('fetched user succeeded');
      this.logger.debug(user);
      return user;
    } catch (error) {
      this.logger.error(`fetch user failed. ${error.response.data.message}`);
      this.logger.debug(error);
      throw new Error('Couldn\'t fetch user');
    }
  }

  private async getUserDetails(): Promise<User> {
    try {
      const data = await axios.get<any>('/user', this.axiosConfig);
      const validated = await this.userInfoInputValidation(data.data);
      const parsed = this.parseUserData(validated);
      this.logger.info('got user details');
      this.logger.debug(parsed);
      return parsed;
    } catch (error) {
      throw error;
    }
  }

  private async getUserRepos(): Promise<Repo[]> {
    try {
      const data = await axios.get<any>(
        `/users/${this.axiosConfig.auth.username}/repos`,
        this.axiosConfig,
      );
      const validated = await this.userReposInputValidation(data);
      const repos: Repo[] = (validated.data as any[]).map((repo: any) => {
        const parsed = this.parseRepoData(repo);
        return parsed;
      });
      this.logger.info('got user repos');
      this.logger.debug(repos);
      return repos;
    } catch (error) {
      throw error;
    }
  }

  private userInfoInputValidation(data: any): joi.ValidationResult<any> {
    const schema = joi.object().keys({
      disk_usage: joi.number().required(),
      node_id: joi.string().required(),
      login: joi.string().required(),
      url: joi
        .string()
        .uri()
        .required(),
    });
    return joi.validate(data, schema, {
      abortEarly: false,
      allowUnknown: true,
      convert: true,
      stripUnknown: true,
    });
  }

  private userReposInputValidation(data: any): joi.ValidationResult<any> {
    const schema = joi.object().keys({
      data: joi
        .array()
        .items(
          joi.object().keys({
            html_url: joi
              .string()
              .uri()
              .required(),
            node_id: joi.string().required(),
            name: joi.string().required(),
            private: joi.boolean().required(),
            size: joi.number().required(),
          }),
        )
        .required(),
    });
    return joi.validate(data, schema, {
      abortEarly: false,
      allowUnknown: true,
      convert: true,
      stripUnknown: true,
    });
  }

  private parseUserData(data: any): User {
    return new User(data.login, data.node_id, data.url, [], data.disk_usage);
  }

  private parseRepoData(data: any): Repo {
    return new Repo(
      data.name,
      data.node_id,
      data.private === 'true' ? true : false,
      data.html_url,
      +data.size,
    );
  }
}
