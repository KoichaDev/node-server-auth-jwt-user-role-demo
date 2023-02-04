# Table of Content

- [Table of Content](#table-of-content)
  - [Tokens](#tokens)
  - [Access Token](#access-token)
  - [Refresh Token](#refresh-token)
  - [What if refresh token is compromised?](#what-if-refresh-token-is-compromised)

## Tokens

- Access token is short amount, think of it as a minutes
- Refresh token lasts longer amount of time, possibly one or more days

## Access Token

Access Token is sent back as JSON data and front-end app should be stored in the memory, but not on the local storage or a cookie

## Refresh Token

is sent by the browser as an HTTP only secure cookie. It is not accessible by JavaScript, but it does needs to have an expiration set. Every time the API is accessed, the access token sent with the request. When the access token is expired, the refresh token is used to request a new access token. The refresh token is verified with its own end-point and compare to data in the database. It needs to expire or be removed during a manual logout

## What if refresh token is compromised?

Malicious access would be granted until the refresh token expires. This brings us back to the refresh token rotation. With refresh token rotation, every time a new access token is issued. A new refresh token
is also issued. This doesn't eliminate the risk, but it does greatly reduce it. It is even more effective
when combined with reuse detection. This will allow a refresh token to be used only once. After it is used, it will be invalidated. If the token is attempted, all refresh token for the user will be deleted, which then requires the user to login again as soon as their access token expires.
