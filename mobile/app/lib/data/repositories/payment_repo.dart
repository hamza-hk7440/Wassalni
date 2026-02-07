import 'package:app/data/models/payment_model.dart';

abstract class PaymentRepo {
  //==========payment operations===========

  //create payment method this method will be called when the user start the payment and will call the paymee api
  Future<String> createPaymentMethod({
    required String userId,
    required double amount,
    required String type, //paymee,tokens
    required String method, //online ,in station --but for the mobile will be alwyays online
  });

  //save payment method
  Future<PaymentModel> savePaymentMethod(PaymentModel Model);

  //update payment method
  Future<void> updatePayment({
    required String paymentId,
    required Map<String, dynamic> updates,
  });

  //get payment method by id
  Future<PaymentModel> getPaymentById(String paymentId);

  //==========token operations==========

  //add token to user
  Future<void> addTokenToUser(String userId, double amount);
  //get user tokens
  Future<double> getUserTokens(String userId);
  //redeem tokens
  Future<void> redeemTokens(String userId, double amount);
  //check if user has enough tokens
  Future<bool> hasEnoughTokens(String userId, double amount);
}
