import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:app/data/api/api_client.dart';
//user roles
class UserRoles{
  static const String PASSENGER = 'passenger';
  static const String ADMIN = 'admin';
  static const String CONTROLLER = 'controller';
  static const String SUPERADMIN = 'superAdmin';
}
//user model
class User {
  final String userId;
  final String email;
  final String firstName;
  final String lastName;
  final String role;
  final double tokenBalance;
  final DateTime timestamp;
  User({
    required this.userId,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.role,
    required this.tokenBalance,
    required this.timestamp,
  });
  //from json to user model
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      userId: json['userId'],
      email: json['email'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      role: json['role'],
      tokenBalance: (json['tokenBalance'] as num).toDouble(),
      timestamp: json['timestamp'] != null
          ? DateTime.parse(json['timestamp'])
          : DateTime.now(),
    );
  }
  //from user model to json
  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'email': email,
      'firstName': firstName,
      'lastName': lastName,
      'role': role,
      'tokenBalance': tokenBalance,
      'timestamp': timestamp.toIso8601String(),
    };
  }
  //get full name
  String get fullName => '$firstName $lastName';
  //check if the user is admin
  bool get isAdmin => role == UserRoles.ADMIN ;
  //check if the user is controller
  bool get isController => role == UserRoles.CONTROLLER ;
  //check if the user is super admin
  bool get isSuperAdmin => role == UserRoles.SUPERADMIN ;
  //check if the user is passenger
  bool get isPassenger => role == UserRoles.PASSENGER ;
}
  //manage the auth operations
  class AuthController extends GetxController {
    static const String authToken = 'auth_token';
    static const String userDataKey = 'user_data';

    //GetX observable state
    ///current logged in user
    Rx<User?> currentUser = Rx<User?>(null);
    ///is ogin/signup request in progress?
    RxBool isLoading = false.obs;
    //is the user logged in?
    RxBool isAuthenticated = false.obs;
    //error message from failed requests
    RxString errorMessage = ''.obs;
    //succes message for user feedback
    RxString successMessage = ''.obs;
    //api client instance
    late final ApiClient _apiClient;
    //lifecycle method called when the controller is initialized
    @override
    void onInit() {
      super.onInit();
      _apiClient = ApiClient();
      checkAuthStatus();
    }
    //=====public methods=====
    //login method
    Future<bool> login(
      {
        required String email,
        required String password,
      })async{
        try{
          //step 1:clear previous errors
          errorMessage.value = '';
          successMessage.value = '';
          //step 2: validate inputs locally
          final validationError = _validateLoginInputs(email, password);
          if (validationError != null) {
            errorMessage.value = validationError;
            return false;
          }
          //step 3: set loading state
          isLoading.value = true;
          //step 4: make api call to login endpoint
          final response = await _apiClient.post
        }
      }

    


