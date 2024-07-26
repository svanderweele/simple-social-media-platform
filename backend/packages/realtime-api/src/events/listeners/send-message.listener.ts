import {
  BaseListener,
  KafkaTopic,
  SendRealtimeMessageEvent,
} from '@svdw/common';
import { KafkaMessage } from 'kafkajs';
import * as realtimeService from '../../services/realtime.service';

export class SendRealtimeMessageListener extends BaseListener<SendRealtimeMessageEvent> {
  topic: KafkaTopic = KafkaTopic.REALTIME_SEND_MESSAGE;
  async onMessage(
    data: SendRealtimeMessageEvent['data'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _msg: KafkaMessage,
  ): Promise<void> {
    await realtimeService.sendRealtimeNotification({
      data: data.message,
      topic: data.topic,
      accountId: data.accountId,
    });
  }
}
