import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:app/core/theme/colors_R.dart';

class ControllerHomePage extends StatefulWidget {
  const ControllerHomePage({super.key});
  @override
  State<ControllerHomePage> createState() => _ControllerHomePageState();
}
class _ControllerHomePageState extends State<ControllerHomePage> {
  final TextEditingController _idController = TextEditingController();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.colorL,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Text( "WASALNI CONTROLLER", style: GoogleFonts.poppins(color: AppColors.colorA, fontWeight: FontWeight.bold, fontSize: 18,),),
        centerTitle: true,
        actions: [IconButton(icon: const Icon(Icons.logout, color: Colors.redAccent),onPressed: () => Navigator.pop(context), ),
        ],
      ),
      body: SingleChildScrollView(
      child: Padding(
      padding: const EdgeInsets.all(25.0),
        child: Column(crossAxisAlignment: CrossAxisAlignment.center, children: [
          const SizedBox(height: 20),
          Text("Scan the Ticket", style: GoogleFonts.poppins( fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.colorD,),),
          const SizedBox(height: 10),
          Text("Position the passenger's QR code within the frame", textAlign: TextAlign.center, style: GoogleFonts.poppins(fontSize: 14, color: Colors.grey),),
          const SizedBox(height: 30),
          GestureDetector(
            onTap: () {
                  print("OPEN SCANNER");
            },
            child: Container(width: 220, height: 220, decoration: BoxDecoration( color: Colors.white, borderRadius: BorderRadius.circular(30),border: Border.all(color: AppColors.colorA, width: 2),
              boxShadow: [
                      BoxShadow(
                        color: AppColors.colorA.withOpacity(0.1),
                        blurRadius: 20,
                        spreadRadius: 5,
                      ),
                    ],
                  ),
              child: Column(mainAxisAlignment: MainAxisAlignment.center,
                children: [ Icon(Icons.qr_code_scanner_rounded, size: 80, color: AppColors.colorA),
                const SizedBox(height: 15),
                Text("OPEN SCANNER", style: GoogleFonts.poppins(fontWeight: FontWeight.bold, color: AppColors.colorA,fontSize: 12,),),],
              ),
            ),
          ),
          const SizedBox(height: 50),
              Row(
                children: [
                  Expanded(child: Divider(color: Colors.grey[300])),
                  Padding(padding: const EdgeInsets.symmetric(horizontal: 15), child: Text("OR", style: GoogleFonts.poppins(color: Colors.grey)),),
                  Expanded(child: Divider(color: Colors.grey[300])),
                ],
              ),
          const SizedBox(height: 40),
          Text( "Manual ID Entry : ", style: GoogleFonts.poppins( fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.colorD,),),
          const SizedBox(height: 15),
          TextField(
            controller: _idController,
            decoration: InputDecoration( hintText: "Ex: WSL-9842", prefixIcon: Icon(Icons.numbers, color: AppColors.colorA), filled: true, fillColor: Colors.white,
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(15), borderSide: BorderSide.none,),
              enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                    borderSide: BorderSide(color: AppColors.colorA.withOpacity(0.2)),
                  ),
                ),
              ),
          const SizedBox(height: 20),
          SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
              onPressed: () { print("VERIFY TICKET : ${_idController.text}");},
              style: ElevatedButton.styleFrom( backgroundColor: AppColors.colorD, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)), elevation: 0,),
              child: Text("VERIFY TICKET", style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15,),),
              ),
          ),],
         ),
        ),
      ),
    );
  }
}