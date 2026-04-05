import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:app/core/theme/colors_R.dart';

class MyTicketsPage extends StatelessWidget {
  const MyTicketsPage({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.colorL,
      appBar: AppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      centerTitle: true,
        title: Text(
          "My Tickets",
          style: GoogleFonts.poppins(
            color: AppColors.colorD,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios, color: AppColors.colorA, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          _buildTicketItem(
            context,
            ticketId: "RNN-0111",
            type: "BUS",
            departure: "Monastir",
            arrival: "Bekalta",
            date: "10 Avril 2026",
            time: "16:30",
            price: "2 Tokens",
            isActive: true,
            icon: Icons.directions_bus,
          ),
          const SizedBox(height: 15),
          _buildTicketItem(
            context,
            ticketId: "ABMT-000",
            type: "TRAIN",
            departure: "Mahdia",
            arrival: "Ksiba bannen",
            date: "15 Avril 2026",
            time: "08:30",
            price: "5 Tokens",
            isActive: false,
            icon: Icons.train,
          ),
          const SizedBox(height: 15),
          _buildTicketItem(
            context,
            ticketId: "XXXX-10",
            type: "BUS",
            departure: "Monastir",
            arrival: "Moknin",
            date: "28 Avril 2026",
            time: "18:30",
            price: "3 Tokens",
            isActive: false,
            icon: Icons.directions_bus,
          ),
        ],
      ),
    );
  }

Widget _buildTicketItem(
  BuildContext context, {
  required String ticketId, // NOUVEAU PARAMÈTRE
  required String type,
  required String departure,
  required String arrival,
  required String date,
  required String time,
  required String price,
  required bool isActive,
  required IconData icon,
}) {
  return Container(
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(20),
      border: Border.all(
        color: AppColors.colorA.withOpacity(0.3), 
        width: 1,
      ),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.03),
          blurRadius: 10,
          offset: const Offset(0, 5),
        ),
      ],
    ),
    child: Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
          children: [
            Row( mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                Row(children: [
                    Icon(icon, color: AppColors.colorA, size: 16),
                    const SizedBox(width: 6),
                    Text(type, style: GoogleFonts.poppins(fontWeight: FontWeight.bold,color: AppColors.colorA,fontSize: 14,),),
                    ],
                ),
                Text("ID: #$ticketId", style: GoogleFonts.poppins(fontSize: 10, fontWeight: FontWeight.w500, color: Colors.grey[1000],), ),
                ],
              ),
              Text(price, style: GoogleFonts.poppins( fontWeight: FontWeight.bold, color: AppColors.colorD, fontSize: 16,),),
              ],
            ),
            const Divider(height: 25),
            Row( mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildStationColumn("Departure", departure),
                Column(
                    children: [ Icon(Icons.trending_flat, color: AppColors.colorA.withOpacity(0.5)),
                      Text(time, style: GoogleFonts.poppins( fontSize: 14,fontWeight: FontWeight.bold, color: AppColors.colorA,),),
                    ],
                ),
                _buildStationColumn("Arrival", arrival, isRight: true),
              ],
            ),
            const SizedBox(height: 15),
            Align(alignment: Alignment.centerLeft,
                child: Text(
                  "Day: $date",
                  style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[600]),
                ),
              ),
            ],
          ),
        ),

      Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isActive ? Colors.green.withOpacity(0.1) : Colors.grey.withOpacity(0.1),
            borderRadius: const BorderRadius.only(
              bottomLeft: Radius.circular(19),
              bottomRight: Radius.circular(19),
            ),
          ),
          child: Text(
            isActive ? "ACTIVE" : "EXPIRED",
            textAlign: TextAlign.center,
            style: GoogleFonts.poppins(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: isActive ? Colors.green : Colors.grey[600],
            ),
          ),
        ),
      ],
    ),
  );
}

  Widget _buildStationColumn(String label, String city, {bool isRight = false}) {
    return Column(
      crossAxisAlignment: isRight ? CrossAxisAlignment.end : CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.poppins(fontSize: 11, color: Colors.grey),
        ),
        Text(
          city,
          style: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: AppColors.colorD,
          ),
        ),
      ],
    );
  }
}