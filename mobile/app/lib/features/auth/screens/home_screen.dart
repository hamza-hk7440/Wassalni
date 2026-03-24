import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:app/core/theme/colors_R.dart';
import 'BusSchedule_screen.dart';
import 'TrainSchedule_screen.dart';

class HomePage extends StatefulWidget {
  const HomePage ({super.key});
  @override
  State<HomePage> createState() => HomePageState();
  }
class HomePageState extends State<HomePage>{
  int _selectedIndex =0;
  @override
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: AppColors.colorL,
      body: SafeArea(child: SingleChildScrollView(child: Container(constraints: BoxConstraints(minHeight: MediaQuery.of(context).size.height - MediaQuery.of(context).padding.top - kBottomNavigationBarHeight - 40), 
      padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 20),
      child: Column( mainAxisAlignment: MainAxisAlignment.center,crossAxisAlignment: CrossAxisAlignment.start, 
      children: [
      Row(mainAxisAlignment: MainAxisAlignment.spaceBetween,children: 
      [Expanded(
        child: Text("Where are you going today?", style: GoogleFonts.poppins( fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.colorA),),
      ),
      _buildNotificationIcon(),],),

      const SizedBox(height: 42),
      _buildTransportCard(
      title: "Train Station", subtitle: "Check schedule & buy tickets", imagePath: "assets/trainn.png", onTap:(){
          //Navigator.push(context, MaterialPageRoute(builder: (context) => TrainSchedulePage()));
          print("To Train schedule ");
          },
      ),
      const SizedBox(height: 20),
      _buildTransportCard(
        title : "Bus Station ", subtitle :"Find the next Bus available", imagePath: "assets/bus.png", onTap: (){
          //Navigator.push(context, MaterialPageRoute(builder: (context) => BusSchedulePage()),);
          print("To Bus schedule ");
        },
      ),
      ],),),
      ),
      ),
    bottomNavigationBar: BottomNavigationBar(currentIndex: _selectedIndex, onTap: (index) => setState(() => _selectedIndex = index),selectedItemColor: AppColors.colorA,unselectedItemColor: Colors.grey, items: [
    BottomNavigationBarItem(icon: Image.asset("assets/home.png", height: 24,),activeIcon: Image.asset("assets/home.png"),label: "Home"),
    BottomNavigationBarItem(icon: Image.asset("assets/tickett.png", height: 24), label: "Tickets"),
    BottomNavigationBarItem(icon: Image.asset("assets/profile.png" , height: 24), label: "Profile"),
      ], 
     ),
    );
  }
  Widget _buildNotificationIcon() {
    return Stack(
      children: [IconButton(icon: Icon(Icons.notifications_none_rounded, color: Colors.amber, size:30), onPressed: () {},
      ),
      Positioned(right: 12 , top: 12 , child: Container( height: 10 ,width: 10, decoration: BoxDecoration(color: Colors.red, shape: BoxShape.circle,border: Border.all(color: Colors.white, width: 2),),),)
      ],
    );
  }
    Widget _buildTransportCard({
      required String title , 
      required String subtitle , 
      required String imagePath , 
      required VoidCallback onTap }){
      return GestureDetector( onTap: onTap, child: Container( width: double.infinity, padding: const EdgeInsets.all(20), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: AppColors.colorA.withOpacity(0.08), blurRadius: 15, offset: const Offset(0, 10),),],),
      child: Row( children: [Image.asset(imagePath, height: 55, width: 55),
      const SizedBox(width: 20),
      Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start , children: [Text(title, style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.colorA),),
      const SizedBox(height: 5),
      Text(subtitle, style: GoogleFonts.poppins(fontSize: 13, color: Colors.grey))],),),
      Icon(Icons.arrow_forward_ios, color: AppColors.colorA, size: 16),],
        ),
      ),
    );
    }
}

