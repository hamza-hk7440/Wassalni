import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:app/core/theme/colors_R.dart';
import '../../schedule_controller.dart';
import '../../../data/api/api_service.dart';
import '../../../data/models/schedule.dart';
import '../../../data/models/schedule_slot.dart';

class BusSchedulePage extends StatefulWidget {
  const BusSchedulePage({super.key});

  @override
  State<BusSchedulePage> createState() => _BusSchedulePageState();
}

class _BusSchedulePageState extends State<BusSchedulePage> {
  int _tokenCount = 50;
  final ScrollController _scrollController = ScrollController();
  final ScheduleController _scheduleController = ScheduleController();
  final ApiService _apiService = ApiService();
  bool _isExtended = true;

  String _formatTime(String raw) {
    try {
      final dt = DateTime.parse(raw).toLocal();
      final h = dt.hour.toString().padLeft(2, '0');
      final m = dt.minute.toString().padLeft(2, '0');
      return '$h:$m';
    } catch (_) {
      return raw;
    }
  }

  String _formatDate(String raw) {
    try {
      final dt = DateTime.parse(raw).toLocal();
      return '${dt.day}/${dt.month}/${dt.year}';
    } catch (_) {
      return '';
    }
  }

  @override
  void initState() {
    super.initState();
    _scheduleController.loadSchedules();
    _scheduleController.addListener(() {
      if (mounted) setState(() {});
    });
    _scrollController.addListener(() {
      if (_scrollController.offset > 50 && _isExtended) {
        setState(() => _isExtended = false);
      } else if (_scrollController.offset <= 50 && !_isExtended) {
        setState(() => _isExtended = true);
      }
    });
  }

  @override
  void dispose() {
    _scheduleController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final busSchedules = _scheduleController.schedules
        .where((s) => s.transportType.toLowerCase() == 'bus')
        .toList();

    return Scaffold(
      backgroundColor: AppColors.colorL,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      IconButton(
                        icon: Icon(
                          Icons.arrow_back_ios,
                          color: AppColors.colorA,
                          size: 20,
                        ),
                        onPressed: () => Navigator.pop(context),
                      ),
                      Text(
                        "Bus Schedule",
                        style: GoogleFonts.poppins(
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          color: AppColors.colorA,
                        ),
                      ),
                    ],
                  ),
                  _buildTokenCounter(),
                ],
              ),
            ),
            _buildDaySelector(),
            const SizedBox(height: 10),
            Expanded(
              child: _scheduleController.isLoading
                  ? Center(
                      child: CircularProgressIndicator(color: AppColors.colorA),
                    )
                  : _scheduleController.errorMessage.isNotEmpty
                  ? _buildErrorView()
                  : busSchedules.isEmpty
                  ? Center(
                      child: Text(
                        "No bus schedules available",
                        style: GoogleFonts.poppins(color: Colors.grey),
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: () => _scheduleController.loadSchedules(),
                      child: ListView.builder(
                        controller: _scrollController,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 10,
                        ),
                        itemCount: busSchedules.length,
                        itemBuilder: (context, index) {
                          return _buildScheduleCard(busSchedules[index]);
                        },
                      ),
                    ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        isExtended: _isExtended,
        onPressed: () {
          final busSchedules = _scheduleController.schedules
              .where((s) => s.transportType.toLowerCase() == 'bus')
              .toList();
          if (busSchedules.isNotEmpty) {
            _showPurchaseDialog(busSchedules.first);
          }
        },
        backgroundColor: AppColors.colorA,
        icon: const Icon(
          Icons.confirmation_number_rounded,
          color: Colors.white,
        ),
        label: Text(
          "Quick Buy",
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
    );
  }

  Widget _buildDaySelector() {
    final now = DateTime.now();
    final monday = now.subtract(Duration(days: now.weekday - 1));
    final days = List.generate(7, (i) => monday.add(Duration(days: i)));
    final dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return SizedBox(
      height: 70,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 20),
        itemCount: 7,
        itemBuilder: (context, index) {
          final day = days[index];
          final isSelected =
              day.day == _scheduleController.selectedDay.day &&
              day.month == _scheduleController.selectedDay.month &&
              day.year == _scheduleController.selectedDay.year;

          return GestureDetector(
            onTap: () => _scheduleController.selectDay(day),
            child: Container(
              margin: const EdgeInsets.only(right: 10),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.colorA : Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 6,
                  ),
                ],
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    dayNames[index],
                    style: GoogleFonts.poppins(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: isSelected ? Colors.white : Colors.grey,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${day.day}',
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: isSelected ? Colors.white : AppColors.colorA,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildErrorView() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, size: 40, color: Colors.red),
          const SizedBox(height: 10),
          Text(_scheduleController.errorMessage, style: GoogleFonts.poppins()),
          TextButton(
            onPressed: () => _scheduleController.loadSchedules(),
            child: const Text("Retry"),
          ),
        ],
      ),
    );
  }

  Widget _buildScheduleCard(Schedule schedule) {
    return GestureDetector(
      onTap: () => _showPurchaseDialog(schedule),
      child: Container(
        margin: const EdgeInsets.only(bottom: 15),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: AppColors.colorA.withOpacity(0.05),
              blurRadius: 10,
            ),
          ],
        ),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "From",
                      style: GoogleFonts.poppins(
                        fontSize: 11,
                        color: Colors.grey,
                      ),
                    ),
                    Text(
                      schedule.from,
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppColors.colorA,
                      ),
                    ),
                  ],
                ),
                Icon(Icons.directions_bus, color: AppColors.colorA, size: 20),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      "To",
                      style: GoogleFonts.poppins(
                        fontSize: 11,
                        color: Colors.grey,
                      ),
                    ),
                    Text(
                      schedule.to,
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppColors.colorA,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const Divider(height: 30),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.colorA.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    schedule.transportType,
                    style: GoogleFonts.poppins(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: AppColors.colorA,
                    ),
                  ),
                ),
                Row(
                  children: [
                    Icon(
                      Icons.event_seat_rounded,
                      size: 14,
                      color: Colors.grey,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      "${schedule.availableSeats} seats",
                      style: GoogleFonts.poppins(
                        fontSize: 12,
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "${schedule.price} Tokens",
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: Colors.orange[800],
                  ),
                ),
                Text(
                  "Tap to pick time",
                  style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showPurchaseDialog(Schedule schedule) {
    int quantity = 1;
    List<ScheduleSlot> slots = [];
    ScheduleSlot? selectedSlot;
    bool loadingSlots = true;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            if (loadingSlots) {
              _apiService
                  .fetchSlotsByRoute(schedule.routeId)
                  .then((result) {
                    setModalState(() {
                      slots = result;
                      selectedSlot = result.isNotEmpty ? result.first : null;
                      loadingSlots = false;
                    });
                  })
                  .catchError((e) {
                    setModalState(() => loadingSlots = false);
                  });
            }

            return Container(
              padding: const EdgeInsets.all(30),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 50,
                    height: 5,
                    decoration: BoxDecoration(
                      color: Colors.grey[300],
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    "Bus Ticket Details",
                    style: GoogleFonts.poppins(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: AppColors.colorA,
                    ),
                  ),
                  const Divider(height: 40),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.colorA.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "From",
                                style: GoogleFonts.poppins(
                                  fontSize: 11,
                                  color: Colors.grey,
                                ),
                              ),
                              Text(
                                schedule.from,
                                style: GoogleFonts.poppins(
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.colorA,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Column(
                          children: [
                            Icon(
                              Icons.directions_bus,
                              color: AppColors.colorA,
                              size: 22,
                            ),
                            Text(
                              "Direct",
                              style: GoogleFonts.poppins(
                                fontSize: 10,
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                "To",
                                style: GoogleFonts.poppins(
                                  fontSize: 11,
                                  color: Colors.grey,
                                ),
                              ),
                              Text(
                                schedule.to,
                                style: GoogleFonts.poppins(
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.colorA,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  loadingSlots
                      ? const CircularProgressIndicator()
                      : slots.isEmpty
                      ? Text(
                          "No times available",
                          style: GoogleFonts.poppins(color: Colors.grey),
                        )
                      : Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          decoration: BoxDecoration(
                            border: Border.all(
                              color: AppColors.colorA.withOpacity(0.3),
                            ),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<ScheduleSlot>(
                              isExpanded: true,
                              value: selectedSlot,
                              items: slots.map((slot) {
                                return DropdownMenuItem<ScheduleSlot>(
                                  value: slot,
                                  child: Text(
                                    "${_formatTime(slot.departureTime)}  →  ${_formatTime(slot.arrivalTime)}",
                                    style: GoogleFonts.poppins(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                );
                              }).toList(),
                              onChanged: (val) =>
                                  setModalState(() => selectedSlot = val),
                            ),
                          ),
                        ),
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "Number of tickets:",
                        style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
                      ),
                      Row(
                        children: [
                          _quantityBtn(Icons.remove, () {
                            if (quantity > 1) setModalState(() => quantity--);
                          }),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 15),
                            child: Text(
                              "$quantity",
                              style: GoogleFonts.poppins(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          _quantityBtn(
                            Icons.add,
                            () => setModalState(() => quantity++),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: AppColors.colorL,
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Total to pay:",
                          style: GoogleFonts.poppins(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        Row(
                          children: [
                            Image.asset("assets/token.png", height: 20),
                            const SizedBox(width: 5),
                            Text(
                              "${(selectedSlot?.price ?? schedule.price) * quantity} Tokens",
                              style: GoogleFonts.poppins(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: AppColors.colorA,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    height: 55,
                    child: ElevatedButton(
                      onPressed: selectedSlot == null
                          ? null
                          : () {
                              setState(
                                () => _tokenCount -=
                                    (selectedSlot!.price * quantity),
                              );
                              Navigator.pop(context);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  backgroundColor: AppColors.colorA,
                                  content: Text(
                                    "Bus ticket reserved!",
                                    style: GoogleFonts.poppins(),
                                  ),
                                ),
                              );
                            },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.colorA,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                      ),
                      child: Text(
                        "Confirm Purchase",
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _quantityBtn(IconData icon, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(5),
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(color: AppColors.colorA),
        ),
        child: Icon(icon, size: 20, color: AppColors.colorA),
      ),
    );
  }

  Widget _buildTokenCounter() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)],
      ),
      child: Row(
        children: [
          Image.asset("assets/token.png", height: 20, width: 20),
          const SizedBox(width: 5),
          Text(
            "$_tokenCount",
            style: GoogleFonts.poppins(
              fontWeight: FontWeight.bold,
              color: AppColors.colorA,
            ),
          ),
        ],
      ),
    );
  }
}
