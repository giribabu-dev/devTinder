# Dev Tinder APIs

## Auth Router
- POST /signup
- POST /login
- POST /logout

## Profile Router
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## Connection Request Router
- POST /request/send/ignored/:userId
- POST /request/send/interested/:userId
- POST /request/send/:status/:toUserId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## User Requests
- GET /user/connections
- GET /user/requests
- GET /user/feed

## Status
- Ignored
- Interested 
- Accepted 
- Rejected