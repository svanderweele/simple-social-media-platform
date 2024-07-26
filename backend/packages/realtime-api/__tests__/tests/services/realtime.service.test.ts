import { RealtimeTopic } from '@svdw/common';
import * as realtimeService from '../../../src/services/realtime.service';

describe('Realtime Service', () => {
  it('should publish a message over kafka', async () => {
    // Arrange
    const payload = {
      userId: 'some-id',
      data: 'testas123',
    };

    // Act
    await realtimeService.sendRealtimeNotification({
      data: payload.data,
      topic: RealtimeTopic.FriendRequests,
    });

    // Assert
    // expect(response).toHaveBeenCalled();
    // expect(kafka).toHaveBeenCalled();
  });
});
