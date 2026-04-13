import 'package:app/core/theme/colors_R.dart';
import 'package:app/data/api/api_service.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

class RefundRequestsPage extends StatefulWidget {
  const RefundRequestsPage({super.key});

  @override
  State<RefundRequestsPage> createState() => _RefundRequestsPageState();
}

class _RefundRequestsPageState extends State<RefundRequestsPage> {
  final ApiService _apiService = ApiService();
  late Future<List<Map<String, dynamic>>> _future;

  String _shortTicketId(dynamic ticketId) {
    final value = ticketId?.toString().trim() ?? '';
    if (value.isEmpty) return '--';
    final parts = value.split('-');
    return parts.isNotEmpty ? parts.last : value;
  }

  @override
  void initState() {
    super.initState();
    _future = _apiService.fetchRefundRequests();
  }

  String _formatDate(dynamic raw) {
    try {
      if (raw == null) return '--';
      final dt = DateTime.parse(raw.toString()).toLocal();
      return '${dt.day.toString().padLeft(2, '0')}/${dt.month.toString().padLeft(2, '0')}/${dt.year} ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return raw?.toString() ?? '--';
    }
  }

  Color _statusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return Colors.orange;
      case 'completed':
        return Colors.green;
      case 'rejected':
        return Colors.red;
      default:
        return Colors.grey;
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
          'refund_requests_title'.tr,
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
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _future,
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
                child: Text(
                  snapshot.error.toString(),
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(color: Colors.redAccent),
                ),
              ),
            );
          }

          final items = snapshot.data ?? const [];
          if (items.isEmpty) {
            return Center(
              child: Text(
                'no_refund_requests'.tr,
                style: GoogleFonts.poppins(color: Colors.grey[700]),
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () async {
              setState(() {
                _future = _apiService.fetchRefundRequests();
              });
              await _future;
            },
            child: ListView.separated(
              padding: const EdgeInsets.all(20),
              itemCount: items.length,
              separatorBuilder: (_, __) => const SizedBox(height: 14),
              itemBuilder: (context, index) {
                final item = items[index];
                final status = (item['status'] ?? 'pending').toString();
                return Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Ticket #${_shortTicketId(item['ticket_id'])}',
                            style: GoogleFonts.poppins(
                              fontWeight: FontWeight.w600,
                              color: AppColors.colorD,
                            ),
                          ),
                          Text(
                            status.toUpperCase(),
                            style: GoogleFonts.poppins(
                              color: _statusColor(status),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                          '${'amount'.tr}: ${item['amount']}',
                        style: GoogleFonts.poppins(fontSize: 12),
                      ),
                      Text(
                        '${'requested'.tr}: ${_formatDate(item['requested_at'])}',
                        style: GoogleFonts.poppins(fontSize: 12),
                      ),
                      Text(
                        '${'release_time'.tr}: ${_formatDate(item['release_at'])}',
                        style: GoogleFonts.poppins(fontSize: 12),
                      ),
                    ],
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
