import { KafkaTopic } from '../kafka.topics';

export interface AccountLoggedOutEvent {
  subject: KafkaTopic.ACCOUNT_LOGGED_OUT;
  data: {
    accountId: string;
  };
}
