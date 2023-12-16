const { describe } = require('node:test');
const { TestHelper } = require('../utils/testHelper');
const { validateMatch } = require('./match.entity');
const {
  matchStub,
  preMatchStub,
  liveMatchStub,
  finishedMatchStub,
} = require('./test/match.stubs');

describe('Match entity', () => {
  beforeAll(async () => {
    await TestHelper.instance.setupTestDB();
    // userCirclesRepository = await TestHelper.instance.getRepository(UserCircles);
  });

  afterAll(async () => {
    await TestHelper.instance.teardownTestDB();
  });

  afterEach(async () => {
    await TestHelper.instance.dropCollections();
  });

  it('should be valid', async () => {
    let match = preMatchStub();
    await validateMatch(match);
    match = liveMatchStub();
    await validateMatch(match);
    match = finishedMatchStub();
    await validateMatch(match);
  });

  describe('title validation', () => {
    it('should have a title field', async () => {
      const match = matchStub({ title: undefined });
      expect(validateMatch(match)).rejects.toThrow();
    });

    it('should be a string', async () => {
      const match = matchStub({ title: 5 });
      expect(validateMatch(match)).rejects.toThrow();
    });

    it('should be a non empty string', async () => {
      const match = matchStub({ title: '' });
      expect(validateMatch(match)).rejects.toThrow();
    });
  });

  describe('date validation', () => {
    it('should have a start date', async () => {
      const match = matchStub({ startDate: undefined });
      expect(validateMatch(match)).rejects.toThrow();
    });

    it('can be a string', async () => {
      const match = matchStub();
      const match2 = matchStub({ startDate: match.startDate.toISOString() });
      await validateMatch(match2);
    });

    it('startDate should be before endDate', async () => {
      const match = finishedMatchStub();
      const match2 = finishedMatchStub({
        startDate: match.endDate,
        endDate: match.startDate,
      });
      expect(validateMatch(match2)).rejects.toThrow();
    });
  });

  describe('status validation', () => {
    it('should have a status field', async () => {
      const match = matchStub({ status: undefined });
      expect(validateMatch(match)).rejects.toThrow();
    });

    it('should be a string', async () => {
      const match = matchStub({ status: 5 });
      expect(validateMatch(match)).rejects.toThrow();
    });

    it('should be a valid status', async () => {
      const match = matchStub({ status: 'INVALID' });
      expect(validateMatch(match)).rejects.toThrow();
    });

    const validStatuses = ['PREMATCH', 'LIVE', 'ENDED'];
    validStatuses.forEach((status) => {
      it(`should be ${status}`, async () => {
        const match = matchStub({ status });
        await validateMatch(match);
      });
    });
  });
});
