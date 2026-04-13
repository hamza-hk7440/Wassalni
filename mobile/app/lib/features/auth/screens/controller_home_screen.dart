import 'package:app/core/theme/colors_R.dart';
import 'package:app/data/api/api_service.dart';
import 'package:app/data/models/schedule.dart';
import 'package:app/features/auth/auth_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

class ControllerHomePage extends StatefulWidget {
  const ControllerHomePage({super.key});

  @override
  State<ControllerHomePage> createState() => _ControllerHomePageState();
}

class _ControllerHomePageState extends State<ControllerHomePage> {
  final TextEditingController _idController = TextEditingController();
  final ApiService _apiService = ApiService();
  final AuthController _authController = Get.find<AuthController>();

  final List<Schedule> _schedules = [];
  DateTime _selectedDay = DateTime.now();
  String _selectedTransportType = 'metro';
  Schedule? _selectedSchedule;
  bool _isLoadingSchedules = false;
  bool _isVerifying = false;

  @override
  void initState() {
    super.initState();
    _loadSchedules();
  }

  String _formatTime(String raw) {
    try {
      final dt = DateTime.parse(raw).toLocal();
      final hour = dt.hour.toString().padLeft(2, '0');
      final minute = dt.minute.toString().padLeft(2, '0');
      return '$hour:$minute';
    } catch (_) {
      return raw;
    }
  }

  String _scheduleLabel(Schedule schedule) {
    return '${schedule.from} → ${schedule.to} • ${_formatTime(schedule.departure)}';
  }

  String _normalizeTransportType(String type) {
    final normalized = type.toLowerCase().trim();
    if (normalized == 'train') {
      return 'metro';
    }
    return normalized;
  }

  List<String> get _availableTransportTypes {
    final types = _schedules
        .map((schedule) => _normalizeTransportType(schedule.transportType))
        .where((type) => type == 'bus' || type == 'metro')
        .toSet()
        .toList();
    types.sort();
    return types;
  }

  List<Schedule> get _filteredSchedulesByTransport {
    return _schedules.where((schedule) {
      return _normalizeTransportType(schedule.transportType) ==
          _selectedTransportType;
    }).toList();
  }

  void _syncSelectedScheduleWithFilters() {
    final filtered = _filteredSchedulesByTransport;
    if (filtered.isEmpty) {
      _selectedSchedule = null;
      return;
    }

    if (_selectedSchedule == null ||
        !filtered.any((schedule) => schedule.id == _selectedSchedule!.id)) {
      _selectedSchedule = filtered.first;
      return;
    }

    _selectedSchedule = filtered.firstWhere(
      (schedule) => schedule.id == _selectedSchedule!.id,
    );
  }

  String _selectedTripDescription() {
    final schedule = _selectedSchedule;
    if (schedule == null) {
      return 'No trip selected';
    }
    return '${schedule.from} → ${schedule.to} • ${_formatTime(schedule.departure)}';
  }

  Future<void> _loadSchedules() async {
    setState(() => _isLoadingSchedules = true);
    try {
      final schedules = await _apiService.fetchSchedules(date: _selectedDay);
      if (!mounted) return;

      setState(() {
        _schedules
          ..clear()
          ..addAll(schedules);

        final types = _availableTransportTypes;
        if (!types.contains(_selectedTransportType)) {
          _selectedTransportType = types.isNotEmpty ? types.first : 'metro';
        }

        _syncSelectedScheduleWithFilters();
      });
    } catch (e) {
      if (!mounted) return;
      _showMessage(e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) {
        setState(() => _isLoadingSchedules = false);
      }
    }
  }

  Future<void> _pickDay() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDay,
      firstDate: DateTime.now().subtract(const Duration(days: 30)),
      lastDate: DateTime.now().add(const Duration(days: 60)),
    );

    if (picked == null) {
      return;
    }

    setState(() => _selectedDay = picked);
    await _loadSchedules();
  }

  void _showMessage(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), behavior: SnackBarBehavior.floating),
    );
  }

  Future<void> _openScanner() async {
    if (_selectedSchedule == null) {
      _showMessage('choose_trip_first'.tr);
      return;
    }

    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _TicketScannerSheet(
        onDetected: (value) => _handleTicketLookup(value, source: 'scanner'),
      ),
    );
  }

  Future<void> _handleManualCheck() async {
    final input = _idController.text.trim();
    if (input.isEmpty) {
      _showMessage('enter_short_code'.tr);
      return;
    }

    final normalizedShortCode = input.contains('-')
        ? input.split('-').last.trim()
        : input;

    await _handleTicketLookup(normalizedShortCode, source: 'manual-short');
  }

  Future<void> _handleTicketLookup(
    String rawValue, {
    required String source,
  }) async {
    final ticketInput = rawValue.trim();
    if (ticketInput.isEmpty) {
      _showMessage('scan_or_enter_id'.tr);
      return;
    }

    if (_selectedSchedule == null) {
      _showMessage('choose_trip_first'.tr);
      return;
    }

    setState(() => _isVerifying = true);
    try {
      final response = await _apiService.getTicketDetailsByInput(
        ticketInput: ticketInput,
      );
      if (!mounted) {
        return;
      }

      final ticket = Map<String, dynamic>.from(
        (response['ticket'] as Map?)?.cast<String, dynamic>() ?? {},
      );

      if (ticket.isEmpty) {
        throw Exception('ticket_not_found'.tr);
      }

      _showTicketReviewDialog(
        ticket: ticket,
        matchType: response['match_type']?.toString() ?? source,
      );
    } catch (e) {
      if (!mounted) {
        return;
      }
      _showMessage(e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) {
        setState(() => _isVerifying = false);
      }
    }
  }

  Future<void> _markTicketAsUsed(String ticketId) async {
    final result = await _apiService.markTicketAsUsed(ticketId: ticketId);
    if (!mounted) {
      return;
    }

    _showMessage(result['message']?.toString() ?? 'ticket_marked_used'.tr);
  }

  void _showTicketReviewDialog({
    required Map<String, dynamic> ticket,
    required String matchType,
  }) {
    final selectedSchedule = _selectedSchedule;
    final ticketId = ticket['ticket_id']?.toString() ?? '-';
    final ticketStatus = ticket['status']?.toString() ?? 'Unknown';
    final ticketScheduleId = ticket['schedule_id']?.toString() ?? '';
    final matchesSchedule =
        selectedSchedule != null && ticketScheduleId == selectedSchedule.id;
    final canValidate =
        ticketStatus.toLowerCase() == 'active' && matchesSchedule;
    final shortId = ticketId.contains('-')
        ? ticketId.split('-').last
        : ticketId;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) {
        bool isValidating = false;

        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              title: Text(
                'ticket_details_title'.tr,
                style: GoogleFonts.poppins(fontWeight: FontWeight.w700),
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _detailRow('ticket_id'.tr, ticketId),
                    _detailRow('short_code'.tr, shortId),
                    _detailRow('status'.tr, ticketStatus),
                    _detailRow('lookup_mode'.tr, matchType),
                    _detailRow(
                      'selected_trip'.tr,
                      selectedSchedule == null
                          ? 'no_trip_selected'.tr
                          : _scheduleLabel(selectedSchedule),
                    ),
                    _detailRow(
                      'ticket_trip'.tr,
                      ticketScheduleId.isEmpty ? '-' : ticketScheduleId,
                    ),
                    _detailRow(
                      'trip_match'.tr,
                      matchesSchedule ? 'match'.tr : 'mismatch'.tr,
                      valueColor: matchesSchedule
                          ? Colors.green
                          : Colors.redAccent,
                    ),
                    _detailRow('price'.tr, '${ticket['price'] ?? 0}'),
                    _detailRow(
                      'purchase_date'.tr,
                      ticket['purchase_date']?.toString() ?? '-',
                    ),
                    _detailRow(
                      'route'.tr,
                      '${ticket['departure_station'] ?? '-'} → ${ticket['arrival_station'] ?? '-'}',
                    ),
                    _detailRow(
                      'departure'.tr,
                      ticket['departure_time']?.toString() ?? '-',
                    ),
                    _detailRow(
                      'arrival'.tr,
                      ticket['arrival_time']?.toString() ?? '-',
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(dialogContext),
                  child: Text('close'.tr),
                ),
                ElevatedButton(
                  onPressed: (!canValidate || isValidating)
                      ? null
                      : () async {
                          setDialogState(() => isValidating = true);
                          try {
                            await _markTicketAsUsed(ticketId);
                            if (!mounted) {
                              return;
                            }
                            Navigator.pop(dialogContext);
                          } catch (e) {
                            if (!mounted) {
                              return;
                            }
                            _showMessage(
                              e.toString().replaceFirst('Exception: ', ''),
                            );
                          } finally {
                            if (mounted) {
                              setDialogState(() => isValidating = false);
                            }
                          }
                        },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: canValidate
                        ? AppColors.colorD
                        : Colors.grey,
                    foregroundColor: Colors.white,
                  ),
                  child: isValidating
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : Text(
                          canValidate ? 'VALIDATE' : 'NOT VALID',
                          style: GoogleFonts.poppins(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Widget _detailRow(String label, String value, {Color? valueColor}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 4,
            child: Text(
              label,
              style: GoogleFonts.poppins(
                fontSize: 13,
                color: Colors.grey[700],
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Expanded(
            flex: 6,
            child: Text(
              value,
              style: GoogleFonts.poppins(
                fontSize: 13,
                color: valueColor ?? Colors.black87,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final selectedSchedule = _selectedSchedule;
    final filteredSchedules = _filteredSchedulesByTransport;

    return Scaffold(
      backgroundColor: AppColors.colorL,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Text(
          'WASALNI CONTROLLER',
          style: GoogleFonts.poppins(
            color: AppColors.colorA,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.redAccent),
            onPressed: _authController.logout,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Controller validation',
              textAlign: TextAlign.center,
              style: GoogleFonts.poppins(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: AppColors.colorD,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'controller_instructions'.tr,
              textAlign: TextAlign.center,
              style: GoogleFonts.poppins(fontSize: 13, color: Colors.grey[700]),
            ),
            const SizedBox(height: 20),
            Card(
              elevation: 0,
              color: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(18),
                side: BorderSide(color: AppColors.colorA.withOpacity(0.1)),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.event_available, color: AppColors.colorA),
                        const SizedBox(width: 8),
                        Text(
                          'Select trip',
                          style: GoogleFonts.poppins(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: AppColors.colorD,
                          ),
                        ),
                        const Spacer(),
                        TextButton.icon(
                          onPressed: _pickDay,
                          icon: const Icon(Icons.date_range),
                          label: Text(
                            '${_selectedDay.day}/${_selectedDay.month}/${_selectedDay.year}',
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'transport_type'.tr,
                      style: GoogleFonts.poppins(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.colorD,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 10,
                      children: [
                        ChoiceChip(
                          label: Text('metro'.tr),
                          selected: _selectedTransportType == 'metro',
                          onSelected: (_) {
                            setState(() {
                              _selectedTransportType = 'metro';
                              _syncSelectedScheduleWithFilters();
                            });
                          },
                        ),
                        ChoiceChip(
                          label: Text('bus'.tr),
                          selected: _selectedTransportType == 'bus',
                          onSelected: (_) {
                            setState(() {
                              _selectedTransportType = 'bus';
                              _syncSelectedScheduleWithFilters();
                            });
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    if (_isLoadingSchedules)
                      const Center(child: CircularProgressIndicator())
                    else if (_schedules.isEmpty)
                      Text(
                        'no_schedules_for_date'.tr,
                        style: GoogleFonts.poppins(color: Colors.grey[700]),
                      )
                    else if (filteredSchedules.isEmpty)
                      Text(
                        'no_transport_schedules_for_date'.trParams({
                          'type': _selectedTransportType == 'metro'
                              ? 'metro'.tr
                              : 'bus'.tr,
                        }),
                        style: GoogleFonts.poppins(color: Colors.grey[700]),
                      )
                    else
                      DropdownButtonFormField<Schedule>(
                        value: selectedSchedule,
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: AppColors.colorL,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(14),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        items: filteredSchedules
                            .map(
                              (schedule) => DropdownMenuItem<Schedule>(
                                value: schedule,
                                child: Text(
                                  _scheduleLabel(schedule),
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.poppins(fontSize: 13),
                                ),
                              ),
                            )
                            .toList(),
                        onChanged: (schedule) {
                          if (schedule == null) {
                            return;
                          }
                          setState(() => _selectedSchedule = schedule);
                        },
                      ),
                    const SizedBox(height: 10),
                    Text(
                      'Selected: ${_selectedTripDescription()}',
                      style: GoogleFonts.poppins(
                        fontSize: 12,
                        color: Colors.grey[700],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 18),
            GestureDetector(
              onTap: _isVerifying ? null : _openScanner,
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 26),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppColors.colorA, width: 2),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.colorA.withOpacity(0.08),
                      blurRadius: 18,
                      spreadRadius: 3,
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Icon(
                      Icons.qr_code_scanner_rounded,
                      size: 86,
                      color: AppColors.colorA,
                    ),
                    const SizedBox(height: 14),
                    Text(
                      _isVerifying ? 'SCANNING...' : 'OPEN CAMERA SCANNER',
                      style: GoogleFonts.poppins(
                        fontWeight: FontWeight.bold,
                        color: AppColors.colorA,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(child: Divider(color: Colors.grey[300])),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  child: Text(
                    'OR',
                    style: GoogleFonts.poppins(color: Colors.grey),
                  ),
                ),
                Expanded(child: Divider(color: Colors.grey[300])),
              ],
            ),
            const SizedBox(height: 22),
            Text(
              'manual_short_code'.tr,
              style: GoogleFonts.poppins(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.colorD,
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _idController,
              textInputAction: TextInputAction.done,
              decoration: InputDecoration(
                hintText: 'enter_short_code_hint'.tr,
                prefixIcon: Icon(
                  Icons.confirmation_number,
                  color: AppColors.colorA,
                ),
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(15),
                  borderSide: BorderSide.none,
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(15),
                  borderSide: BorderSide(
                    color: AppColors.colorA.withOpacity(0.2),
                  ),
                ),
              ),
              onSubmitted: (_) {
                if (!_isVerifying) {
                  _handleManualCheck();
                }
              },
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              height: 54,
              child: ElevatedButton(
                onPressed: _isVerifying ? null : _handleManualCheck,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.colorD,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                  elevation: 0,
                ),
                child: _isVerifying
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : Text(
                        'VERIFY AND SHOW DETAILS',
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _idController.dispose();
    super.dispose();
  }
}

class _TicketScannerSheet extends StatefulWidget {
  final Future<void> Function(String ticketInput) onDetected;

  const _TicketScannerSheet({required this.onDetected});

  @override
  State<_TicketScannerSheet> createState() => _TicketScannerSheetState();
}

class _TicketScannerSheetState extends State<_TicketScannerSheet> {
  final MobileScannerController _scannerController = MobileScannerController();
  bool _handlingCapture = false;

  @override
  void dispose() {
    _scannerController.dispose();
    super.dispose();
  }

  Future<void> _onDetect(BarcodeCapture capture) async {
    if (_handlingCapture) {
      return;
    }

    final rawValue = capture.barcodes.isEmpty
        ? null
        : capture.barcodes.first.rawValue?.trim();
    if (rawValue == null || rawValue.isEmpty) {
      return;
    }

    _handlingCapture = true;
    await _scannerController.stop();
    if (!mounted) {
      return;
    }

    Navigator.pop(context);
    await widget.onDetected(rawValue);
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Container(
        height: MediaQuery.of(context).size.height * 0.88,
        decoration: const BoxDecoration(
          color: Colors.black,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(24),
            topRight: Radius.circular(24),
          ),
        ),
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: Row(
                children: [
                  Text(
                    'Scan ticket',
                    style: GoogleFonts.poppins(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close, color: Colors.white),
                  ),
                ],
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(18),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(22),
                  child: MobileScanner(
                    controller: _scannerController,
                    onDetect: _onDetect,
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 4, 20, 20),
              child: Text(
                'Keep the QR code inside the camera frame.',
                textAlign: TextAlign.center,
                style: GoogleFonts.poppins(color: Colors.white70, fontSize: 13),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
