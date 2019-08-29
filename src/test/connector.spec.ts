import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Config, ApiMethod } from '../config';
import { GitHubRestApiV3, GitHubGraphQlV4 } from '../connector';
import { User } from '../model';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('connector test', () => {
  it('github rest api valid credentials', async () => {
    // Arrange
    Config.setConfig(Config.readEnvVars());
    const config = Config.getConfig();
    config.github_connector.apiMethod = ApiMethod.RESTv3;
    Config.setConfig(config);
    const api = new GitHubRestApiV3();
    api.setCredentials(config.github_connector.credentials);

    // Act

    // Assert
    await expect(api.fetchUser()).to.eventually.be.an.instanceof(User);
  });
  it('github rest api invalid credentials', async () => {
    // Arrange
    const githubUsername = process.env.GITHUB_USERNAME;
    process.env['GITHUB_USERNAME'] = 'no such user';
    Config.setConfig(Config.readEnvVars());
    const config = Config.getConfig();
    config.github_connector.apiMethod = ApiMethod.RESTv3;
    Config.setConfig(config);
    const api = new GitHubRestApiV3();
    api.setCredentials(config.github_connector.credentials);
    process.env['GITHUB_USERNAME'] = githubUsername;
    // Act

    // Assert
    await expect(api.fetchUser()).to.be.rejected;
  });
  it('github graphql api with valid credentials', async () => {
    // Arrange
    Config.setConfig(Config.readEnvVars());
    const config = Config.getConfig();
    config.github_connector.apiMethod = ApiMethod.GRAPHQLv4;
    Config.setConfig(config);
    const api = new GitHubGraphQlV4();
    api.setCredentials(config.github_connector.credentials);

    // Act

    // Assert
    await expect(api.fetchUser()).to.eventually.be.an.instanceof(User);
  });
  it('github graphql api invalid credentials', async () => {
    // Arrange
    const githubUsername = process.env.GITHUB_USERNAME;
    process.env['GITHUB_USERNAME'] = 'no such user';
    Config.setConfig(Config.readEnvVars());
    const config = Config.getConfig();
    config.github_connector.apiMethod = ApiMethod.GRAPHQLv4;
    Config.setConfig(config);
    const api = new GitHubGraphQlV4();
    api.setCredentials(config.github_connector.credentials);
    process.env['GITHUB_USERNAME'] = githubUsername;
    // Act

    // Assert
    await expect(api.fetchUser()).to.be.rejected;
  });
});
