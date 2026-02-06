abstract class PaymentRepo {
  //==========payment operations===========

  //save payment method
  Future<PaymentRequest> savePaymentMethod(PaymentRequest request);

  //update payment method
  Future<void> updatePayment({
    required String paymentId,
    required Map<String, dynamic> updates,
  });

  //get payment method by id
  Future<PaymentRequest> getPaymentById(String paymentId);

  //==========token operations==========

  //add token to user
  Future<void> addTokenToUser(String userId, double amount);
  //get user tokens
  Future<double> getUserTokens(String userId);
  //redeem tokens
  Future<void> redeemTokens(String userId, double amount);
  //check if user has enough tokens
  Future<bool> hasEnoughTokens(String userId, double amount);
  //============validation operations===========

  //validate payment before processing
  Future<Map<String, dynamic>> validatePayment(PaymentRequest request);
}
