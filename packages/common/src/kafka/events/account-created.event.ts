import { KafkaTopic } from '../kafka.topics';

export interface AccountCreatedEvent {
  subject: KafkaTopic.ACCOUNT_CREATED;
  data: {
    id: string;
    username: string;
    name: string;
  };
}
