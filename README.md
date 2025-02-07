
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

[C] => create a protected route tsx

[C] => create a /forget-password page and make a form with fields like email, submit button validate the email.

[C] => create a backend point called forgetpassword under /api/auth and then create post route and then get the email from the query("email) then generate a 6 digit random number must be unique.

[C] => create a schema for otp and with attributes like id, otphash, exp time, created time 

[C] => test the email otp from client side 

[C] => create a endpoint called /verify-otp under /api/auth to verify the otp. it will take the otp, new password, email as req.body and then once the otp matches then we should the update user password 

[C] => check the flow of forget password from client manually 

[] => create a /homepage and once the user login or signup redirect them to /homepage and on home page use a header and implement a conditional render for both recruiter and candidate and dont use a landing page try to use a fresh open page on /homepage