import 'dart:convert';

import 'package:app/core/theme/colors_R.dart';
import 'package:app/features/mytickets_screen_controller.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class MyTicketsPage extends StatefulWidget {
  final bool showHistory;

  const MyTicketsPage({super.key, this.showHistory = false});

  @override
  State<MyTicketsPage> createState() => _MyTicketsPageState();
}

class _MyTicketsPageState extends State<MyTicketsPage> {
  final MyTicketsScreenController _controller = MyTicketsScreenController();
  late Future<List<MyTicket>> _ticketsFuture;
  final Map<String, String> _qrByTicketId = {};

  @override
  void initState() {
    super.initState();
    _ticketsFuture = _loadTickets();
  }

  Future<List<MyTicket>> _loadTickets() {
    return widget.showHistory
        ? _controller.getTicketHistory()
        : _controller.getActiveTickets();
  }

  Future<void> _refreshTickets() async {
    setState(() {
      _ticketsFuture = _loadTickets();
    });
    await _ticketsFuture;
  }

  IconData _iconForType(String type) {
    final lower = type.toLowerCase();
    if (lower.contains('bus')) {
      return Icons.directions_bus;
    }
    return Icons.train;
  }

  String _formatDate(String raw) {
    try {
      final dt = DateTime.parse(raw).toLocal();
      return '${dt.day.toString().padLeft(2, '0')}/${dt.month.toString().padLeft(2, '0')}/${dt.year}';
    } catch (_) {
      return raw;
    }
  }

  String _formatTime(String raw) {
    try {
      final dt = DateTime.parse(raw).toLocal();
      return '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return '--:--';
    }
  }

  Color _statusColor(String status) {
    final lower = status.toLowerCase();
    if (lower == 'active') {
      return Colors.green;
    }
    if (lower == 'used') {
      return Colors.orange;
    }
    if (lower == 'refunded') {
      return Colors.blueGrey;
    }
    return Colors.grey;
  }

  String _controllerCode(String ticketId) {
    final parts = ticketId.split('-');
    return parts.isNotEmpty ? parts.last : ticketId;
  }

  Future<void> _requestRefund(MyTicket ticket) async {
    try {
      await _controller.requestRefund(ticket.ticketId);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Refund request sent. It will be processed in about 2 minutes (test mode).',
          ),
          behavior: SnackBarBehavior.floating,
        ),
      );
      await _refreshTickets();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString().replaceFirst('Exception: ', '')),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  Widget _buildDisruptionInfo(MyTicket ticket) {
    final status = ticket.status.toLowerCase();

    if (status == 'used' || status == 'refunded') {
      return const SizedBox.shrink();
    }

    if (ticket.isCancelled) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 8),
          Text(
            ticket.disruptionMessage.isNotEmpty
                ? 'Cancelled: ${ticket.disruptionMessage}'
                : 'Cancelled by administrator.',
            style: GoogleFonts.poppins(
              fontSize: 12,
              color: Colors.red[700],
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 8),
        Text(
          'Delay: ${ticket.delayMinutes} minutes',
          style: GoogleFonts.poppins(
            fontSize: 12,
            color: ticket.delayMinutes > 0
                ? Colors.orange[800]
                : Colors.grey[700],
            fontWeight: ticket.delayMinutes > 0
                ? FontWeight.w600
                : FontWeight.w400,
          ),
        ),
      ],
    );
  }

  Widget _buildRefundArea(MyTicket ticket) {
    if (!ticket.isCancelled) {
      return const SizedBox.shrink();
    }

    final status = ticket.refundStatus.toLowerCase();
    if (status == 'pending') {
      return Padding(
        padding: const EdgeInsets.only(top: 10),
        child: Text(
          'Refund request is pending. It should be completed within 24-48 hours (2 min in test).',
          style: GoogleFonts.poppins(fontSize: 11, color: Colors.orange[800]),
        ),
      );
    }

    if (status == 'completed') {
      return Padding(
        padding: const EdgeInsets.only(top: 10),
        child: Text(
          'Refund completed.',
          style: GoogleFonts.poppins(
            fontSize: 11,
            color: Colors.green[700],
            fontWeight: FontWeight.w600,
          ),
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.only(top: 10),
      child: SizedBox(
        width: double.infinity,
        child: OutlinedButton(
          onPressed: () => _requestRefund(ticket),
          child: const Text('Request Refund'),
        ),
      ),
    );
  }

  Future<String> _resolveQrData(MyTicket ticket) async {
    if (_qrByTicketId.containsKey(ticket.ticketId)) {
      return _qrByTicketId[ticket.ticketId] ?? '';
    }

    final fromTicket = ticket.qrData ?? '';
    if (fromTicket.isNotEmpty) {
      _qrByTicketId[ticket.ticketId] = fromTicket;
      return fromTicket;
    }

    final qrData = await _controller.getQrDataByTicketId(ticket.ticketId);
    _qrByTicketId[ticket.ticketId] = qrData;
    return qrData;
  }

  void _openTicketDetails(MyTicket ticket) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(
            'Ticket QR',
            style: GoogleFonts.poppins(
              fontWeight: FontWeight.bold,
              color: AppColors.colorD,
            ),
          ),
          content: SizedBox(
            width: 340,
            child: FutureBuilder<String>(
              future: _resolveQrData(ticket),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const SizedBox(
                    height: 180,
                    child: Center(child: CircularProgressIndicator()),
                  );
                }

                final qrData = snapshot.data ?? '';
                final hasQr = qrData.isNotEmpty;

                return Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (hasQr)
                      _buildQrImage(qrData)
                    else
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 18),
                        child: Icon(Icons.qr_code_2, size: 120),
                      ),
                    const SizedBox(height: 12),
                    Text(
                      'Ticket ID: ${_controllerCode(ticket.ticketId)}',
                      style: GoogleFonts.poppins(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      hasQr
                          ? 'Show this QR to controller for scanning.'
                          : 'QR unavailable. Use this Ticket ID if scan fails.',
                      style: GoogleFonts.poppins(
                        fontSize: 11,
                        color: Colors.grey[700],
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                );
              },
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close'),
            ),
          ],
        );
      },
    );
  }

  Widget _buildQrImage(String rawBase64) {
    try {
      final bytes = base64Decode(rawBase64);
      return Image.memory(bytes, width: 260, height: 260, fit: BoxFit.contain);
    } catch (_) {
      return const Icon(
        Icons.error_outline,
        size: 120,
        color: Colors.redAccent,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.colorL,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: Text(
          widget.showHistory ? 'Tickets history' : 'My Tickets',
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
      body: FutureBuilder<List<MyTicket>>(
        future: _ticketsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(
              child: CircularProgressIndicator(color: AppColors.colorA),
            );
          }

          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Failed to load tickets.',
                      style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      snapshot.error.toString(),
                      style: GoogleFonts.poppins(
                        fontSize: 11,
                        color: Colors.grey[700],
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 14),
                    ElevatedButton(
                      onPressed: _refreshTickets,
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
            );
          }

          final tickets = snapshot.data ?? const [];
          if (tickets.isEmpty) {
            return Center(
              child: Text(
                widget.showHistory
                    ? 'No ticket history found.'
                    : 'No active tickets found.',
                style: GoogleFonts.poppins(color: Colors.grey[700]),
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: _refreshTickets,
            child: ListView.separated(
              padding: const EdgeInsets.all(20),
              itemCount: tickets.length,
              separatorBuilder: (_, __) => const SizedBox(height: 15),
              itemBuilder: (context, index) {
                final ticket = tickets[index];
                return _buildTicketItem(context, ticket);
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildTicketItem(BuildContext context, MyTicket ticket) {
    final color = _statusColor(ticket.status);
    final departureDate = _formatDate(ticket.departureTime);
    final departureTime = _formatTime(ticket.departureTime);

    return InkWell(
      onTap: () {
        if (!ticket.isActive || ticket.isCancelled) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                ticket.isCancelled
                    ? 'This ticket is cancelled. Please request a refund.'
                    : 'QR code is available only for active tickets.',
              ),
              behavior: SnackBarBehavior.floating,
            ),
          );
          return;
        }
        _openTicketDetails(ticket);
      },
      borderRadius: BorderRadius.circular(20),
      child: Container(
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
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(
                                _iconForType(ticket.type),
                                color: AppColors.colorA,
                                size: 16,
                              ),
                              const SizedBox(width: 6),
                              Text(
                                ticket.type.toUpperCase(),
                                style: GoogleFonts.poppins(
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.colorA,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                          Text(
                            'ID: #${_controllerCode(ticket.ticketId)}',
                            style: GoogleFonts.poppins(
                              fontSize: 11,
                              fontWeight: FontWeight.w500,
                              color: Colors.grey[900],
                            ),
                          ),
                        ],
                      ),
                      Text(
                        '${ticket.price} Tokens',
                        style: GoogleFonts.poppins(
                          fontWeight: FontWeight.bold,
                          color: AppColors.colorD,
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                  const Divider(height: 25),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildStationColumn('Departure', ticket.departure),
                      Column(
                        children: [
                          Icon(
                            Icons.trending_flat,
                            color: AppColors.colorA.withOpacity(0.5),
                          ),
                          Text(
                            departureTime,
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: AppColors.colorA,
                            ),
                          ),
                        ],
                      ),
                      _buildStationColumn(
                        'Arrival',
                        ticket.arrival,
                        isRight: true,
                      ),
                    ],
                  ),
                  const SizedBox(height: 15),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      'Day: $departureDate',
                      style: GoogleFonts.poppins(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),
                  _buildDisruptionInfo(ticket),
                  _buildRefundArea(ticket),
                ],
              ),
            ),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 8),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(19),
                  bottomRight: Radius.circular(19),
                ),
              ),
              child: Text(
                ticket.status.toUpperCase(),
                textAlign: TextAlign.center,
                style: GoogleFonts.poppins(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStationColumn(
    String label,
    String city, {
    bool isRight = false,
  }) {
    return Column(
      crossAxisAlignment: isRight
          ? CrossAxisAlignment.end
          : CrossAxisAlignment.start,
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
