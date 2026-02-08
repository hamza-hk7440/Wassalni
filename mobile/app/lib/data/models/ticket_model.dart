import 'package:cloud_firestore/cloud_firestore.dart';

class TicketModel {
  final String ticketId;
  final String userId;
  final String scheduleId;
  final String qrData;
  final String status; //valid, used, expired
  final DateTime purchaseDate;

  TicketModel({
    required this.ticketId,
    required this.userId,
    required this.scheduleId,
    required this.qrData,
    required this.status,
    required this.purchaseDate,
  });
  factory TicketModel.fromFirestore(DocumentSnapshot doc) {
    Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
    return TicketModel(
      ticketId: doc.id,
      userId: data['user_id'] ?? '',
      scheduleId: data['schedule_id'] ?? '',
      qrData: data['qr_data'] ?? '',
      status: data['status'] ?? '',
      purchaseDate: (data['purchase_date'] as Timestamp).toDate(),
    );
  }
  Map<String, dynamic> toFirestore() {
    return {
      'user_id': userId,
      'schedule_id': scheduleId,
      'qr_data': qrData,
      'status': status,
      'purchase_date': Timestamp.fromDate(purchaseDate),
    };
  }
}
