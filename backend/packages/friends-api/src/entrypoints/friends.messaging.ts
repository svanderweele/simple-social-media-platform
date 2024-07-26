import { AccountCreatedListener } from '../events/listeners/account-created.listener';
import { AccountLoggedInListener } from '../events/listeners/account-logged-in.listener';

export function setupMessaging(): void {
  new AccountCreatedListener().listen();
  new AccountLoggedInListener().listen();
}
