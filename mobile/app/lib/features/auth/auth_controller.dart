import 'package:get/get.dart';
import 'package:get/get_connect/http/src/utils/utils.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:app/data/api/api_client.dart';
// ==================== PRIVATE METHODS====================

/// get stored token from SharedPreferences
/// returns null if no token found
Future<String?> _getToken() async {
  try {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(AuthController.authToken);
  } catch (e) {
    print('Error getting token: $e');
    return null;
  }
}

/// save token to SharedPreferences
Future<void> _saveToken(String token) async {
  try {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(AuthController.authToken, token);
    print('Token saved successfully');
  } catch (e) {
    print('Error saving token: $e');
    rethrow;
  }
}

/// delete token from SharedPreferences
Future<void> _deleteToken() async {
  try {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AuthController.authToken);
    print('Token deleted successfully');
  } catch (e) {
    print('Error deleting token: $e');
  }
}

/// get stored user data from SharedPreferences
/// returns null if no user data found
Future<User?> _getUserData() async {
  try {
    final prefs = await SharedPreferences.getInstance();
    final userDataJson = prefs.getString(AuthController.userDataKey);

    if (userDataJson == null) {
      return null;
    }

    // decode JSON string back to User object
    final userData = jsonDecode(userDataJson) as Map<String, dynamic>;
    return User.fromJson(userData);
  } catch (e) {
    print('Error getting user data: $e');
    return null;
  }
}

/// save user data to SharedPreferences
Future<void> _saveUserData(User user) async {
  try {
    final prefs = await SharedPreferences.getInstance();
    final userDataJson = jsonEncode(user.toJson());
    await prefs.setString(AuthController.userDataKey, userDataJson);
    print('User data saved successfully');
  } catch (e) {
    print('Error saving user data: $e');
    rethrow;
  }
}

/// delete user data from SharedPreferences
Future<void> _deleteUserData() async {
  try {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AuthController.userDataKey);
    print('User data deleted successfully');
  } catch (e) {
    print('Error deleting user data: $e');
  }
}

//user roles
class UserRoles {
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
    final userMeta = json['user_metadata'] is Map
        ? json['user_metadata'] as Map<String, dynamic>
        : <String, dynamic>{};

    return User(
      userId:
          json['id']?.toString() ??
          json['user_id']?.toString() ??
          json['sub']?.toString() ??
          '',
      firstName:
          json['first_name']?.toString() ??
          userMeta['first_name']?.toString() ??
          '',
      lastName:
          json['last_name']?.toString() ??
          userMeta['last_name']?.toString() ??
          '',
      email: json['email']?.toString() ?? '',
      role:
          json['role']?.toString() ??
          userMeta['role']?.toString() ??
          'passenger',
      tokenBalance:
          double.tryParse(
            (json['token_balance'] ?? userMeta['token_balance'] ?? 0)
                .toString(),
          ) ??
          0.0,
      timestamp: json['timestamp'] != null
          ? DateTime.tryParse(json['timestamp'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
  //from user model to json
  Map<String, dynamic> toJson() {
    return {
      'id': userId,
      'email': email,
      'first_name': firstName,
      'last_name': lastName,
      'role': role,
      'token_balance': tokenBalance,
      'timestamp': timestamp.toIso8601String(),
    };
  }

  //get full name
  String get fullName => '$firstName $lastName';
  //check if the user is admin
  bool get isAdmin => role == UserRoles.ADMIN;
  //check if the user is controller
  bool get isController => role == UserRoles.CONTROLLER;
  //check if the user is super admin
  bool get isSuperAdmin => role == UserRoles.SUPERADMIN;
  //check if the user is passenger
  bool get isPassenger => role == UserRoles.PASSENGER;
}

//manage the auth operations
class AuthController extends GetxController {
  static const String authToken = 'auth_token';
  static const String userDataKey = 'user_data';

  //GetX observable state
  ///current logged in user
  Rx<User?> currentUser = Rx<User?>(null);

  ///is login/signup request in progress?
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
  // login method
  Future<bool> login({required String email, required String password}) async {
    try {
      // step 1: clear previous errors
      errorMessage.value = '';
      successMessage.value = '';

      // step 2: validate inputs locally
      final validationError = _validateLoginInputs(email, password);
      if (validationError != null) {
        errorMessage.value = validationError;
        return false;
      }

      // step 3: set loading state early to block any checkAuthStatus interference
      isLoading.value = true;

      // step 4: clear any stale session data before making the API call
      await _deleteToken();
      await _deleteUserData();

      // step 5: make api call to login endpoint
      final response = await _apiClient.post(
        'users/loginmobile',
        body: {'email': email, 'password': password},
      );

      // step 6: check if the response is successful
      if (response == null ||
          !response.containsKey('token') ||
          !response.containsKey('user')) {
        throw Exception('Invalid response from server');
      }

      // step 7: extract user data and token from response
      final token = response['token'] as String;
      final userData = response['user'] as Map<String, dynamic>;

      // --- TIMESTAMP FIX START ---
      // We manually add the login time here so it is saved permanently to SharedPreferences
      userData['timestamp'] = DateTime.now().toIso8601String();
      // --- TIMESTAMP FIX END ---

      final user = User.fromJson(userData);

      // step 8: save token to shared preferences
      await _saveToken(token);

      // step 9: save user data (including the new timestamp) to shared preferences
      await _saveUserData(user);

      // step 10: update app state
      currentUser.value = user;
      isAuthenticated.value = true;
      successMessage.value = 'Login successful';

      // step 11: hide loading state
      isLoading.value = false;

      // step 12: navigate based on the specific user role
      Future.delayed(const Duration(seconds: 1), () {
        _navigateBasedOnRole(user);
      });

      return true;
    } catch (e) {
      // handle errors
      _handleError(e);
      isLoading.value = false;
      return false;
    }
  }

  //signup method
  Future<bool> signup({
    required String email,
    required String password,
    required String confirmPassword,
    required String firstName,
    required String lastName,
  }) async {
    try {
      //step 1:clear previous errors
      errorMessage.value = '';
      successMessage.value = '';
      //step 2: validate inputs locally
      final validationError = _validateSignupInputs(
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
      );
      if (validationError != null) {
        errorMessage.value = validationError;
        return false;
      }
      //step 3: set loading state
      isLoading.value = true;
      //step 4: make api call to signup endpoint
      final response = await _apiClient.post(
        'users/createuser',
        body: {
          'email': email,
          'role': 'passenger',
          'password': password,
          'first_name': firstName,
          'last_name': lastName,
        },
      );
      //step 5:check if the response is successful
      if (response == null || !response.containsKey('user')) {
        throw Exception('Invalid response from server');
      }
      //step 6: extract user data from response
      final userData = response['user'] as Map<String, dynamic>;
      final user = User.fromJson(userData);
      //step 7: save user data to shared preferences
      await _saveUserData(user);
      //step 8: update app state
      currentUser.value = user;
      isAuthenticated.value = true;
      successMessage.value = 'Signup successful';
      //step 9: hide loading state
      isLoading.value = false;
      //step 10: return navigate to home screen
      Future.delayed(const Duration(seconds: 1), () {
        Get.offAllNamed('/login');
      });
      return true;
    } catch (e) {
      //handle errors
      _handleError(e);
      isLoading.value = false;
      return false;
    }
  }

  Future<void> logout() async {
    await _deleteToken();
    await _deleteUserData();
    currentUser.value = null;
    isAuthenticated.value = false;
    Get.offAllNamed('/rolechoice');
  }

  void _navigateBasedOnRole(User user) {
    if (user.isController) {
      Get.offAllNamed('/loginforcontroller');
    } else {
      Get.offAllNamed('/home');
    }
  }

  Future<void> checkAuthStatus() async {
    try {
      final token = await _getToken();

      if (token != null && token.isNotEmpty) {
        final userData = await _getUserData();

        if (userData != null) {
          final now = DateTime.now();
          final loginDate = userData.timestamp;
          const int sessionLimitMinutes = 3;

          if (now.difference(loginDate).inMinutes >= sessionLimitMinutes) {
            print('Session expired. Redirecting...');
            await _deleteToken();
            await _deleteUserData();
            currentUser.value = null;
            isAuthenticated.value = false;
            Get.offAllNamed('/rolechoice');
            return;
          }

          currentUser.value = userData;
          isAuthenticated.value = true;
          _navigateBasedOnRole(userData);
        } else {
          await _deleteToken();
          isAuthenticated.value = false;
        }
      } else {
        isAuthenticated.value = false;
      }
    } catch (e) {
      print('Error checking auth status: $e');
      isAuthenticated.value = false;
    }
  }
  // ==================== PRIVATE METHODS (Input Validation) ====================

  /// validate login inputs
  /// returns error message if validation fails, null if all good
  String? _validateLoginInputs(String email, String password) {
    // check if email is empty
    if (email.isEmpty) {
      return 'Email is required';
    }

    // check if email format is valid
    if (!_isValidEmail(email)) {
      return 'Please enter a valid email';
    }

    // check if password is empty
    if (password.isEmpty) {
      return 'Password is required';
    }

    // check minimum password length
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    // all validations passed
    return null;
  }

  /// validate signup inputs
  /// returns error message if validation fails, null if all good
  String? _validateSignupInputs(
    String email,
    String password,
    String confirmPassword,
    String firstName,
    String lastName,
  ) {
    // check if email is empty
    if (email.isEmpty) {
      return 'Email is required';
    }

    // check if email format is valid
    if (!_isValidEmail(email)) {
      return 'Please enter a valid email';
    }

    // check if first name is empty
    if (firstName.isEmpty) {
      return 'First name is required';
    }

    // check if first name has minimum length
    if (firstName.length < 2) {
      return 'First name must be at least 2 characters';
    }

    // check if last name is empty
    if (lastName.isEmpty) {
      return 'Last name is required';
    }

    // check  if last name has minimum length
    if (lastName.length < 2) {
      return 'Last name must be at least 2 characters';
    }

    // check if password is empty
    if (password.isEmpty) {
      return 'Password is required';
    }

    // check minimum password length
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    // check if password has uppercase letter
    if (!password.contains(RegExp(r'[A-Z]'))) {
      return 'Password must contain an uppercase letter';
    }

    // check if password has number
    if (!password.contains(RegExp(r'[0-9]'))) {
      return 'Password must contain a number';
    }

    // check if passwords match
    if (password != confirmPassword) {
      return 'Passwords do not match';
    }

    // all validations passed
    return null;
  }

  /// check if email format is valid using regex
  bool _isValidEmail(String email) {
    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );
    return emailRegex.hasMatch(email);
  }

  // ==================== PRIVATE METHODS (Error Handling) ====================

  /// handle errors from API calls and convert to user-friendly messages
  void _handleError(dynamic error) {
    String message = 'An error occurred';

    if (error is Exception) {
      String errorString = error.toString();

      // check for specific error messages from API
      if (errorString.contains('401') || errorString.contains('Unauthorized')) {
        message = 'Invalid email or password';
      } else if (errorString.contains('409') ||
          errorString.contains('already')) {
        message = 'Email is already registered. Please login instead.';
      } else if (errorString.contains('500') ||
          errorString.contains('Server')) {
        message = 'Server error. Please try again later.';
      } else if (errorString.contains('Network') ||
          errorString.contains('timeout')) {
        message = 'Network error. Please check your internet connection.';
      } else {
        message = error.toString().replaceAll('Exception: ', '');
      }
    }

    errorMessage.value = message;
    print('Auth Error: $message');
  }
}
