/*
=======recharge=======
//the POST
http://localhost:3000/api/payments/recharge 
//parameters
user_id , amount
//return value
a message of success and the transaction id and the payment url to redirect the user to it to complete the payment process

=======create a user(passenger,admin,controller)=======
//the POST
http://localhost:3000/users/createuser
//parameters
email,role,first_name,last_name,password
//return value
if the role is passenger it will return a message of success and the user data
if the role is admin or super admin it will return a message of success and a special code to complete the sign up process
======create a ticket========
//the POST
http://localhost:3000/ticket/createticket
//parameters
user_id,schedule_id,price
//return value
a message of success and the ticket data

=====get the qr data by ticket id=====
//the POST
http://localhost:3000/ticket/getqrdatabyticketid
//parameters
ticket_id
//return value
a message of success and the qr data
======update the numbers of tokens====
//the POST
http://localhost:3000/token/updatetokenbalance
//patameters
user_id
amount
//return value
a message of success
=====to verify the number of tokens more than given amount or not====
//the POST
http://localhost:3000/token/verifynumberoftokens
//parameters
user_id
amount
//return value
a message of success and a boolean value to indicate if the user has enough tokens or not
======to get the tokens balance=====
//the POST
http://localhost:3000/token/gettokenbalance
//parameters
user_id
//return value
a message of success and the tokens balance
========to convert money to token=======
//the POST
http://localhost:3000/token/convertmoneytotoken
//parameters
amount
//return value
a message of success and the equivalent amount in tokens
=======to convert token to money======
//the POST
http://localhost:3000/token/converttokentomoney
//parameters
amount
//return value
a message of success and the equivalent amount in money
=====to get the user id by transaction id======
//the POST
http://localhost:3000/token/getuseridbytransactionid
//parameters
transaction id
//return value
a message of success and the user id
=====get the ticket status by qr data======
//the POST
http://localhost:3000/ticket/getticketstatusbyqrdata
//parameters
qr_data
//return value
a message of success and the ticket status
=====get essential info by user id(first name, last name, email,role,token balance)=====
//the POST
http://localhost:3000/users/getuseressentialinfo
//parameters
user_id
//return value
a message of success and the essential info of the user
=======update the numbers of tokens====
//the POST
http://localhost:3000/token/updatetokenbalance
//patameters
user_id
amount
//return value
a message of success
=====to redeem tokens from user======
//the POST
http://localhost:3000/users/redeemtokensfromuser
//parameters
user_id
amount
//return value
a message of success and the new token balance after redeeming the tokens
=====to sign up and login with google======
//the GET
http://localhost:3000/users/auth/google
//return value
the sign in url that the user will be redirected to it


======================THE LOGIN=================================
===the login for passenger in web===
//the POST
http://localhost:3000/users/loginwebfirststep
//parameters
email,password
//return value
if the email and password are correct and the role is passenger it will return the token and user data
===the login for admin and super admin in web===
//the POST
//2 steps login
http://localhost:3000/users/loginwebfirststep
//parameters
email,password
//return value
if the email and password are correct and the role is admin or super admin it will return a message to enter the admin code to complete the login process
http://localhost:3000/users/loginwebsecondstep
//parameters
email,admin_code
//return value
if the email and admin code are correct it will return the token and user data
===the login for mobile===
//the POST
http://localhost:3000/users/loginmobile
//parameters
email,password
//return value
if the email and password are correct it will return the token and user data
=====the login for controller in mobile=====
//the POST
http://localhost:3000/users/controllerlogin
//parameters
email,password,code
//return value
if the email and password are correct and the code is correct it will return the token and user data
*/
