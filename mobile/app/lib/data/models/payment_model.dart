import 'package:cloud_firestore/cloud_firestore.dart';

class PaymentModel {
  final String id;
  final String userId;
  final double amount;
  final String type; //paymee,tokens
  final String method; //online ,in station --but for the mobile will be alwyays online
  final String status; //pending,success,failed
  final DateTime timestamp;

  PaymentModel({
    required this.id,
    required this.userId,
    required this.type,
    required this.amount,
    required this.method,
    required this.status,
    required this.timestamp,
  });

  factory PaymentModel.fromFirestore(DocumentSnapshot doc) {
    Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
    return PaymentModel(
      id: doc.id,
      userId: data['userId'] ?? '',
      type: data['type'] ?? '',
      amount: (data['amount'] ?? 0).toDouble(),
      method: data['method'] ?? '',
      status: data['status'] ?? '',
      timestamp: (data['timestamp'] as Timestamp).toDate(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'userId': userId,
      'type': type,
      'amount': amount,
      'method': method,
      'status': status,
      'timestamp': Timestamp.fromDate(timestamp),
    };
  }
}
