export const RESPONSE_STATUS_CODE = {
  SUCCESS: 200,                       // Successful response
  BADREQUEST: 400,                    // Missing/Invalid params
  UNAUTHORIZED: 401,                  // Unauthenticated request
  FORBIDDEN: 403,                     // Unauthorized request
  NOTFOUND: 404,                      // Not found
  INTERNALSERVERERROR: 500,           // Server error
  BADGATEWAY: 502                     // Server down
};
