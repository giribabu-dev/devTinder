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
- POST /request/review/:status/:requestId

## User Requests
- GET /user/connections
- GET /user/requests
- GET /user/feed

## Status
- Ignored
- Interested 
- Accepted 
- Rejected

- $or and $and query
- Why do we need index in Database?
- What are the advantages and disadvantages of index
- Compound Index

## Pagination:
- /user/feed?page=1&limit=10  =>  1 to 10  => .skip(0) & .limit(10)
- /user/feed?page=2&limit=10  =>  11 to 20  => .skip(10) & .limit(10)
- /user/feed?page=3&limit=10  =>  21 to 30  => .skip(20) & .limit(10)
- skip = (page - 1) * limit