import * as joi from '@hapi/joi';
import { GraphQLClient } from 'graphql-request';
import { IGitHubConnector } from './IGitHubConnector';
import { User, Repo } from '../model';
import { Config, GitHubCredentials, IConfig } from '../config';
import { Variables } from 'graphql-request/dist/src/types';
import { Logger, ILogger } from '../logger';

export class GitHubGraphQlV4 implements IGitHubConnector {
  private graphQLClient: GraphQLClient;
  private endpoint: string;
  private query: string;
  private variables: Variables;
  private config: IConfig;
  private logger: ILogger;

  constructor() {
    this.config = Config.getConfig();
    this.logger = new Logger('connector:GitHubGraphQlv4');
    this.setCredentials(this.config.github_connector.credentials);
    this.query = /* GraphQL */ `
      query($username: String!, $number_of_repos: Int) {
        user(login: $username) {
          login
          id
          url
          repositories(last: $number_of_repos) {
            totalCount
            totalDiskUsage
            nodes {
              name
              id
              isPrivate
              url
              diskUsage
            }
          }
        }
      }
    `;
  }

  public setCredentials(credentials: GitHubCredentials): void {
    this.init(
      credentials.username,
      credentials.token,
      this.config.github_connector.baseUrl,
    );
  }

  private init(user: string, token: string, baseUrl: string) {
    this.variables = {
      number_of_repos: 0,
      username: user,
    };
    this.endpoint = baseUrl + '/graphql';
    this.graphQLClient = new GraphQLClient(this.endpoint, {
      headers: {
        authorization: `token ${token}`,
      },
    });
  }

  public async fetchUser(): Promise<User> {
    this.variables.number_of_repos = 0;
    try {
      let data = await this.graphQLClient.request(this.query, this.variables);
      let validated: any = await this.userInfoInputValidation(data.user);
      data = await this.fetchRepos(validated.repositories.totalCount);
      validated = await this.userInfoInputValidation(data.user);
      const parsed = this.parseUser(validated);
      this.logger.info('fetched user succeeded');
      this.logger.debug(parsed);
      return parsed;
    } catch (error) {
      this.logger.error(`fetch user failed. ${(error as Error).message}`);
      this.logger.debug(error);
      throw new Error('Couldn\'t fetch user');
    }
  }

  private userInfoInputValidation(data: any): joi.ValidationResult<any> {
    const schema = joi.object().keys({
      login: joi.string().required(),
      id: joi.string().required(),
      url: joi
        .string()
        .uri()
        .required(),
      repositories: joi.object().keys({
        nodes: joi
          .array()
          .items(
            joi.object().keys({
              diskUsage: joi.number().required(),
              id: joi.string().required(),
              isPrivate: joi.boolean().required(),
              name: joi.string().required(),
              url: joi.string().required(),
            }),
          )
          .required(),
        totalCount: joi.number().required(),
        totalDiskUsage: joi.number().required(),
      }),
    });
    return joi.validate(data, schema, {
      abortEarly: false,
      allowUnknown: true,
      convert: true,
      stripUnknown: true,
    });
  }

  private async fetchRepos(numOfRepos: number): Promise<any> {
    this.variables.number_of_repos = numOfRepos;
    try {
      const data = await this.graphQLClient.request(this.query, this.variables);
      return data;
    } catch (error) {
      throw error;
    }
  }

  private parseUser(data: any): User {
    return new User(
      data.login,
      data.id,
      data.url,
      data.repositories.nodes
        ? (data.repositories.nodes as any[]).map((repo) => {
            return this.parseRepo(repo);
          })
        : [],
      data.repositories.totalDiskUsage,
    );
  }

  private parseRepo(data: any): Repo {
    return new Repo(
      data.name,
      data.id,
      data.isPrivate,
      data.url,
      data.diskUsage,
    );
  }
}
