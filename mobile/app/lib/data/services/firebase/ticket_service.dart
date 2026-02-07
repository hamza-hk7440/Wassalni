import 'package:app/data/models/ticket_model.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:app/data/repositories/ticket_repo.dart';

class FirebaseTicketService implements TicketRepo {
  final FirebaseFirestore _firestore;

  FirebaseTicketService(this._firestore);

  @override
  Future<void> createTicket({
    required String userId,
    required String scheduleId,
  }) async {
    try {
      final ticketRef = _firestore.collection('TICKETS').doc();
      final ticketId = ticketRef.id;
      final qrData = 'TICKET-$ticketId';
      final ticketmodel = TicketModel(
        ticketId: ticketId,
        userId: userId,
        scheduleId: scheduleId,
        qrData: qrData,
        status: 'valid',
        purchaseDate: DateTime.now(),
      );
      await ticketRef.set(ticketmodel.toFirestore());
    } catch (e) {
      throw Exception('Failed to create ticket: ${e.toString()}');
    }
  }

  @override
  Future<String> getQrDataOfTheTicketById(String ticketId) async {
    try {
      final doc = await _firestore.collection('TICKETS').doc(ticketId).get();
      if (doc.exists) {
        final ticket = TicketModel.fromFirestore(doc);
        return ticket.qrData;
      } else {
        throw Exception('Ticket not found');
      }
    } catch (e) {
      throw Exception('Failed to get QR data: ${e.toString()}');
    }
  }

  @override
  Future<void> updateTicketStatus(String ticketId, String status) async {
    try {
      await _firestore.collection('TICKETS').doc(ticketId).update({
        'status': status,
      });
    } catch (e) {
      throw Exception('Failed to update ticket status: ${e.toString()}');
    }
  }
}
