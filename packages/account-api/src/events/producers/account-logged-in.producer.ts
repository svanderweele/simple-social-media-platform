import { BaseProducer, KafkaTopic, AccountLoggedInEvent } from '@svdw/common';

export class AccountLoggedInProducer extends BaseProducer<AccountLoggedInEvent> {
  topic = KafkaTopic.ACCOUNT_LOGGED_IN;
}
