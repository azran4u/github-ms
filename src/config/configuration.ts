import * as dotenv from 'dotenv';

export interface IConfig {
  github_connector: {
    credentials: GitHubCredentials;
    apiMethod: ApiMethod;
    baseUrl: string;
  };
  logger: {
    logLevel: string;
  };
}

export interface GitHubCredentials {
  username: string;
  password: string;
  token: string;
}

export enum ApiMethod {
  RESTv3,
  GRAPHQLv4,
}

export class Config {
  private config: IConfig;
  private static instance: Config;

  private constructor() {
    dotenv.config();
    this.config = {
      github_connector: {
        apiMethod: ApiMethod.GRAPHQLv4,
        baseUrl: 'https://api.github.com',
        credentials: {
          password: process.env.GITHUB_PASSWORD,
          username: process.env.GITHUB_USERNAME,
          token: process.env.GITHUB_TOKEN,
        },
      },
      logger: {
        logLevel: process.env.LOG_LEVEL || 'info',
      },
    };
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  public static getConfig(): IConfig {
    return Config.getInstance().config;
  }

  public static setConfig(config: IConfig): void {
    Config.getInstance().config = config;
  }
}
