import 'package:flutter/material.dart';

class AppTextStyles {
  AppTextStyles._();

  static const TextStyle grandTitre = TextStyle(
    fontFamily: 'serif',
    fontSize: 25,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.4,
  );

  static const TextStyle sousTitre = TextStyle(
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.3,
  );

  static const TextStyle section = TextStyle(
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: FontWeight.w600,
  );

  static const TextStyle body = TextStyle(
    fontFamily: 'sans-serif',
    fontSize: 14,
    fontWeight: FontWeight.w400,
    height: 1.6,
  );

  static const TextStyle bodySmall = TextStyle(
    fontFamily: 'sans-serif',
    fontSize: 13,
    fontWeight: FontWeight.w400,
    height: 1.4,
  );

  static const TextStyle input = TextStyle(
    fontFamily: 'sans-serif',
    fontSize: 14,
    fontWeight: FontWeight.w500,
  );

  static const TextStyle hint = TextStyle(
    fontFamily: 'sans-serif',
    fontSize: 13,
    fontWeight: FontWeight.w400,
    letterSpacing: 0.2,
  );

  
  static const TextStyle button = TextStyle(
    fontFamily: 'sans-serif',
    fontSize: 16,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.4,
  );

  static const TextStyle link = TextStyle(
    fontFamily: 'sans-serif',
    fontSize: 14,
    fontWeight: FontWeight.w500,
    decoration: TextDecoration.underline,
  );
}
