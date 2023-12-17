/* eslint-disable no-underscore-dangle */
const { MongoMemoryServer } = require('mongodb-memory-server');
const { DataSource } = require('typeorm');

module.exports.TestHelper = class TestHelper {
  static get instance() {
    if (!this._instance) this._instance = new TestHelper();
    return this._instance;
  }

  getConfig() {
    return {
      type: 'mongodb',
      url: this.memoryDB.getUri('test'),
      entities: ['**/*.entity.js'],
      synchronize: true,
    };
  }

  async startTestDB() {
    this.memoryDB = await MongoMemoryServer.create();
  }

  async stopTestDB() {
    await this.memoryDB.stop();
  }

  async setupTestDB() {
    await this.startTestDB();
    this.source = new DataSource(this.getConfig());
    await this.source.initialize();
  }

  async teardownTestDB() {
    await this.memoryDB.stop();
    await this.source.destroy();
  }

  async getRepository(entity) {
    return this.source.getRepository(entity);
  }

  async dropCollections() {
    await this.source.dropDatabase();
  }
};
