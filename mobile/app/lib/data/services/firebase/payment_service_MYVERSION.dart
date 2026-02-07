import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:app/data/models/payment_model.dart';
import 'package:app/data/repositories/payment_repo.dart';
import 'package:app/data/services/api/paymee_remote.dart';

class FirebasePaymentService implements PaymentRepo {
  //creating firebase firestore instance
  final FirebaseFirestore _firestore;
  final PaymentRemote _paymentRemote;
  //create the constructor that will receive the firestore instance
  FirebasePaymentService(this._firestore, this._paymentRemote);

  //====implementation of payment operations=====
  //create payment method
  @override
  Future<String> createPaymentMethod({
    required String userId,
    required double amount,
    required String type, // 'paymee' or 'tokens'
    required String method, // 'online' or 'in station'
  }) async {
    try {
      if (type == 'paymee') {
        //call the paymee api to create the payment and get the payment
        final paymentResponse = await _paymentRemote.createPayment(
          amount: amount,
          note: 'Payment for order',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          orderId: '',
        );
        //save the payment id from the paymee response to be able to track the payment status later
        final paymentId = paymentResponse['data']['payment_id'].toString();
        final paymentUrl = paymentResponse['data']['payment_url'];
        //SAVE THE PAYMENT IN FIREBASE
        final paymentModel = PaymentModel(
          id: paymentId,
          userId: userId,
          amount: amount,
          type: type,
          method: method,
          status:'pending', //initial status will be pending until we get the webhook from paymee
          timestamp: DateTime.now(),
        );
        await _firestore
            .collection('PAYMENTS')
            .doc(paymentId)
            .set(paymentModel.toFirestore());
        //return the payment url to the caller to redirect the user to it
        return paymentUrl;
      }
      throw Exception('Unsupported payment type: $type');
    } catch (e) {
      throw Exception('Failed to create payment method: ${e.toString()}');
    }
  }

  @override
  Future<PaymentModel> savePaymentMethod(PaymentModel model) async {
    try {
      //generate an id for this payment
      final paymentRef = _firestore.collection('PAYMENTS').doc();
      final paymentId = paymentRef.id;
      //create the payment Model with the generated id
      final paymentModel = PaymentModel(
        id: paymentId,
        userId: model.userId,
        amount: model.amount,
        type: model.type,
        method: model.method,
        status: model.status,
        timestamp: DateTime.now(),
      );
      //save the payment Model to firestore
      await paymentRef.set(paymentModel.toFirestore());

      //return the payment object with the generated id(we will use it later for example to update the payment status after processing)
      return paymentModel;
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
  }) async {
    try {
      final paymentRef = _firestore.collection('PAYMENTS').doc(paymentId);
      //and here we will update only the fields that are in the updates map without affecting the other fields of the payment document
      await paymentRef.update(updates);
    } catch (e) {
      throw Exception('Failed to update payment: ${e.toString()}');
    }
  }

  @override
  Future<PaymentModel> getPaymentById(String paymentId) async {
    try {
      final paymentRef = _firestore.collection('PAYMENTS').doc(paymentId);
      final doc = await paymentRef.get();
      //test if the doculent exists
      if (!doc.exists) {
        throw Exception('Payment not found');
      }
      //return the payment object
      //we call it by PaymentModel bcz it's the name of the class in the payment_model.dart file
      return PaymentModel.fromFirestore(doc);
    } catch (e) {
      throw Exception('Failed to get payment: ${e.toString()}');
    }
  }

  //=============implemntation of token oprations===========
  //add token to user
  @override
  Future<void> addTokenToUser(String userId, double amount) async {
    try {
      final userRef = _firestore.collection('USERS').doc(userId);
      await userRef.update({'token_balance': FieldValue.increment(amount)});
    } catch (e) {
      throw Exception('Failed to add token to user: ${e.toString()}');
    }
  }

  //redeem tokens
  @override
  Future<void> redeemTokens(String userId, double amount) async {
    try {
      final userRef = _firestore.collection('USERS').doc(userId);
      await userRef.update({'token_balance': FieldValue.increment(-amount)});
    } catch (e) {
      throw Exception('Failed to redeem tokens: ${e.toString()}');
    }
  }

  //get user tokens
  @override
  Future<double> getUserTokens(String userId) async {
    try {
      final userRef = _firestore.collection('USERS').doc(userId);
      final doc = await userRef.get();
      if (!doc.exists) {
        throw Exception('User not found');
      }
      return doc.data()?['token_balance']?.toDouble() ?? 0.0;
    } catch (e) {
      throw Exception('Failed to get user tokens: ${e.toString()}');
    }
  }

  //check if user has enough tokens
  @override
  Future<bool> hasEnoughTokens(String userId, double amount) async {
    try {
      final userRef = _firestore.collection('USERS').doc(userId);
      final doc = await userRef.get();
      if (!doc.exists) {
        throw Exception('User not found');
      }
      final tokenBallance = doc.data()?['token_balance']?.toDouble() ?? 0.0;
      return tokenBallance >= amount;
    } catch (e) {
      throw Exception('Failed to check user tokens: ${e.toString()}');
    }
  }
}
