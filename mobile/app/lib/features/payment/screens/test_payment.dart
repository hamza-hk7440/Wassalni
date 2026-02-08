import 'package:flutter/material.dart';
import 'package:app/data/services/firebase/payment_service_MYVERSION.dart';
import 'package:app/data/services/api/paymee_remote.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:app/features/payment/screens/web_view.dart ';

class TestPayment extends StatelessWidget {
  TestPayment({super.key});

  final FirebasePaymentService paymentService = FirebasePaymentService(
    FirebaseFirestore.instance,
    PaymentRemote('f91dcf0fb0914c3b42bc22978504de7dc088ef44'),
  );
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Test Payment')),
      body: Center(
        child: ElevatedButton(
          onPressed: () async {
            try {
              final paymentUrl = await paymentService.createPaymentMethod(
                userId: 'user123',
                amount: 10.0,
                type: 'paymee',
                method: 'online',
              );
              final result = await Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => WebViewScreen(paymentUrl: paymentUrl),
                ),
              );
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Payment result: $result')),
              );
            } catch (e) {
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(SnackBar(content: Text('Error: ${e.toString()}')));
            }
          },
          child: Text('Create Payment Method'),
        ),
      ),
    );
  }
}
