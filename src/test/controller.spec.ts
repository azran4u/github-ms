import * as mocha from 'mocha';
import * as chai from 'chai';
import { Config, ApiMethod } from '../config';
import { Controller } from '../controller/controller';

describe('controller test', () => {
  it('config rest api and fetch user', () => {
    // Arrange
    const config = Config.getConfig();
    config.github_connector.apiMethod = ApiMethod.RESTv3;
    Config.setConfig(config);

    // Act

    // Assert
    chai.expect(Controller.init).to.not.throw(Error);
  });
  it('config graphql api and fetch user', () => {
    // Arrange
    const config = Config.getConfig();
    config.github_connector.apiMethod = ApiMethod.GRAPHQLv4;
    Config.setConfig(config);

    // Act

    // Assert
    chai.expect(Controller.init).to.not.throw(Error);
  });
});
