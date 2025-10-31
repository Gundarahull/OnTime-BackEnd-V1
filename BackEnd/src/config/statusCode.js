const Status = {
  CODES: {
    // ✅ Success
    SUCCESS: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,

    // ⚠️ Client Errors
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401, // Use this when token is missing or invalid
    FORBIDDEN: 403, // Authenticated but not allowed
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409, // Already exists
    UNPROCESSABLE_ENTITY: 422, // Validation error

    // ❌ Server Errors
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
  },
};

module.exports=Status

// | **Code** | **Meaning**         | **Layman Example**                                               |
// | -------- | ------------------- | ---------------------------------------------------------------- |
// | 100      | Continue            | "Got your request, keep going..." (e.g., uploading a large file) |
// | 101      | Switching Protocols | "Sure, let’s switch to a new way of talking (like WebSocket)."   |


// | **Code** | **Meaning** | **Layman Example**                                                  |
// | -------- | ----------- | ------------------------------------------------------------------- |
// | 200      | OK          | "Here's the thing you asked for." (e.g., get user info)             |
// | 201      | Created     | "I’ve created what you asked for." (e.g., a new user)               |
// | 202      | Accepted    | "Request received, but will do it later." (e.g., background job)    |
// | 204      | No Content  | "Request done, but nothing to show." (e.g., delete request success) |


// | **Code** | **Meaning**       | **Layman Example**                                                |
// | -------- | ----------------- | ----------------------------------------------------------------- |
// | 301      | Moved Permanently | "That page has moved. Use this new address forever."              |
// | 302      | Found             | "It’s temporarily somewhere else."                                |
// | 304      | Not Modified      | "You already have the latest version. No need to download again." |


// | **Code** | **Meaning**          | **Layman Example**                                                               |
// | -------- | -------------------- | -------------------------------------------------------------------------------- |
// | 400      | Bad Request          | "What you sent doesn't make sense." (e.g., missing parameters)                   |
// | 401      | Unauthorized         | "You must log in first."                                                         |
// | 403      | Forbidden            | "You're not allowed to access this." (even if you're logged in)                  |
// | 404      | Not Found            | "We looked everywhere. That page/file doesn't exist."                            |
// | 405      | Method Not Allowed   | "You can't use this action here (e.g., sending POST to GET-only URL)."           |
// | 409      | Conflict             | "Something already exists that conflicts with this." (e.g., duplicate email)     |
// | 422      | Unprocessable Entity | "The format is okay, but the data itself is invalid." (e.g., wrong email format) |
// | 429      | Too Many Requests    | "Whoa! Slow down. You're sending too many requests."                             |


// | **Code** | **Meaning**           | **Layman Example**                                           |
// | -------- | --------------------- | ------------------------------------------------------------ |
// | 500      | Internal Server Error | "Oops, something broke on our end."                          |
// | 501      | Not Implemented       | "This feature isn't available yet."                          |
// | 502      | Bad Gateway           | "Server got a bad response from another server."             |
// | 503      | Service Unavailable   | "Server is temporarily busy or down."                        |
// | 504      | Gateway Timeout       | "Server didn’t respond in time when asking another service." |
