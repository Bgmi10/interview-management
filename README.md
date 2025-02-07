
#TODO: 
date: 2/6/25
[C] => create a folder called signup under /api/auth/ and then create a file called route.ts and inside a create a 
post function which handles the signup request and handle db call and sign the token and set the cookie 

[C] => create a signup form or edit it based on created api route and test the endpoint and handle error based on response and make sure the cookies are setted properly in client side 

[C] => try to create a /login route under /api/auth and then, handle the req from client and validate and then check the user is not exist if it is true then give a error msg like user not found if exist then the check user pass with db hash handle the error cases and then sign the token the return back to client

[C] => edit a existing client logic based up on our signin route and handle the error cases and make sure the token is get setted in client browser

  2/7/25 - 3: 15 am
[C] => create a authmiddleware and extract the token from cookie and compare the token with secret if not valid and handle the error cases if valid allow client to access the api routes and also pass the decoded value from jwt to upcoming api routes.

[C] => test the authmiddleware to make sure works and return the req.user to api routes

[] => create a protected route tsx and add a