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
  api: {
    rest: {
      port: number;
    };
    graphql: {
      port: number;
    };
  };
  db: {
    mongo: {
      host: string;
      port: number;
    };
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
    this.config = Config.readEnvVars();
  }

  public static readEnvVars(): IConfig {
    dotenv.config();

    return {
      github_connector: {
        apiMethod: process.env.GITHUB_API_METHOD
          ? process.env.GITHUB_API_METHOD.toString() === 'graphql'
            ? ApiMethod.GRAPHQLv4
            : process.env.GITHUB_API_METHOD.toString() === 'rest'
            ? ApiMethod.RESTv3
            : ApiMethod.GRAPHQLv4
          : ApiMethod.GRAPHQLv4, // default
        baseUrl: process.env.GITHUB_BASE_URL || 'https://api.github.com',
        credentials: {
          password: process.env.GITHUB_PASSWORD,
          username: process.env.GITHUB_USERNAME,
          token: process.env.GITHUB_TOKEN,
        },
      },
      logger: {
        logLevel: process.env.LOG_LEVEL || 'info',
      },
      api: {
        rest: {
          port: process.env.REST_API_PORT ? +process.env.REST_API_PORT : 3000,
        },
        graphql: {
          port: process.env.GRAPHQL_API_PORT
            ? +process.env.GRAPHQL_API_PORT
            : 4000,
        },
      },
      db: {
        mongo: {
          host: process.env.MONGODB_HOST || 'localhost',
          port: process.env.MONGODB_PORT ? +process.env.MONGODB_PORT : 27017,
        }
      }
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
