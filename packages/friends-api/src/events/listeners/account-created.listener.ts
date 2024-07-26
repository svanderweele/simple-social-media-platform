import { AccountCreatedEvent, BaseListener, KafkaTopic } from '@svdw/common';
import { KafkaMessage } from 'kafkajs';
import * as friendService from '../../services/friends.service';

export class AccountCreatedListener extends BaseListener<AccountCreatedEvent> {
  topic: KafkaTopic = KafkaTopic.ACCOUNT_CREATED;
  async onMessage(
    data: AccountCreatedEvent['data'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _msg: KafkaMessage,
  ): Promise<void> {
    await friendService.createAccount({
      accountId: data.id,
    });
  }
}
