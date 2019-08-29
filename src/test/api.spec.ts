import chai from 'chai';
import chaiHttp from 'chai-http';
import { RestApi } from '../api/rest';
import { Config } from '../config';

const assert = chai.assert;

describe('api test', () => {
  it('request for /', (done) => {
    // Arrange
    const server = new RestApi();
    server.init();
    const app = server.getApp();
    chai.use(chaiHttp);
    chai.should();
    // Act

    // Assert
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
      });
    server.close();
    done();
  });
  it('request for invalid uri', (done) => {
    // Arrange
    const server = new RestApi();
    server.init();
    const app = server.getApp();
    chai.use(chaiHttp);
    chai.should();
    // Act

    // Assert
    chai
      .request(app)
      .get('/invalid')
      .end((err, res) => {
        chai.expect(res).to.have.status(404);
      });
    server.close();
    done();
  });
  it('request with invalid credentials', (done) => {
    // Arrange
    const githubUsername = process.env.GITHUB_USERNAME;
    process.env['GITHUB_USERNAME'] = 'no such user';
    Config.setConfig(Config.readEnvVars());
    const server = new RestApi();
    server.init();
    const app = server.getApp();
    chai.use(chaiHttp);
    chai.should();
    // Act

    // Assert
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        res.should.include.keys('text');
        assert.equal(res.text, 'could not fetch user');
      });
    server.close();
    process.env['GITHUB_USERNAME'] = githubUsername;
    done();
  });
  it('verify helmet headers', (done) => {
    // Arrange
    const server = new RestApi();
    server.init();
    const app = server.getApp();
    chai.use(chaiHttp);
    chai.should();
    // Act

    // Assert
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        chai.expect(res).to.have.status(200);
        chai.expect(res).to.have.header('x-dns-prefetch-control');
      });
    server.close();
    done();
  });
});
