import { RealtimeTopic } from '../../enums/enums';
import { KafkaTopic } from '../kafka.topics';

export interface SendRealtimeMessageEvent {
  subject: KafkaTopic.REALTIME_SEND_MESSAGE;
  data: {
    topic: RealtimeTopic;
    accountId?: string;
    message: unknown;
  };
}
