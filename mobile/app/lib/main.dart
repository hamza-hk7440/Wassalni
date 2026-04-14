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
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:app/features/auth/screens/super_admin_home.dart';
import 'package:app/features/auth/screens/payment_callback_screen.dart';
import 'package:app/features/auth/screens/welcome_screen.dart';
import 'package:app/localization/app_translations.dart';
import 'package:app/localization/language_controller.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final preferences = await SharedPreferences.getInstance();
  final languageController = LanguageController(preferences);
  await languageController.init();
  Get.put(AuthController(), permanent: true);
  Get.put(languageController, permanent: true);
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

    final languageController = Get.find<LanguageController>();

    return Obx(() {
      final locale = languageController.locale ?? const Locale('en');
      final useArabic = locale?.languageCode == 'ar';

      return GetMaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'app_title'.tr,
        translations: AppTranslations(),
        locale: locale,
        fallbackLocale: const Locale('en'),
        supportedLocales: AppTranslations.supportedLocales,
        localizationsDelegates: const [
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        theme: ThemeData(
          textTheme: useArabic
              ? GoogleFonts.cairoTextTheme()
              : GoogleFonts.poppinsTextTheme(),
        ),
        builder: (context, child) {
          return Directionality(
            textDirection: useArabic ? TextDirection.rtl : TextDirection.ltr,
            child: child ?? const SizedBox.shrink(),
          );
        },
        home: const SplashScreen(),
        getPages: [
          GetPage(name: '/welcome', page: () => const WelcomeScreen()),
          GetPage(name: '/login', page: () => const LoginScreen()),
          GetPage(name: '/home', page: () => const HomePage()),
          GetPage(
            name: '/controllerhome',
            page: () => const ControllerHomePage(),
          ),
          GetPage(name: '/superadminhome', page: () => const SuperAdminHome()),
        ],
      );
    });
  }
}
