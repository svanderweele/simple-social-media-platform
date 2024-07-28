import { BaseProducer, AccountCreatedEvent, KafkaTopic } from '@svdw/common';

export class AccountCreatedProducer extends BaseProducer<AccountCreatedEvent> {
  topic = KafkaTopic.ACCOUNT_CREATED;
}
