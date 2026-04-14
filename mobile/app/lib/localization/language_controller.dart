import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LanguageController extends GetxController {
  LanguageController(this._preferences);

  static const storageKey = 'app_locale';

  final SharedPreferences _preferences;
  final Rxn<Locale> _locale = Rxn<Locale>();

  Locale? get locale => _locale.value;

  bool get isArabic => _locale.value?.languageCode == 'ar';

  Future<void> init() async {
    final storedCode = _preferences.getString(storageKey);
    if (storedCode == null || storedCode.isEmpty) {
      _locale.value = const Locale('en');
      Get.updateLocale(_locale.value!);
      return;
    }

    _locale.value = Locale(storedCode);
    Get.updateLocale(_locale.value!);
  }

  Future<void> setLanguage(Locale newLocale) async {
    _locale.value = newLocale;
    await _preferences.setString(storageKey, newLocale.languageCode);
    Get.updateLocale(newLocale);
  }
}
