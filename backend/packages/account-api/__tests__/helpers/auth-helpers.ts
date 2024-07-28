export async function createDummyUser(): Promise<string> {
  const userEmail = `test_user_gaming_${Date.now()}@gmail.com`;
  const userPassword = 'ReallyHardPa$$word123';

  await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      email: userEmail,
      password: userPassword,
      name: 'AwesomeTestUser',
    }),
  });

  const session = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: userEmail,
      password: userPassword,
    }),
  });

  const sessionData = await session.json();
  return sessionData.sessionToken;
}
