import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:app/core/theme/colors_R.dart';


class HomePage extends StatefulWidget {
  const HomePage ({super.key});
  @override
  State<HomePage> createState() => HomePageState();
  }
class HomePageState extends State<HomePage>{
  int _selectedIndex =0;
  int _tokenCount =0;
  @override
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: AppColors.colorL,
      body: SafeArea( child: Column(children: [
      Padding(padding: const EdgeInsets.symmetric(horizontal: 20 , vertical: 15),
      child: Row( mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      Text("Wasalni", style: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.w900 , color: AppColors.colorA)),
      Row(children: [
            Container( padding: const EdgeInsets.symmetric(horizontal: 15 , vertical: 5),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)],),
            child: Row( children: [Image.asset("assets/token.png", height: 25 , width: 25),
            const SizedBox(width: 8),
            Text("$_tokenCount", style: GoogleFonts.poppins(fontWeight: FontWeight.bold,fontSize: 20 ,color: AppColors.colorA),)
            ],),),
      const SizedBox(width: 10),
      _buildNotificationIcon(),
      ],)],),),
      Expanded(child: Center(
      child: SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 25),
      child: Column( mainAxisAlignment: MainAxisAlignment.center , children: [
      Text("Where are you going today ?" , textAlign: TextAlign.center , style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.colorA),),
      const SizedBox(height: 30),
      _buildTransportCard(title: "Train Station", subtitle: "Check schedule & buy tickets ", imagePath: "assets/trainnn.png", onTap: () => print("Vers Train Scedule")),
      const SizedBox(height: 20),
      _buildTransportCard(title: "Bus Station", subtitle: "Find the next Bus available", imagePath: "assets/bus.png", onTap: () => print("Vers Bus Schedule"))
          ],),
          ),
        )),
      ],)),
    bottomNavigationBar: BottomNavigationBar(currentIndex: _selectedIndex, onTap: (index) => setState(() => _selectedIndex = index),selectedItemColor: AppColors.colorA,unselectedItemColor: Colors.grey, items: [
    BottomNavigationBarItem(icon: Image.asset("assets/home.png", height: 24,),activeIcon: Image.asset("assets/home.png" , height: 24),label: "Home"),
    BottomNavigationBarItem(icon: Image.asset("assets/tickett.png", height: 24), label: "Tickets"),
    BottomNavigationBarItem(icon: Image.asset("assets/profile.png" , height: 24), label: "Profile"),
      ], 
     ),
    );
  }
  Widget _buildNotificationIcon() {
    return Stack(
      children: [IconButton(icon: Icon(Icons.notifications_none_rounded, color: Colors.amber, size:29), onPressed: () {},),
      Positioned(right: 8 , top: 8 , child: Container( height: 8 ,width: 8,
      decoration: BoxDecoration(color: Colors.red, shape: BoxShape.circle,border: Border.all(color: Colors.white, width: 1.5))))
      ],
    );
  }
    Widget _buildTransportCard({
      required String title , 
      required String subtitle , 
      required String imagePath , 
      required VoidCallback onTap }){
      return GestureDetector( onTap: onTap, child: Container( 
      width: double.infinity, 
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), 
      boxShadow: [BoxShadow(color: AppColors.colorA.withOpacity(0.08), blurRadius: 15, offset: const Offset(0, 10),),],),
      child: Row( children: [Image.asset(imagePath, height: 58, width: 58),
      const SizedBox(width: 25),
      Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start , 
      children: [Text(title, style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.colorA),),
      const SizedBox(height: 5),
      Text(subtitle, style: GoogleFonts.poppins(fontSize: 13, color: Colors.grey))],),),
      Icon(Icons.arrow_forward_ios, color: AppColors.colorA, size: 16),],
         ),
       ),
     );
     }
     
}

