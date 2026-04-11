import '../data/api/api_service.dart';

class MyTicket {
  final String ticketId;
  final String type;
  final String departure;
  final String arrival;
  final String departureTime;
  final String arrivalTime;
  final String purchaseDate;
  final int price;
  final String status;
  final String? qrData;
  final int delayMinutes;
  final bool isCancelled;
  final String disruptionMessage;
  final String refundStatus;

  const MyTicket({
    required this.ticketId,
    required this.type,
    required this.departure,
    required this.arrival,
    required this.departureTime,
    required this.arrivalTime,
    required this.purchaseDate,
    required this.price,
    required this.status,
    required this.qrData,
    required this.delayMinutes,
    required this.isCancelled,
    required this.disruptionMessage,
    required this.refundStatus,
  });

  bool get isActive => status.toLowerCase() == 'active';

  factory MyTicket.fromJson(Map<String, dynamic> json) {
    return MyTicket(
      ticketId: json['ticket_id']?.toString() ?? '',
      type: (json['transport_type'] ?? 'Unknown').toString(),
      departure: (json['departure_station'] ?? 'Unknown').toString(),
      arrival: (json['arrival_station'] ?? 'Unknown').toString(),
      departureTime: (json['departure_time'] ?? '').toString(),
      arrivalTime: (json['arrival_time'] ?? '').toString(),
      purchaseDate: (json['purchase_date'] ?? json['purshase_date'] ?? '')
          .toString(),
      price: (json['price'] is num)
          ? (json['price'] as num).toInt()
          : int.tryParse(json['price']?.toString() ?? '') ?? 0,
      status: (json['status'] ?? '').toString(),
      qrData: json['qr_data']?.toString(),
      delayMinutes: (json['delay_minutes'] is num)
          ? (json['delay_minutes'] as num).toInt()
          : int.tryParse(json['delay_minutes']?.toString() ?? '') ?? 0,
      isCancelled: json['is_cancelled'] == true,
      disruptionMessage: (json['disruption_message'] ?? '').toString(),
      refundStatus: (json['refund_status'] ?? 'none').toString(),
    );
  }
}

class MyTicketsScreenController {
  final ApiService _apiService;

  MyTicketsScreenController({ApiService? apiService})
    : _apiService = apiService ?? ApiService();

  Future<List<MyTicket>> getActiveTickets() async {
    final rows = await _apiService.fetchMyActiveTickets();
    return rows.map(MyTicket.fromJson).toList();
  }

  Future<List<MyTicket>> getTicketHistory() async {
    final rows = await _apiService.fetchMyTicketHistory();
    return rows.map(MyTicket.fromJson).toList();
  }

  Future<String> getQrDataByTicketId(String ticketId) {
    return _apiService.getQrDataByTicketId(ticketId: ticketId);
  }

  Future<void> requestRefund(String ticketId) {
    return _apiService.requestTicketRefund(ticketId: ticketId);
  }
}
