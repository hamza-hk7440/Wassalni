import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:app/features/auth/auth_controller.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:app/core/theme/colors_R.dart';

class SuperAdminHome extends StatelessWidget {
  const SuperAdminHome({super.key});
 @override
  Widget build(BuildContext context) {
    return Scaffold(
    backgroundColor: AppColors.colorL,
    appBar: AppBar(
    backgroundColor: Colors.white,
    elevation: 0,
    title: Text("SUPER ADMIN DASHBOARD", style: GoogleFonts.poppins(color: AppColors.colorD,fontWeight: FontWeight.bold,fontSize: 16,),),
    actions: [IconButton( icon: const Icon(Icons.notifications_none, color: Colors.grey), onPressed: () {},),],
    ),
    body: SingleChildScrollView(
    padding: const EdgeInsets.all(20),
    child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text("Daily Overview", style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.colorD,),),
      const SizedBox(height: 20),
      Row(children: [ _buildStatCard("Daily Revenue", "1,250 DT", Icons.payments, Colors.green, fullWidth: true),],),
      const SizedBox(height: 15),
      Row(children: [
                _buildStatCard("Transactions", "342", Icons.sync_alt, Colors.orange),
                const SizedBox(width: 15),
                _buildStatCard("System Health", "99.9%", Icons.speed, Colors.blue),
              ],
      ),
      const SizedBox(height: 30),
      _buildSectionTitle("Users & Staff"),
      const SizedBox(height: 10),
      Row( children: [
            _buildStatCard("Total Users", "12.5k", Icons.people, AppColors.colorA),
            const SizedBox(width: 15),
            _buildStatCard("Active Admins", "8", Icons.admin_panel_settings, Colors.purple),
            ],
      ),
      const SizedBox(height: 15),
      Row(children: [ _buildStatCard("Controllers", "24", Icons.verified_user, Colors.teal, fullWidth: true),],),
      const SizedBox(height: 30),
      _buildSectionTitle("Fleet Status (Active)"),
      const SizedBox(height: 10),
      Row(children: [
            _buildStatCard("Active Bus", "45", Icons.directions_bus, Colors.blueAccent),
            const SizedBox(width: 15),
            _buildStatCard("Active Metro", "12", Icons.train, Colors.redAccent),
          ],
      ),
      const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color, {bool fullWidth = false}) {
    return Expanded(
      flex: fullWidth ? 2 : 1,
      child: Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color.withOpacity(0.2), width: 1),
          boxShadow: [BoxShadow(color: color.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 5),),],),
          child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
          CircleAvatar(backgroundColor: color.withOpacity(0.1), radius: 18, child: Icon(icon, color: color, size: 20),),
          const SizedBox(height: 15),
          Text(value, style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.colorD,),),
          Text(title, style: GoogleFonts.poppins( fontSize: 12, color: Colors.grey[600], fontWeight: FontWeight.w500,),),
          ],
        ),
      ),
    );
  }
  Widget _buildSectionTitle(String title) {
    return Text(title, style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600,color: Colors.grey[800],),);
  }
}
