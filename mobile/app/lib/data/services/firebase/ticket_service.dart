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

  @override
  Future<bool> verifyTicketValidity(String qrData) async {
    try {
      //here we use where bcz we want to search for the ticket by its qr data not by its id(we can just by the ticket ud in the normal way if extract the exact ticket id)
      final querySnapshot = await _firestore
          .collection('TICKETS')
          .where('qr_data', isEqualTo: qrData)
          .get();
      if (querySnapshot.docs.isNotEmpty) {
        //here we use first bcz .docs may return more than one document even if there is only one ticket bcz the term where return a list of docs
        final ticket = TicketModel.fromFirestore(querySnapshot.docs.first);
       // we get the data from firestore and convert it to a ticket model
        return ticket.status == 'valid';
      } else {
        return false;
      }
    } catch (e) {
      throw Exception('Failed to verify ticket validity: ${e.toString()}');
    }
  }
}
