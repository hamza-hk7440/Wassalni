import 'package:app/features/auth/screens/recharge_screen.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:app/core/theme/colors_R.dart';
import 'recharge_screen.dart';
import 'my_tickets_screen.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.colorL,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Text(
          "My Profil",
          style: GoogleFonts.poppins(
            color: AppColors.colorD,
            fontWeight: FontWeight.bold,
            fontSize: 20,
          ),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios, color: AppColors.colorA),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 30),
            Center(
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 55,
                    backgroundColor: AppColors.colorA.withOpacity(0.1),
                    backgroundImage: const AssetImage("assets/profile.png"), // Ton asset existant
                  ),
                  const SizedBox(height: 15),
                  Text(
                    "Wasalni User ", // NOM DYNAMIQUE PLUS TARDS
                    style: GoogleFonts.poppins(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: AppColors.colorD,
                    ),
                  ),
                  Text(
                    "userWasalni@email.com",
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 35),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 25),
              child: Row(
                children: [
                  Expanded(
                    flex: 2,
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 20),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(15),
                        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10)],
                      ),
                      child: Row(
                        children: [
                          Image.asset("assets/token.png", height: 24),
                          const SizedBox(width: 12),
                          Text(
                            "50 Tokens",
                            style: GoogleFonts.poppins(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                              color: AppColors.colorD,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 15),
                  Expanded(
                    flex: 1,
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.push(context, MaterialPageRoute(builder: (context) => const RechargePage()));
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.colorA,
                        padding: const EdgeInsets.symmetric(vertical: 15),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                        elevation: 0,
                      ),
                      child: const Icon(Icons.add_rounded, color: Colors.white, size: 30),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 30),
            _buildSectionTitle("Account & Security"),
            _buildProfileItem(Icons.lock_outline, "Change password"),
            _buildProfileItem(Icons.person_outline, "Personal informations"),
            const SizedBox(height: 20),
            _buildSectionTitle("Activities"),
            _buildProfileItem(Icons.confirmation_number_outlined, "Tickets history", 
              onTap: () {
                 Navigator.push(context, MaterialPageRoute(builder: (context) =>  MyTicketsPage()));
              }
            ),
            _buildProfileItem(Icons.notifications_none, " Notifications settings"),
            const SizedBox(height: 30),
            // --- LOGOUT ---
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 25),
              child: ListTile(
                onTap: () {},
                tileColor: Colors.red.withOpacity(0.05),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                leading: const Icon(Icons.logout, color: Colors.red),
                title: Text(
                  "Log out",
                  style: GoogleFonts.poppins(color: Colors.red, fontWeight: FontWeight.w600),
                ),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 30, bottom: 10, top: 10),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Text(
          title,
          style: GoogleFonts.poppins(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            color: Colors.grey[400],
          ),
        ),
      ),
    );
  }
Widget _buildProfileItem(IconData icon, String title, {VoidCallback? onTap}) {
  return Padding(
    padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 5),
    child: ListTile(
      onTap: onTap ?? () {},
      tileColor: Colors.white, 
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15),
      ),
      leading: Icon(icon, color: AppColors.colorA),
      title: Text(
        title,
        style: GoogleFonts.poppins(
          fontSize: 15, 
          fontWeight: FontWeight.w500, 
          color: AppColors.colorD,
        ),
      ),
      trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
    ),
  );
}
}