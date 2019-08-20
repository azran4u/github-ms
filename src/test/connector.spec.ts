import * as chai from 'chai';
import { Config, ApiMethod } from '../config';
import { GitHubRestApiV3, GitHubGraphQlV4 } from '../connector';
import { User } from '../model';

describe('connector test', () => {
  it('github rest api', async () => {
    // Arrange
    const config = Config.getConfig();
    config.github_connector.apiMethod = ApiMethod.RESTv3;
    Config.setConfig(config);
    const api = new GitHubRestApiV3();
    api.setCredentials(config.github_connector.credentials);

    // Act
    const user = await api.fetchUser();

    // Assert
    chai.expect(user).to.be.an.instanceof(User);
  });
  it('github graphql api', async () => {
    // Arrange
    const config = Config.getConfig();
    config.github_connector.apiMethod = ApiMethod.GRAPHQLv4;
    Config.setConfig(config);
    const api = new GitHubGraphQlV4();
    api.setCredentials(config.github_connector.credentials);

    // Act
    const user = await api.fetchUser();

    // Assert
    chai.expect(user).to.be.an.instanceof(User);
  });
});
