import chai from 'chai';
import chaiHttp from 'chai-http';
import { Server } from '../api';
import { Config } from '../config';

describe('api test', () => {
  it('request for /', (done) => {
    // Arrange
    const server = new Server();
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
        server.close();
        done();
      });
  });
  it('request for invalid uri', (done) => {
    // Arrange
    const server = new Server();
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
        server.close();
        done();
      });
  });
  it('request with invalid credentials', (done) => {
    // Arrange
    process.env['GITHUB_USERNAME'] = 'a';
    process.env['GITHUB_TOKEN'] = 'a';
    process.env['GITHUB_PASSWORD'] = 'a';
    Config.setConfig(Config.readEnvVars());
    const server = new Server();
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
        chai.expect(res).to.have.text('could not fetch user');
        server.close();
        done();
      });
  });
  it('verify helmet headers', (done) => {
    // Arrange
    const server = new Server();
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
        server.close();
        done();
      });
  });
});
