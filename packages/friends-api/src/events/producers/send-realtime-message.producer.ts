import {
  BaseProducer,
  KafkaTopic,
  SendRealtimeMessageEvent,
} from '@svdw/common';

export class SendRealtimeMessageProducer extends BaseProducer<SendRealtimeMessageEvent> {
  topic: KafkaTopic = KafkaTopic.REALTIME_SEND_MESSAGE;
}
