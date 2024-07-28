// // import necessary modules
// import { check } from 'k6';
// import http from 'k6/http';
// import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

// // define configuration
// export const options = {
//   // define thresholds
//   thresholds: {
//     http_req_failed: ['rate<0.01'], // http errors should be less than 1%
//     http_req_duration: ['p(99)<1000'], // 99% of requests should be below 1s
//   },
//   rps: 5,
//   vus: 10,
//   duration: '30s',
// };

// const createTestAccounts = (num) => {
//   console.log('Registering test accounts');

//   let accountEmails = [];
//   for (var i = 0; i < num; i++) {
//     const email = 'test' + uuidv4() + '@gmail.com';

//     try {
//       const newAccountResponse = http.post(
//         authHostUrl + '/auth/register',
//         JSON.stringify({
//           email: email,
//           password: testAccountPass,
//           name: 'Test Account',
//         }),
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         },
//       );
//       if (newAccountResponse.status != 201) {
//         throw {
//           message: 'Failed to create account',
//           response: newAccountResponse,
//         };
//       }
//       accountEmails.push(email);
//     } catch (err) {
//       console.error('Failed to create account', err);
//     }
//   }
//   return accountEmails;
// };

// const loginToTestAccounts = (accountEmails) => {
//   let sessionTokens = [];
//   for (var i = 0; i < accountEmails.length; i++) {
//     const email = accountEmails[i];

//     try {
//       const response = http.post(
//         authHostUrl + '/auth/login',

//         JSON.stringify({
//           email: email,
//           password: testAccountPass,
//         }),
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         },
//       );
//       if (response.status != 200) {
//         throw {
//           message: 'Failed to login to account',
//           response: response,
//         };
//       }
//       const data = JSON.parse(response.body.toString());
//       sessionTokens.push(data.sessionToken);
//     } catch (err) {
//       console.error('Failed to login to account', err);
//     }
//   }
//   return sessionTokens;
// };

// const createGameSessions = (sessionTokens, gameId) => {
//   let sessionIds = [];
//   for (var i = 0; i < sessionTokens.length; i++) {
//     const token = sessionTokens[i];

//     try {
//       const response = http.get(gamingHostUrl + '/game-sessions/' + gameId, {
//         headers: {
//           Authorization: 'Bearer ' + token,
//           'Content-Type': 'application/json',
//         },
//       });
//       if (response.status != 201) {
//         throw {
//           message: 'Failed to create session',
//           response: response,
//         };
//       }
//       const data = JSON.parse(response.body.toString());
//       sessionIds.push(data.id);
//     } catch (err) {
//       console.error('Failed to create session', err);
//     }
//   }
//   return sessionIds;
// };

// // 1. init code

// let authHostUrl = 'http://localhost:3000';
// let realtimeHostUrl = 'http://localhost:3001';
// let testAccountPass = 'TestAccountPa$$123';

// export function setup() {
//   let accountEmails = createTestAccounts(10);
//   let sessionTokens = loginToTestAccounts(accountEmails);
//   let sessionIds = createGameSessions(
//     sessionTokens,
//     '02abefa7-235a-4b97-b2b0-7c2eab6219a9',
//   );

//   // Load test
//   return {
//     sessionTokens,
//     sessionIds,
//   };
// }

// export function teardown(data) {
//   // 4. teardown code
// }

// export default function (data) {
//   const gameSessionIds = data.sessionIds;
//   const userSessionTokens = data.sessionTokens;
//   // define URL and request body
//   var randomNumber = Math.floor(
//     Math.random() * (userSessionTokens.length - 1 - 0) + 0,
//   );

//   const url = gamingHostUrl;
//   const payload = JSON.stringify({
//     betAmount: Math.floor(Math.random() * 10) + 1,
//   });
//   const params = {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: 'Bearer ' + userSessionTokens[randomNumber],
//     },
//   };

//   // send a post request and save response as a variable
//   const res = http.post(
//     `${url}/game-sessions/${gameSessionIds[randomNumber]}/spin`,
//     payload,
//     params,
//   );
//   console.log(res);

//   // check that response is 200
//   check(res, {
//     'response code was 200': (res) => res.status == 200,
//   });
// }
