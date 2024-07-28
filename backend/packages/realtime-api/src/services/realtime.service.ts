import { getLogger, RealtimeTopic } from '@svdw/common';
import { getSockets } from '../entrypoints/realtime.sockets';

export interface RealtimeNotification {
  topic: RealtimeTopic;
  data: unknown;
  accountId?: string;
}

export async function sendRealtimeNotification(
  request: RealtimeNotification,
): Promise<void> {
  try {
    getSockets(request.accountId).forEach((socket) => {
      try {
        socket.emit(request.topic, request.data);
        console.log('Sent realtime message ');
      } catch (error) {
        console.error('Error sending request ', error);
      }
    });
    console.log('Send Realtime Message!', request);
  } catch (error) {
    getLogger().error('Failed to notify about friend requests', error);
    throw error;
  }
}
