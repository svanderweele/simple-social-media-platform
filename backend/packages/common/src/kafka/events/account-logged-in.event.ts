import { KafkaTopic } from '../kafka.topics';

export interface AccountLoggedInEvent {
  subject: KafkaTopic.ACCOUNT_LOGGED_IN;
  data: {
    accountId: string;
  };
}
