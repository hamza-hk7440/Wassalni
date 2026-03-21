import 'package:get/get.dart';
import 'package:get/get_connect/http/src/utils/utils.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:app/data/api/api_client.dart';
// ==================== PRIVATE METHODS====================

/// Get stored token from SharedPreferences
/// Returns null if no token found
Future<String?> _getToken() async {
  try {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(AuthController.authToken);
  } catch (e) {
    print('Error getting token: $e');
    return null;
  }
}

/// Save token to SharedPreferences
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

/// Delete token from SharedPreferences
Future<void> _deleteToken() async {
  try {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AuthController.authToken);
    print('Token deleted successfully');
  } catch (e) {
    print('Error deleting token: $e');
  }
}

/// Get stored user data from SharedPreferences
/// Returns null if no user data found
Future<User?> _getUserData() async {
  try {
    final prefs = await SharedPreferences.getInstance();
    final userDataJson = prefs.getString(AuthController.userDataKey);

    if (userDataJson == null) {
      return null;
    }

    // Decode JSON string back to User object
    final userData = jsonDecode(userDataJson) as Map<String, dynamic>;
    return User.fromJson(userData);
  } catch (e) {
    print('Error getting user data: $e');
    return null;
  }
}

/// Save user data to SharedPreferences
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

/// Delete user data from SharedPreferences
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
    return User(
      userId: json['user_id'] ?? '', // ✅
      firstName: json['first_name'] ?? '', // ✅
      lastName: json['last_name'] ?? '', // ✅
      email: json['email'] ?? '',
      role: json['role'] ?? 'passenger',
      tokenBalance: (json['token_balance'] ?? 0).toDouble(), // ✅
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
  Future<bool> login({required String email, required String password}) async {
    try {
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
      final response = await _apiClient.post(
        'users/loginmobile',
        body: {'email': email, 'password': password},
      );
      //step 5:check if the response is successfulx
      if (response == null ||
          !response.containsKey('token') ||
          !response.containsKey('user')) {
        throw Exception('Invalid response from server');
      }
      //step 6: extract user data and token from response
      final token = response['token'] as String;
      final userData = response['user'] as Map<String, dynamic>;
      final user = User.fromJson(userData);
      //step 7: save token and user data to shared preferences
      await _saveToken(token);
      //step 8: save user data to shared preferences
      await _saveUserData(user);
      //step 9: update app state
      currentUser.value = user;
      isAuthenticated.value = true;
      successMessage.value = 'Login successful';
      //step 10: hide loading state
      isLoading.value = false;
      //step 11: return navigate to home screen
      Future.delayed(const Duration(seconds: 1), () {
        Get.offAllNamed('/home');
      });
      return true;
    } catch (e) {
      //handle errors
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
      if (response == null ||
          !response.containsKey('token') ||
          !response.containsKey('user')) {
        throw Exception('Invalid response from server');
      }
      //step 6: extract user data and token from response
      final token = response['token'] as String;
      final userData = response['user'] as Map<String, dynamic>;
      final user = User.fromJson(userData);
      //step 7: save token and user data to shared preferences
      await _saveToken(token);
      await _saveUserData(user);
      //step 8: update app state
      currentUser.value = user;
      isAuthenticated.value = true;
      successMessage.value = 'Signup successful';
      //step 9: hide loading state
      isLoading.value = false;
      //step 10: return navigate to home screen
      Future.delayed(const Duration(seconds: 1), () {
        Get.offAllNamed('/home');
      });
      return true;
    } catch (e) {
      //handle errors
      _handleError(e);
      isLoading.value = false;
      return false;
    }
  }

  Future<void> checkAuthStatus() async {
    try {
      // Step 1: Try to get stored token
      final token = await _getToken();

      if (token != null && token.isNotEmpty) {
        // Step 2: Token exists, get user data
        final userData = await _getUserData();
        if (userData != null) {
          // Step 3: Update app state
          currentUser.value = userData;
          isAuthenticated.value = true;
          print('User already logged in: ${userData.email}');
        } else {
          // Token exists but user data missing, clear token
          await _deleteToken();
          isAuthenticated.value = false;
        }
      } else {
        // No token found, user needs to login
        isAuthenticated.value = false;
        print('No stored token. User needs to login.');
      }
    } catch (e) {
      print('Error checking auth status: $e');
      isAuthenticated.value = false;
    }
  }

  // ==================== PRIVATE METHODS (Input Validation) ====================

  /// Validate login inputs
  /// Returns error message if validation fails, null if all good
  String? _validateLoginInputs(String email, String password) {
    // Check if email is empty
    if (email.isEmpty) {
      return 'Email is required';
    }

    // Check if email format is valid
    if (!_isValidEmail(email)) {
      return 'Please enter a valid email';
    }

    // Check if password is empty
    if (password.isEmpty) {
      return 'Password is required';
    }

    // Check minimum password length
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    // All validations passed
    return null;
  }

  /// Validate signup inputs
  /// Returns error message if validation fails, null if all good
  String? _validateSignupInputs(
    String email,
    String password,
    String confirmPassword,
    String firstName,
    String lastName,
  ) {
    // Check if email is empty
    if (email.isEmpty) {
      return 'Email is required';
    }

    // Check if email format is valid
    if (!_isValidEmail(email)) {
      return 'Please enter a valid email';
    }

    // Check if first name is empty
    if (firstName.isEmpty) {
      return 'First name is required';
    }

    // Check if first name has minimum length
    if (firstName.length < 2) {
      return 'First name must be at least 2 characters';
    }

    // Check if last name is empty
    if (lastName.isEmpty) {
      return 'Last name is required';
    }

    // Check if last name has minimum length
    if (lastName.length < 2) {
      return 'Last name must be at least 2 characters';
    }

    // Check if password is empty
    if (password.isEmpty) {
      return 'Password is required';
    }

    // Check minimum password length
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    // Check if password has uppercase letter
    if (!password.contains(RegExp(r'[A-Z]'))) {
      return 'Password must contain an uppercase letter';
    }

    // Check if password has number
    if (!password.contains(RegExp(r'[0-9]'))) {
      return 'Password must contain a number';
    }

    // Check if passwords match
    if (password != confirmPassword) {
      return 'Passwords do not match';
    }

    // All validations passed
    return null;
  }

  /// Check if email format is valid using regex
  bool _isValidEmail(String email) {
    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );
    return emailRegex.hasMatch(email);
  }

  // ==================== PRIVATE METHODS (Error Handling) ====================

  /// Handle errors from API calls and convert to user-friendly messages
  void _handleError(dynamic error) {
    String message = 'An error occurred';

    if (error is Exception) {
      String errorString = error.toString();

      // Check for specific error messages from API
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
