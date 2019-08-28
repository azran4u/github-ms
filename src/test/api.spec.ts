import chai from 'chai';
import chaiHttp from 'chai-http';
import { Server } from '../api';

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
});
