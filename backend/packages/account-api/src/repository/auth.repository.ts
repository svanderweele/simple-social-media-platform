import { DatabaseError } from '@svdw/common';
import { Account } from '../entities/account.entity';
import { User } from '../entities/user.entity';
import { AccountExistsError } from '../errors/account-exists.error';
import { getDataSource } from './auth.datasource';

export interface AccountRecord {
  id: string;
  username: string;
}

export async function getAccountByUsername(
  username: string,
): Promise<Account | null> {
  return await getDataSource()
    .getRepository(Account)
    .findOne({ where: { username }, relations: { user: true } });
}

export async function createAccount(dto: {
  email: string;
  name: string;
  hashedPassword: string;
}): Promise<AccountRecord> {
  const { email, hashedPassword, name } = dto;

  const accountRepository = getDataSource().getRepository(Account);

  const existingAccount = await accountRepository.findOne({
    where: { username: dto.email },
  });

  if (existingAccount) {
    throw new AccountExistsError();
  }

  const queryRunner = getDataSource().createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const userRepository = getDataSource().getRepository(User);
    const user = userRepository.create({
      email,
      name,
    });
    const savedUser = await queryRunner.manager.getRepository(User).save(user);

    const account = accountRepository.create({
      password: hashedPassword,
      username: email,
      user: savedUser,
    });

    const savedAccount = await queryRunner.manager
      .getRepository(Account)
      .save(account);

    await queryRunner.commitTransaction();

    return savedAccount;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw new DatabaseError(error);
  } finally {
    await queryRunner.release();
  }
}

export async function getUsers(): Promise<User[]> {
  const repository = getDataSource().getRepository(User);
  const users = await repository.find({ relations: { account: true } });
  return users;
}
