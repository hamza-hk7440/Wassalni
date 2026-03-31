import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:get/get.dart';
import 'package:app/core/theme/colors_R.dart';
import '../role_choice_controller.dart';

class RoleChoicePage extends StatelessWidget {
  const RoleChoicePage({super.key});

  @override
  Widget build(BuildContext context) {
    final RoleChoiceController controller = Get.put(RoleChoiceController());

    return Scaffold(
      backgroundColor: AppColors.colorL,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 30),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                "Who are you ?",
                style: GoogleFonts.poppins(
                  fontSize: 32,
                  fontWeight: FontWeight.w900,
                  color: AppColors.colorA,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                "Please select your role to continue",
                textAlign: TextAlign.center,
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  color: Colors.grey[600],
                ),
              ),
              const SizedBox(height: 50),

              
              _buildRoleCard(
                context,
                title: "Passenger",
                imagePath: "assets/users.png",
                onTap: () => controller.selectRole('passenger'),
              ),

              const SizedBox(height: 30),

              
              _buildRoleCard(
                context,
                title: "Controller",
                imagePath: "assets/controller.png",
                onTap: () => controller.selectRole('controller'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRoleCard(
    BuildContext context, {
    required String title,
    required String imagePath,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(25),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: AppColors.colorA.withOpacity(0.1),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Row(
          children: [
            Image.asset(
              imagePath,
              height: 60,
              width: 60,
              color: AppColors.colorA,
              colorBlendMode: BlendMode.srcIn,
            ),
            const SizedBox(width: 20),
            Text(
              title,
              style: GoogleFonts.poppins(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: AppColors.colorA,
              ),
            ),
            const Spacer(),
            Icon(Icons.arrow_forward_ios, color: AppColors.colorA, size: 18),
          ],
        ),
      ),
    );
  }
}
