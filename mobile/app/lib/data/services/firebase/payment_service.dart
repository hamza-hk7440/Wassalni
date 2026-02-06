import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:app/data/models/payment_model.dart';
import 'package:app/data/repositories/payment_repo.dart';

class FirebasePaymentService implements PaymentRepo {
  //creating firebase firestore instance
  final FirebaseFirestore _firestore;
  //create the constructor that will receive the firestore instance
  FirebasePaymentService(this._firestore);

  //====implementation of payment operations=====
  @override
  Future<PaymentRequest> savePaymentMethod(PaymentRequest request) async {
    try {
      //generate an id for this payment
      final paymentRef = _firestore.collection('PAYMENTS').doc();
      final paymentId = paymentRef.id;
      //create the payment request with the generated id
      final paymentrequest = PaymentRequest(
        id: paymentId,
        userId: request.userId,
        amount: request.amount,
        status: request.status,
        timestamp: DateTime.now(),
      );
      //save the payment request to firestore
      await paymentRef.set(paymentrequest.toFirestore());

      //return the payment object with the generated id(we will use it later for example to update the payment status after processing)
      return paymentrequest;
    } catch (e) {
      //handle errors
      throw Exception('Failed to save payment method: ${e.toString()}');
    }
  }
  @override
    Future<void> updatePayment({
      required String paymentId,
      //here we will pass the fields we want to update and their new values in a map
      required Map<String, dynamic> updates,
    })
    async {
      try{
        final paymentRef=_firestore.collection('PAYMENTS').doc(paymentId);
        //and here we will update only the fields that are in the updates map without affecting the other fields of the payment document
        await paymentRef.update(updates);
      }
      catch(e){
        throw Exception('Failed to update payment: ${e.toString()}');
      }
    }
    @override
    Future<PaymentRequest> getPaymentById(String paymentId) async{
      try{
        final paymentRef=_firestore.collection('PAYMENTS').doc(paymentId);
        final doc=await paymentRef.get();
        //test if the doculent exists
        if(!doc.exists){
          throw Exception('Payment not found');
        }
        //return the payment object
        //we call it by PaymentRequest bcz it's the name of the class in the payment_model.dart file
        return PaymentRequest.fromFirestore(doc);
      }
      catch(e){
        throw Exception('Failed to get payment: ${e.toString()}');
      }
    }
  

