import * as chai from 'chai';
import { Config, ApiMethod } from '../config';

describe('config test', () => {
  it('when env variable GITHUB_API_METHOD=rest use rest api', () => {
    // Arrange
    process.env['GITHUB_API_METHOD'] = 'rest';
    Config.setConfig(Config.readEnvVars());

    // Act
    const config = Config.getConfig();
    const selectedMethod = config.github_connector.apiMethod;
    const rest = ApiMethod.RESTv3;
    // Assert
    chai.expect(selectedMethod).to.be.equal(rest);
  });

  it('when env variable GITHUB_API_METHOD=graphql use graphql api', () => {
    // Arrange
    process.env['GITHUB_API_METHOD'] = 'graphql';
    Config.setConfig(Config.readEnvVars());

    // Act
    const config = Config.getConfig();
    const selectedMethod = config.github_connector.apiMethod;
    const graphql = ApiMethod.GRAPHQLv4;
    // Assert
    chai.expect(selectedMethod).to.be.equal(graphql);
  });
  it('when env variable GITHUB_API_METHOD has invalid value use graphql api', () => {
    // Arrange
    process.env['GITHUB_API_METHOD'] = '';
    Config.setConfig(Config.readEnvVars());

    // Act
    const config = Config.getConfig();
    const selectedMethod = config.github_connector.apiMethod;
    const graphql = ApiMethod.GRAPHQLv4;

    // Assert
    chai.expect(selectedMethod).to.be.equal(graphql);
  });

  it('when env variable GITHUB_API_METHOD does not exists value use graphql api', () => {
    // Arrange
    process.env['GITHUB_API_METHOD'] = undefined;
    Config.setConfig(Config.readEnvVars());

    // Act
    const config = Config.getConfig();
    const selectedMethod = config.github_connector.apiMethod;
    const graphql = ApiMethod.GRAPHQLv4;

    // Assert
    chai.expect(selectedMethod).to.be.equal(graphql);
  });
});
