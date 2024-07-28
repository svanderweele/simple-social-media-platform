import { destroyDb } from '../helpers/test-helpers';

describe('Realtime Service', () => {
  // let container: StartedPostgreSqlContainer | undefined;
  beforeEach(async () => {
    // container = await setupDb();
  }, 10000);

  afterEach(async () => {
    // await container.stop();
    destroyDb();
  });

  describe('Testing Notification System', () => {
    it('when user logs in, should connect user to websocket', async () => {
      // Arrange
      // Create a test account & Login
      // const sessionToken = await createDummyUser();
      // Act
      // Assert
    });
  });
});
