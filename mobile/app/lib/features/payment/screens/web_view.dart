import 'package:flutter/material.dart';
import 'package:app/data/models/payment_model.dart';
import 'package:app/data/services/firebase/payment_service_MYVERSION.dart';
import 'package:app/data/services/api/paymee_remote.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:webview_flutter/webview_flutter.dart';

class WebViewScreen extends StatelessWidget {
  final String paymentUrl;

  const WebViewScreen({required this.paymentUrl, super.key});
  @override
  Widget build(BuildContext context) {
    final WebViewController controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onNavigationRequest: (NavigationRequest request) {
            if (request.url.contains('success')) {
              Navigator.pop(context, 'success');
              return NavigationDecision.prevent;
            } else if (request.url.contains('failure')) {
              Navigator.pop(context, 'failure');
              return NavigationDecision.prevent;
            }
            return NavigationDecision.navigate;
          },
          onPageFinished: (String url) {
            if (url.contains('success')) {
              Navigator.pop(context, 'success');
            } else if (url.contains('failure')) {
              Navigator.pop(context, 'failure');
            }
          },
        ),
      )
      ..loadRequest(Uri.parse(paymentUrl));

    return Scaffold(
      appBar: AppBar(title: Text('Payment')),
      body: WebViewWidget(controller: controller),
    );
  }
}
