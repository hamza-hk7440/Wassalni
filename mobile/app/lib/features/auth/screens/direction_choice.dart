import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:app/core/theme/colors_R.dart';
import 'TrainSchedule_screen.dart';

class DirectionChoice extends StatelessWidget {
  const DirectionChoice({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.colorL,
      body: SafeArea(
        child: Align(
          alignment: Alignment.center,
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 30),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Image.asset("assets/trainnn.png", height: 100),
                const SizedBox(height: 25),
                Text(
                  "Which direction?",
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(
                    fontSize: 27,
                    fontWeight: FontWeight.w900,
                    color: AppColors.colorD,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  "Please select your direction to continue",
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 50),
                _buildDirectionCard(
                  context,
                  title: "Monastir    ➔    Mahdia",
                  direction: "mahdia",
                ),
                const SizedBox(height: 20),
                _buildDirectionCard(
                  context,
                  title: "Mahdia    ➔    Monastir",
                  direction: "monastir",
                ),
                const SizedBox(height: 30),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDirectionCard(
    BuildContext context, {
    required String title,
    required String direction,
  }) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => TrainSchedulePage(direction: direction),
          ),
        );
      },
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
            Expanded(
              child: Text(
                title,
                style: GoogleFonts.poppins(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                  color: AppColors.colorD,
                ),
              ),
            ),
            Icon(Icons.arrow_forward_ios, color: AppColors.colorA, size: 18),
          ],
        ),
      ),
    );
  }
}
