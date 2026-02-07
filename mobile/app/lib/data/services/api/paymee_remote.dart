import 'dart:convert';
import 'package:http/http.dart' as http;

class PaymentRemote {
  final String apiKey;
  //constructor to don't put the code in the method and to be able to use the same instance of the class with the same api key for all the payment operations
  PaymentRemote(this.apiKey);

  Future<Map<String, dynamic>> createPayment({
    required double amount,
    required String note,
    required String firstName,
    required String lastName,
    required String email,
    required String phone,
    String redirectUrl = 'https://example.com/redirect',
    String cancelUrl = 'https://example.com/cancel',
    String webhookUrl = 'https://example.com/webhook',
    required String orderId,
  }) async {
    final url = Uri.parse('https://sandbox.paymee.tn/api/v2/payments/create');
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token $apiKey',
      },
      body: jsonEncode({
        "amount": amount,
        "note": note,
        "customer": {
          "first_name": firstName,
          "last_name": lastName,
          "email": email,
          "phone": phone,
        },
        "redirect_url": redirectUrl,
        "cancel_url": cancelUrl,
        "webhook_url": webhookUrl,
        "order_id": orderId,
      }),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to create payment: ${response.body}');
    }
    return jsonDecode(response.body);
  }
}
