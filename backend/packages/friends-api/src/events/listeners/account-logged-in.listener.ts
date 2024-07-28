import { AccountLoggedInEvent, BaseListener, KafkaTopic } from '@svdw/common';
import { KafkaMessage } from 'kafkajs';
import * as friendService from '../../services/friends.service';

export class AccountLoggedInListener extends BaseListener<AccountLoggedInEvent> {
  topic: KafkaTopic = KafkaTopic.ACCOUNT_LOGGED_IN;
  async onMessage(
    data: AccountLoggedInEvent['data'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _msg: KafkaMessage,
  ): Promise<void> {
    await friendService.sendUserFriendRequests({
      accountId: data.accountId,
    });
  }
}
