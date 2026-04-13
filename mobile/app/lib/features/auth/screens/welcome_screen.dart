import 'package:app/core/theme/colors_R.dart';
import 'package:app/features/auth/auth_controller.dart';
import 'package:app/features/auth/screens/home_screen.dart';
import 'package:app/features/auth/screens/login_page.dart';
import 'package:app/localization/language_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  void _continue(BuildContext context) {
    final authController = Get.find<AuthController>();
    if (authController.isAuthenticated.value) {
      Get.offAll(() => const HomePage());
      return;
    }
    Get.offAll(() => const LoginScreen());
  }

  @override
  Widget build(BuildContext context) {
    final languageController = Get.find<LanguageController>();

    return Scaffold(
      backgroundColor: AppColors.colorL,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Obx(
                () => Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Image.asset('assets/AppIcon.png', height: 140),
                    const SizedBox(height: 28),
                    Text(
                      'welcome_title'.tr,
                      textAlign: TextAlign.center,
                      style: GoogleFonts.poppins(
                        fontSize: 30,
                        fontWeight: FontWeight.w800,
                        color: AppColors.colorA,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'welcome_message'.tr,
                      textAlign: TextAlign.center,
                      style: GoogleFonts.poppins(
                        fontSize: 15,
                        color: Colors.grey[700],
                      ),
                    ),
                    const SizedBox(height: 28),
                    _languageTile(
                      title: 'english'.tr,
                      subtitle: 'English',
                      selected:
                          (languageController.locale?.languageCode ?? 'en') ==
                          'en',
                      onTap: () =>
                          languageController.setLanguage(const Locale('en')),
                    ),
                    const SizedBox(height: 14),
                    _languageTile(
                      title: 'arabic'.tr,
                      subtitle: 'العربية',
                      selected:
                          (languageController.locale?.languageCode ?? 'en') ==
                          'ar',
                      onTap: () =>
                          languageController.setLanguage(const Locale('ar')),
                    ),
                    const SizedBox(height: 30),
                    SizedBox(
                      width: double.infinity,
                      height: 54,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.colorA,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        onPressed: () => _continue(context),
                        child: Text(
                          'continue'.tr,
                          style: GoogleFonts.poppins(
                            color: Colors.white,
                            fontWeight: FontWeight.w700,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextButton(
                      onPressed: () => _continue(context),
                      child: Text(
                        'skip'.tr,
                        style: GoogleFonts.poppins(
                          color: AppColors.colorA,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _languageTile({
    required String title,
    required String subtitle,
    required bool selected,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: double.infinity,
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: selected ? AppColors.colorA : Colors.grey.shade200,
            width: selected ? 2 : 1,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 10,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        child: Row(
          children: [
            Icon(
              selected ? Icons.radio_button_checked : Icons.radio_button_off,
              color: AppColors.colorA,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: AppColors.colorD,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: GoogleFonts.poppins(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
