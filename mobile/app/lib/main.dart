import 'package:app/features/auth/screens/splash_screen.dart';
import 'package:get/get.dart'; // ← ADD THIS
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      // ← CHANGE THIS (was MaterialApp)
      debugShowCheckedModeBanner: false,
      title: 'Wasalni',
      home: const SplashScreen(),
    );
  }
}
