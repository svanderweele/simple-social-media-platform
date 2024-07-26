import { SendRealtimeMessageListener } from '../events/listeners/send-message.listener';

export function handleMessages(): void {
  try {
    new SendRealtimeMessageListener().listen();
  } catch (err) {
    console.error(err);
  }
}
