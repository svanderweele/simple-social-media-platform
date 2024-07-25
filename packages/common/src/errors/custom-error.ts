export abstract class CustomError extends Error {
  hideDetailsInProduction = true;
  abstract statusCode: number;
  abstract serialiseErrors(): unknown;
}
