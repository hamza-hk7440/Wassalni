abstract class TicketRepo {
  //create  ticket with the use of a generated ticket id to be able to generate a qr data
  Future<void> createTicket({
    required String userId,
    required String scheduleId,
  });
  //get the qr data of the ticket by its id
  Future<String> getQrDataOfTheTicketById(String ticketId);
  //update the status of the ticket to used when the user use it
  Future<void> updateTicketStatus(String ticketId, String status);
  //verify ticket validity by its qr data
  Future<bool> verifyTicketValidity(String qrData);
}
