import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:app/core/theme/colors_R.dart';
class TrainSchedulePage extends StatefulWidget {
  const TrainSchedulePage({super.key});
  @override
  State<TrainSchedulePage> createState() => _TrainSchedulePageState();
}
class _TrainSchedulePageState extends State<TrainSchedulePage> {
  int _tokenCount = 50; 
  final ScrollController _scrollController = ScrollController();
  bool _isExtended = true;
  @override
  void initState() {
    super.initState();
    // Animation du bouton flottant au scroll
    _scrollController.addListener(() {
      if (_scrollController.offset > 50 && _isExtended) {
        setState(() => _isExtended = false);
      } else if (_scrollController.offset <= 50 && !_isExtended) {
        setState(() => _isExtended = true);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(backgroundColor: AppColors.colorL, body: SafeArea(child: Column( children: [
      Padding(padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween,children: [
      Row(children: [IconButton(icon: Icon(Icons.arrow_back_ios, color: AppColors.colorA, size: 20), onPressed: () => Navigator.pop(context),),
      Text("Train Schedule", style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.colorA)),
      ],),
      _buildTokenCounter(),
          ],
        ),
      ),
      Expanded(child: ListView(
        controller: _scrollController,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        children: [
                  _buildScheduleCard("Tunis", "Sousse", "08:30", "10:45", 12),
                  _buildScheduleCard("Sousse", "Tunis", "13:15", "15:30", 12),
                  _buildScheduleCard("Tunis", "Monastir", "09:00", "11:50", 15),
                  _buildScheduleCard("Mahdia", "Sousse", "07:00", "08:15", 5),
                ],
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        isExtended: _isExtended,
        onPressed: () => _showPurchaseDialog("Tunis", "Sousse", "08:30", "10:45", 12),
        backgroundColor: AppColors.colorA,
        icon: const Icon(Icons.confirmation_number_rounded, color: Colors.white),
        label: Text("Quick Buy", style: GoogleFonts.poppins(fontWeight: FontWeight.bold, color: Colors.white)),
      ),
    );
  }

  void _showPurchaseDialog(String from, String to, String dep, String arr, int pricePerTicket) {
    int quantity = 1;
    showModalBottomSheet(
    context: context, isScrollControlled: true,
      backgroundColor: Colors.transparent, builder: (context) {
      return StatefulBuilder( builder: (context, setModalState) {
      return Container(padding: const EdgeInsets.all(30),decoration: const BoxDecoration(color: Colors.white, borderRadius: BorderRadius.vertical(top: Radius.circular(30)),),
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Container(width: 50, height: 5, decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(10))),
        const SizedBox(height: 20),
        Text("Ticket Details", style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.colorA)),
        const Divider(height: 40),
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [ _buildDetailItem("From", from, dep), Icon(Icons.arrow_forward, color: AppColors.colorA), _buildDetailItem("To", to, arr),],),
        const SizedBox(height: 30),
        Row( mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Text("Tickets:", style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
        Row(children: [_quantityBtn(Icons.remove, () { if(quantity > 1) setModalState(() => quantity--); }),
        Padding( padding: const EdgeInsets.symmetric(horizontal: 15), child: Text("$quantity", style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.bold)),),
        _quantityBtn(Icons.add, () => setModalState(() => quantity++)),
        ],),],),
        const SizedBox(height: 30),
        Container(padding: const EdgeInsets.all(20),decoration: BoxDecoration(color: AppColors.colorL, borderRadius: BorderRadius.circular(15)),
        child: Row( mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Text("Total Price:", style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
        Row(children: [ Image.asset("assets/token.png", height: 20), const SizedBox(width: 5), Text("${pricePerTicket * quantity} Tokens", style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.colorA)),],),
            ],
          ),
        ),
        const SizedBox(height: 30),
        SizedBox(width: double.infinity, height: 55, child: ElevatedButton(
        onPressed: () {
          setState(() => _tokenCount -= (pricePerTicket * quantity));
          Navigator.pop(context);
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Ticket purchased successfully!")));
        },
        style: ElevatedButton.styleFrom(backgroundColor: AppColors.colorA, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15))),
        child: Text("Confirm Purchase", style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.bold)),
        ),),],),);
        }
        );
      },
    );
  }
  Widget _buildDetailItem(String label, String city, String time) {
    return Column(crossAxisAlignment: label == "From" ? CrossAxisAlignment.start : CrossAxisAlignment.end,
      children: [
        Text(label, style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey)),
        Text(city, style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.colorA)),
        Text(time, style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w500)),
      ],
    );
  }
  Widget _quantityBtn(IconData icon, VoidCallback onTap) {
    return InkWell(onTap: onTap, child: Container(
    padding: const EdgeInsets.all(5),
    decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: AppColors.colorA)),
    child: Icon(icon, size: 20, color: AppColors.colorA),
      ),
    );
  }

  Widget _buildTokenCounter() {
    return Container(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)]),
    child: Row(children: [Image.asset("assets/token.png", height: 20, width: 20),
    const SizedBox(width: 5),
    Text("$_tokenCount", style: GoogleFonts.poppins(fontWeight: FontWeight.bold, color: AppColors.colorA)),],
      ),
    );
  }

  Widget _buildScheduleCard(String from, String to, String dep, String arr, int price) {
    return GestureDetector(
    onTap: () => _showPurchaseDialog(from, to, dep, arr, price),
    child: Container( margin: const EdgeInsets.only(bottom: 15), padding: const EdgeInsets.all(20),
    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: AppColors.colorA.withOpacity(0.05), blurRadius: 10)]),
    child: Column(children: [Row(mainAxisAlignment: MainAxisAlignment.spaceBetween,children: [
    _buildDetailItem("From", from, dep), Icon(Icons.trending_flat, color: AppColors.colorA),
    _buildDetailItem("To", to, arr),
    ],),
    const Divider(height: 30),
    Row(mainAxisAlignment: MainAxisAlignment.spaceBetween,children: [
    Text("$price Tokens", style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.green[700])),
    Text("Tap to buy", style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey)),],),],
        ),
      ),
    );
  }
}