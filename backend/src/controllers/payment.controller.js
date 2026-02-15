import * as paymentService from "../services/payment.service.js";
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
    const paymeeData = await paymentService.createRecharge({
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
export const updateTokenBalance = async (req, res) => {
  try {
    const { user_id, amount } = req.body;
    if (!user_id || !amount) {
      return res.status(400).json({
        error: "User ID and amount  is required",
      });
    }
    await paymentService.updateTokenBalance({
      user_id,
      amount,
    });
    res.status(200).json({ message: "token updated succesfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const verifyTokensNumber = async (req, res) => {
  try {
    const { user_id, amount } = req.body;
    if (!user_id || !amount) {
      return res.status(400).json({
        error: "User ID and amount  is required",
      });
    }
    const tokensData = await paymentService.verifyTokensNumber({
      user_id,
      amount,
    });
    res.status(200).json({ tokensData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getTokensBalance = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({
        error: "User ID and amount  is required",
      });
    }
    const tokenBalence = await paymentService.getTokensBalance({ user_id });
    res.status(200).json({ tokenBalence });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const moneyToToken = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({
        error: "amount  is required",
      });
    }
    const token = paymentService.moneyToToken({ amount });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const tokenToMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({
        error: "amount  is required",
      });
    }
    const money = paymentService.tokenToMoney({ amount });
    res.status(200).json({ money });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getUserIdByTransactionId = async (req, res) => {
  try {
    const { transaction_id } = req.body;
    if (!transaction_id) {
      return res.status(400).json({
        error: "transaction id is required",
      });
    }
    const user = await paymentService.getUserIdByTransactionId({
      transaction_id,
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
