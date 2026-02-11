import * as paymenntService from "../services/payment.service.js";
//we import all the methods from payment.service.js with the name paymentService,one of this methods is createRecharge
//as this method is called by a POST so it will have a request(req) and response(res)
//now we will see each one what will do
//NB: this createRecharge function is not the same in payment.service.js
export const createRecharge = async (req, res) => {
  try {
    //so the paymenntService.createRecharge function need 2 fields the id and the amount and they will be sended by the sender of the POST
    //we access to them by req.body
    //as we know the req is already filled by the data and the res wait for us ti fill it with the data
    const { user_id, amount } = req.body;
    if (!user_id || !amount) {
      return res.status(400).json({
        error: "User ID and Amount are required",
      });
    }
    //so here we call the paymenntService.createRecharge to get what we need (the url in first place and also the transaction id)
    const paymeeData = await paymenntService.createRecharge({
      user_id,
      amount,
    });
    if (!paymeeData || !paymeeData.data) {
      return res.status(400).json({
        //status 400 means bad request
        success: false,
        error: "Paymee API did not return a payment link",
        details: paymeeData, // this shows  the actual error from paymee
      });
    }
    res.status(200).json({
      //status 200 means everything is ok
      //so here we will use the response given by paymee and localized in response.data to put in the res
      success: true,
      payment_url: paymeeData.data.payment_url,
      transaction_id: paymeeData.data.order_id,
    });
  } catch (error) {
    console.error("Controller Error:", error.message);
    res.status(500).json({
      //status 500 means server error
      error: "Failed to initiate recharge",
      details: error.message,
    });
  }
};
