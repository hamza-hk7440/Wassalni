import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:app/core/theme/colors_R.dart';

class RechargePage extends StatelessWidget {
  const RechargePage({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.colorL, // Utilisation de ta couleur de fond
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Text(
          "Recharge my tokens ",
          style: GoogleFonts.poppins(
            color: AppColors.colorD,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios, color: AppColors.colorA),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildCurrentBalance(),
              const SizedBox(height: 30),
              Text(
                "Choose your pack :",
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.colorD,
                ),
              ),
              const SizedBox(height: 20),
              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 2, 
                crossAxisSpacing: 15,
                mainAxisSpacing: 15,
                childAspectRatio: 1.1, 
                children: [
                  _buildTokenPack(context, "20", "2 DT"),
                  _buildTokenPack(context, "50", "5 DT"),
                  _buildTokenPack(context, "80", "10 DT"),
                  _buildTokenPack(context, "150", "15 DT"),
                  _buildTokenPack(context, "300", "25 DT"),
                  _buildTokenPack(context, "500", "40 DT"),
                ],
              ),
              const SizedBox(height: 40),
              Container(
                padding: const EdgeInsets.all(15),
                decoration: BoxDecoration(
                  color: AppColors.colorA.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Text(
                  "Tokens allow you to buy your bus and train tickets instantly on Wasalni.",
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(fontSize: 13, color: AppColors.colorA),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCurrentBalance() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.colorA,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(color: AppColors.colorA.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 8)),
        ],
      ),
      child: Column(
        children: [
          Text("Current balance ", style: GoogleFonts.poppins(color: Colors.white70, fontSize: 14)),
          const SizedBox(height: 5),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset("assets/token.png", height: 28), // Icône token
              const SizedBox(width: 10),
              Text(
                "50", 
                style: GoogleFonts.poppins(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTokenPack(BuildContext context, String count, String price) {
    return GestureDetector(
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Pack of $count tokens selected")),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10, offset: const Offset(0, 4)),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Image.asset("assets/token.png", height: 22), 
                const SizedBox(width: 8),
                Text(
                  count,
                  style: GoogleFonts.poppins(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: AppColors.colorD,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 5),
            Text(
              "Tokens",
              style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey),
            ),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 5),
              decoration: BoxDecoration(
                color: AppColors.colorA.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                price,
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.colorA,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}