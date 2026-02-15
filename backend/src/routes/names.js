/*
=======recharge=======
//the POST
http://localhost:3000/api/payments/recharge 
//parameters
user_id , amount

=======create a user(passenger,admin,controller)=======
//the POST
http://localhost:3000/users/createuser
//parameters
email,role,first_name,last_name,password

======create a ticket========
//the POST
http://localhost:3000/ticket/createticket
//parameters
user_id,schedule_id,price

=====get the qr data by ticket id=====
//the POST
http://localhost:3000/ticket/getqrdatabyticketid
//parameters
ticket_id
======update the numbers of tokens====
//the POST
http://localhost:3000/token/updatetokenbalance
//patameters
user_id
amount
=====to verify the number of tokens more than given amount or not====
//the POST
http://localhost:3000/token/verifynumberoftokens
//parameters
user_id
amount
======to get the tokens balance=====
//the POST
http://localhost:3000/token/gettokenbalance
//parameters
user_id
========to convert money to token=======
//the POST
http://localhost:3000/token/convertmoneytotoken
//parameters
amount
=======to convert token to money======
//the POST
http://localhost:3000/token/converttokentomoney
//parameters
amount
=====to get the user id by transaction id======
//the POST
http://localhost:3000/token/getuseridbytransactionid
//parameters
transaction id
=====get the ticket status by qr data======
//the POST
http://localhost:3000/ticket/getticketstatusbyqrdata
//parameters
qr_data
=====get essential info by user id(first name, last name, email,role,token balance)=====
//the POST
http://localhost:3000/users/getuseressentialinfo
//parameters
user_id
=======update the numbers of tokens====
//the POST
http://localhost:3000/token/updatetokenbalance
//patameters
user_id
amount
*/
