import 'package:app/features/auth/screens/home_screen.dart';
import 'package:app/features/auth/screens/profile_screen.dart';
import 'package:app/features/auth/screens/recharge_screen.dart';
import 'package:app/features/auth/screens/splash_screen.dart';
import 'package:app/features/auth/screens/login_page.dart';
import 'package:app/features/auth/screens/home_test.dart';
import 'package:app/features/auth/screens/payment_callback_screen.dart';
import 'package:app/features/auth/screens/role_choice_screen.dart';
import 'package:app/features/auth/auth_controller.dart'; // Import your controller
import 'package:app_links/app_links.dart'; // Import app_links for deep linking
import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:app/features/auth/screens/super_admin_home.dart';

void main() async {
  // 1. Required for SharedPreferences and background services
  WidgetsFlutterBinding.ensureInitialized();

  // 2. Inject the AuthController into memory so Splash Screen can find it
  Get.put(AuthController());

  // 3. Set up deep link listener for Google OAuth callback
  _initDeepLinks();

  runApp(const MyApp());
}

/// Initializes deep link handling for Google OAuth redirects.
/// Listens for incoming links matching myapp://auth/callback
/// and forwards them to AuthController.handleGoogleCallback()
void _handleIncomingDeepLink(Uri uri) {
  if (uri.scheme != 'myapp') {
    return;
  }

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

    Get.to(
      () => PaymentCallbackScreen(
        isSuccess: isSuccess,
        transactionId: transactionId,
      ),
    );
  }
}

void _initDeepLinks() {
  final appLinks = AppLinks();

  appLinks.getInitialLink().then((uri) {
    if (uri != null) {
      _handleIncomingDeepLink(uri);
    }
  });

  // Handle deep link when the app is already open in the foreground/background
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
        GetPage(name: '/rolechoice', page: () => const RoleChoicePage()),
        GetPage(name: '/login', page: () => const LoginScreen()),
        GetPage(name: '/home', page: () => const HomePage()),
        GetPage(name: '/controllerhome', page: () => const HomeScreen()),
        GetPage(name: '/superadminhome', page: () => const SuperAdminHome()),
      ],
    );
  }
}
