import 'package:app/features/auth/screens/home_screen.dart';
import 'package:app/features/auth/screens/splash_screen.dart';
import 'package:app/features/auth/screens/login_page.dart';
import 'package:app/features/auth/screens/home_test.dart';
import 'package:app/features/auth/screens/role_choice_screen.dart';
import 'package:app/features/auth/screens/controller_login.dart';
import 'package:app/features/auth/screens/direction_choice.dart';
import 'package:app/features/auth/auth_controller.dart'; // Import your controller
import 'package:get/get.dart';
import 'package:flutter/material.dart';

void main() async {
  // 1. Required for SharedPreferences and background services
  WidgetsFlutterBinding.ensureInitialized();

  // 2. Inject the AuthController into memory so Splash Screen can find it
  Get.put(AuthController());

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Wasalni',
      // The app starts here, and since AuthController is already "put", it won't crash
      home: const DirectionChoice(),
      getPages: [
        GetPage(name: '/rolechoice', page: () => const RoleChoicePage()),
        GetPage(name: '/login', page: () => const LoginScreen()),
        GetPage(name: '/home', page: () => const HomePage()),
        GetPage(name: '/loginforcontroller', page: () => const HomeScreen()),
      ],
    );
  }
}
