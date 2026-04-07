import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:app/core/theme/colors_R.dart';
import '../../schedule_controller.dart';
import '../../../data/api/api_service.dart';
import '../../../data/models/schedule.dart';
import '../../../data/models/schedule_slot.dart';
import '../auth_controller.dart';
import 'my_tickets_screen.dart';
import 'recharge_screen.dart';

class TrainSchedulePage extends StatefulWidget {
  final String direction;
  const TrainSchedulePage({super.key, required this.direction});

  @override
  State<TrainSchedulePage> createState() => _TrainSchedulePageState();
}

class _TrainSchedulePageState extends State<TrainSchedulePage> {
  int _tokenCount = 50;
  final ScrollController _scrollController = ScrollController();
  late final ScheduleController _scheduleController;
  final ApiService _apiService = ApiService();
  final AuthController _authController = Get.find<AuthController>();
  bool _isExtended = true;

  List<Schedule> get _filteredSchedules => _scheduleController.schedules;

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

  bool _isScheduleOnSelectedDay(Schedule schedule) {
    try {
      final departure = DateTime.parse(schedule.departure).toLocal();
      final selected = _scheduleController.selectedDay;
      return departure.year == selected.year &&
          departure.month == selected.month &&
          departure.day == selected.day;
    } catch (_) {
      return false;
    }
  }

  @override
  void initState() {
    super.initState();

    _scheduleController = ScheduleController(direction: widget.direction);

    _scheduleController.addListener(() {
      if (mounted) setState(() {});
    });

    _scheduleController.loadSchedules();
    _refreshTokenBalance();

    _scrollController.addListener(() {
      if (_scrollController.offset > 50 && _isExtended) {
        setState(() => _isExtended = false);
      } else if (_scrollController.offset <= 50 && !_isExtended) {
        setState(() => _isExtended = true);
      }
    });
  }

  Future<void> _refreshTokenBalance() async {
    final userId = _authController.currentUser.value?.userId;
    if (userId == null || userId.isEmpty) {
      return;
    }

    try {
      final balance = await _apiService.getTokensBalance(userId: userId);
      if (!mounted) return;

      setState(() => _tokenCount = balance);

      final current = _authController.currentUser.value;
      if (current != null) {
        _authController.currentUser.value = User(
          userId: current.userId,
          email: current.email,
          firstName: current.firstName,
          lastName: current.lastName,
          role: current.role,
          tokenBalance: balance.toDouble(),
          timestamp: current.timestamp,
        );
      }
    } catch (_) {
      // keep local value if request fails
    }
  }

  void _showPurchaseSuccessDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            const Icon(Icons.check_circle, color: Colors.green),
            const SizedBox(width: 8),
            Text(
              "Purchase Successful",
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.green[700],
              ),
            ),
          ],
        ),
        content: Text(
          "Your ticket is confirmed. You will find it in My Tickets.",
          style: GoogleFonts.poppins(),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => MyTicketsPage()),
              );
            },
            child: const Text("Go to My Tickets"),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Close"),
          ),
        ],
      ),
    );
  }

  void _showInsufficientTokensDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            const Icon(Icons.error, color: Colors.redAccent),
            const SizedBox(width: 8),
            Text(
              "Insufficient Tokens",
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.redAccent,
              ),
            ),
          ],
        ),
        content: Text(
          "You don't have enough tokens to complete this purchase.",
          style: GoogleFonts.poppins(),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const RechargePage()),
              );
            },
            child: const Text("Recharge Now"),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Cancel"),
          ),
        ],
      ),
    );
  }

  Future<void> _processPurchase({
    required ScheduleSlot selectedSlot,
    required int quantity,
  }) async {
    final userId = _authController.currentUser.value?.userId;
    if (userId == null || userId.isEmpty) {
      throw Exception('User not authenticated');
    }

    final total = selectedSlot.price * quantity;
    final hasEnough = await _apiService.verifyTokensNumber(
      userId: userId,
      amount: total,
    );

    if (!hasEnough) {
      _showInsufficientTokensDialog();
      return;
    }

    for (int index = 0; index < quantity; index++) {
      await _apiService.createTicket(
        userId: userId,
        scheduleId: selectedSlot.scheduleId,
        price: selectedSlot.price,
      );
    }

    await _apiService.redeemTokensFromUser(userId: userId, amount: total);
    await _refreshTokenBalance();
    _showPurchaseSuccessDialog();
  }

  @override
  void dispose() {
    _scheduleController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final schedulesForSelectedDay = _filteredSchedules
        .where(_isScheduleOnSelectedDay)
        .toList();

    final routeMap = <String, Schedule>{};
    for (final schedule in schedulesForSelectedDay) {
      final key = schedule.routeId.isNotEmpty
          ? schedule.routeId
          : '${schedule.from}-${schedule.to}';
      routeMap.putIfAbsent(key, () => schedule);
    }

    final uniqueRouteSchedules = routeMap.values.toList();

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
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Train Schedule",
                            style: GoogleFonts.poppins(
                              fontSize: 20,
                              fontWeight: FontWeight.w800,
                              color: AppColors.colorA,
                            ),
                          ),
                          Text(
                            widget.direction == "mahdia"
                                ? "Monastir ➔ Mahdia"
                                : "Mahdia ➔ Monastir",
                            style: GoogleFonts.poppins(
                              fontSize: 13,
                              color: Colors.grey,
                            ),
                          ),
                        ],
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
                  : uniqueRouteSchedules.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.train_outlined,
                            size: 60,
                            color: Colors.grey[300],
                          ),
                          const SizedBox(height: 15),
                          Text(
                            "No schedules for this day",
                            style: GoogleFonts.poppins(
                              fontSize: 16,
                              color: Colors.grey,
                            ),
                          ),
                        ],
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
                        itemCount: uniqueRouteSchedules.length,
                        itemBuilder: (context, index) {
                          return _buildScheduleCard(uniqueRouteSchedules[index]);
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
          _showQuickBuyRouteDialog();
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

  void _showQuickBuyRouteDialog() {
    final schedulesForSelectedDay = _filteredSchedules
        .where(_isScheduleOnSelectedDay)
        .toList();

    final routeMap = <String, Schedule>{};
    for (final schedule in schedulesForSelectedDay) {
      final key = schedule.routeId.isNotEmpty
          ? schedule.routeId
          : '${schedule.from}-${schedule.to}';
      routeMap.putIfAbsent(key, () => schedule);
    }

    final routeOptions = routeMap.values.toList();

    if (routeOptions.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("No routes available for quick buy")),
      );
      return;
    }

    Schedule selectedRoute = routeOptions.first;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              padding: const EdgeInsets.all(24),
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
                    "Quick Buy",
                    style: GoogleFonts.poppins(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: AppColors.colorA,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    "Select route (From → To)",
                    style: GoogleFonts.poppins(
                      fontSize: 13,
                      color: Colors.grey,
                    ),
                  ),
                  const SizedBox(height: 20),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      border: Border.all(
                        color: AppColors.colorA.withOpacity(0.3),
                      ),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<Schedule>(
                        isExpanded: true,
                        value: selectedRoute,
                        items: routeOptions.map((schedule) {
                          return DropdownMenuItem<Schedule>(
                            value: schedule,
                            child: Text(
                              '${schedule.from} → ${schedule.to}',
                              style: GoogleFonts.poppins(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          );
                        }).toList(),
                        onChanged: (value) {
                          if (value != null) {
                            setModalState(() => selectedRoute = value);
                          }
                        },
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        Future.delayed(
                          Duration.zero,
                          () => _showPurchaseDialog(selectedRoute),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.colorA,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      child: Text(
                        "Choose Time",
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

  void _showPurchaseDialog(Schedule schedule) {
    int quantity = 1;
    List<ScheduleSlot> slots = [];
    ScheduleSlot? selectedSlot;
    bool loadingSlots = true;
    bool isProcessingPurchase = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            if (loadingSlots) {
              print('🔍 routeId being sent: "${schedule.routeId}"');
              _apiService
                  .fetchSlotsByRoute(schedule.routeId)
                  .then((result) {
                    print('✅ slots received: ${result.length}');
                    setModalState(() {
                      slots = result;
                      selectedSlot = result.isNotEmpty ? result.first : null;
                      loadingSlots = false;
                    });
                  })
                  .catchError((e) {
                    print('❌ fetchSlotsByRoute error: $e');
                    setModalState(() => loadingSlots = false);
                  });
            }

            final seatCount = selectedSlot?.availableSeats ?? 0;
            final hasEnoughSeats =
                selectedSlot != null && seatCount >= quantity;

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
                    "Ticket Details",
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
                              Icons.arrow_forward_rounded,
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
                              onChanged: (val) => setModalState(() {
                                selectedSlot = val;
                                if (selectedSlot != null &&
                                    quantity > selectedSlot!.availableSeats) {
                                  quantity = selectedSlot!.availableSeats > 0
                                      ? selectedSlot!.availableSeats
                                      : 1;
                                }
                              }),
                            ),
                          ),
                        ),
                  if (!loadingSlots && selectedSlot != null) ...[
                    const SizedBox(height: 14),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons.event_seat_rounded,
                              size: 16,
                              color: Colors.grey[700],
                            ),
                            const SizedBox(width: 6),
                            Text(
                              "Available seats",
                              style: GoogleFonts.poppins(
                                fontSize: 13,
                                color: Colors.grey[700],
                              ),
                            ),
                          ],
                        ),
                        Text(
                          "$seatCount",
                          style: GoogleFonts.poppins(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: seatCount > 0 ? AppColors.colorA : Colors.red,
                          ),
                        ),
                      ],
                    ),
                  ],
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "Tickets:",
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
                            () {
                              if (selectedSlot == null) return;
                              if (quantity < selectedSlot!.availableSeats) {
                                setModalState(() => quantity++);
                              }
                            },
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
                          "Total Price:",
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
                      onPressed: (selectedSlot == null || !hasEnoughSeats)
                          ? null
                          : () async {
                              setModalState(() => isProcessingPurchase = true);
                              Navigator.pop(context);
                              try {
                                await _processPurchase(
                                  selectedSlot: selectedSlot!,
                                  quantity: quantity,
                                );
                              } catch (error) {
                                if (!mounted) return;
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text("Purchase failed: $error"),
                                  ),
                                );
                              } finally {
                                if (mounted) {
                                  setState(() {});
                                }
                              }
                            },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.colorA,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                      ),
                      child: isProcessingPurchase
                          ? const SizedBox(
                              width: 22,
                              height: 22,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  Colors.white,
                                ),
                              ),
                            )
                          : Text(
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

  Widget _buildDetailItem(String label, String city, String time) {
    return Column(
      crossAxisAlignment: label == "From"
          ? CrossAxisAlignment.start
          : CrossAxisAlignment.end,
      children: [
        Text(
          label,
          style: GoogleFonts.poppins(fontSize: 11, color: Colors.grey),
        ),
        const SizedBox(height: 2),
        Text(
          city,
          style: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: AppColors.colorA,
          ),
        ),
        const SizedBox(height: 4),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
          decoration: BoxDecoration(
            color: AppColors.colorA.withOpacity(0.08),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            _formatTime(time),
            style: GoogleFonts.poppins(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppColors.colorA,
            ),
          ),
        ),
        const SizedBox(height: 2),
        Text(
          _formatDate(time),
          style: GoogleFonts.poppins(fontSize: 11, color: Colors.grey),
        ),
      ],
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
                Icon(Icons.trending_flat, color: AppColors.colorA),
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
                    color: Colors.green[700],
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
}
