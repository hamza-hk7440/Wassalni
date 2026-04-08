import 'package:app/features/auth/screens/home_screen.dart';
import 'package:app/features/auth/screens/profile_screen.dart';
import 'package:app/features/auth/screens/recharge_screen.dart';
import 'package:app/features/auth/screens/controller_home_screen.dart';
import 'package:app/features/auth/screens/splash_screen.dart';
import 'package:app/features/auth/screens/login_page.dart';
import 'package:app/features/auth/screens/home_test.dart';
import 'package:app/features/auth/screens/my_tickets_screen.dart';
import 'package:app/features/auth/auth_controller.dart'; // Import your controller
import 'package:app_links/app_links.dart'; // Import app_links for deep linking
import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:app/features/auth/screens/super_admin_home.dart';
import 'package:app/features/auth/screens/payment_callback_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  Get.put(AuthController());
  _initDeepLinks();
  runApp(const MyApp());
}

void _handleIncomingDeepLink(Uri uri) {
  debugPrint('🔗 Deep link received: $uri');
  if (uri.scheme != 'myapp') return;

  if (uri.host == 'auth') {
    final authController = Get.find<AuthController>();
    authController.handleGoogleCallback(uri);
    return;
  }

  if (uri.host == 'payment') {
    final rawStatus =
        uri.queryParameters['status'] ??
        uri.queryParameters['payment_status'] ??
        '';
    final normalized = rawStatus.toLowerCase();
    final isSuccess =
        normalized == 'success' ||
        normalized == 'completed' ||
        normalized == 'true';

    final transactionId = uri.queryParameters['transaction_id'];

    // read new_balance directly from the URL — no polling needed
    final newBalanceStr = uri.queryParameters['new_balance'];
    final newBalance = newBalanceStr != null
        ? int.tryParse(newBalanceStr)
        : null;

    debugPrint(
      '💰 Payment callback — isSuccess: $isSuccess, newBalance: $newBalance',
    );

    Get.to(
      () => PaymentCallbackScreen(
        isSuccess: isSuccess,
        transactionId: transactionId,
        newBalance: newBalance,
      ),
    );
  }
}

void _initDeepLinks() {
  final appLinks = AppLinks();

  appLinks.getInitialLink().then((uri) {
    if (uri != null) _handleIncomingDeepLink(uri);
  });

  appLinks.uriLinkStream.listen((uri) {
    _handleIncomingDeepLink(uri);
  });
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Wasalni',
      // The app starts here, and since AuthController is already "put", it won't crash
      home: const SplashScreen(),
      getPages: [
        GetPage(name: '/login', page: () => const LoginScreen()),
        GetPage(name: '/home', page: () => const HomePage()),
        GetPage(
          name: '/controllerhome',
          page: () => const ControllerHomePage(),
        ),
        GetPage(name: '/superadminhome', page: () => const SuperAdminHome()),
      ],
    );
  }
}
