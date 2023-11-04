const COMMON = {
  MISSING_PARAMETERS: "Missing parameters",
  INTERNAL_SERVER_ERROR: "Internal server error",
  UNAUTHORIZED: "Unauthorized",
  EMAIL_VERIFICATION: "Unable to verfiy email address.",
};

const USER = {
  NOT_FOUND: "User not found",
  ALREADY_EXISTS: "User already exits.",
  NOT_AUTHORIZED: "User not authorized",
  NOT_AUTHENTICATED: "User not authenticated",
  INCORRECT_CREDENTIALS: "Invalid Username & Password",
  PASSWORD_CHANGE_ERROR: "Failed to change password",
  PASSWORD_VALIDATION: "Old Password Incorrect",
};

const AUTH = {
  ACCESS_TOKEN: "Access Denied, No Token Provided",
  SEND_EMAIL_SUCCESS: "Email sent successfully",
  SEND_EMAIL_FAILED: "Fail to sent email",
  INVALID_EMAIL: "Invalid Email",
  INVALID_PASSWORD: "Invalid Password",
  INVALID_OTP: "Invalid OTP",
};

export const ERROR_CODES = {
  COMMON,
  USER,
  AUTH,
};
