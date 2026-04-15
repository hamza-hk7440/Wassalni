import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';
import 'dart:convert';
import 'package:app/data/api/api_client.dart';

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
  Rx<User?> currentUser = Rx<User?>(null);
  RxBool isLoading = false.obs;
  RxBool isAuthenticated = false.obs;
  RxString errorMessage = ''.obs;
  RxString successMessage = ''.obs;
  late final ApiClient _apiClient;
  @override
  void onInit() {
    super.onInit();
    _apiClient = ApiClient();
    checkAuthStatus();
  }

  //public methods
  // login method
  // Replace the existing login() method:
  Future<bool> login({required String email, required String password}) async {
    try {
      errorMessage.value = '';
      successMessage.value = '';
      final validationError = _validateLoginInputs(email, password);
      if (validationError != null) {
        errorMessage.value = validationError;
        return false;
      }
      isLoading.value = true;
      await _deleteToken();
      await _deleteUserData();

      dynamic response;
      try {
        response = await _apiClient.post(
          'users/loginunified',
          body: {'email': email, 'password': password},
        );
      } catch (unifiedError) {
        if (_isMissingProfileError(unifiedError)) {
          throw Exception(
            'This account exists in authentication but has no profile row in users table. Ask the backend admin to repair this user profile.',
          );
        }

        response = await _apiClient.post(
          'users/loginwebfirststep',
          body: {'email': email, 'password': password},
        );

        if (response is Map<String, dynamic> &&
            response.containsKey('token_temp')) {
          isLoading.value = false;
          pendingSession.value = response['token_temp']?.toString() ?? '';
          pendingRole.value = 'superAdmin';
          return true;
        }
      }

      if (response == null) throw Exception('Invalid response from server');
      final requiresCode = response['requiresCode'] as bool? ?? false;
      if (!requiresCode) {
        return _completeLogin(response);
      }

      final role = response['role'] as String;
      final session = response['session'] as String;
      isLoading.value = false;
      pendingSession.value = session;
      pendingRole.value = role;
      return true;
    } catch (e) {
      _handleError(e);
      isLoading.value = false;
      return false;
    }
  }

  RxString pendingSession = ''.obs;
  RxString pendingRole = ''.obs;
  Future<bool> verifyRoleCode({required String code}) async {
    try {
      errorMessage.value = '';
      isLoading.value = true;
      dynamic response;

      try {
        response = await _apiClient.post(
          'users/loginunified/verify',
          body: {'session': pendingSession.value, 'code': code},
        );
      } catch (_) {
        response = await _apiClient.post(
          'users/loginwebsecondstep',
          body: {'session': pendingSession.value, 'admin_code': code},
        );
      }

      if (response == null ||
          !response.containsKey('token') ||
          !response.containsKey('user')) {
        throw Exception('Invalid response from server');
      }
      return _completeLogin(response, clearPendingSession: true);
    } catch (e) {
      _handleError(e);
      isLoading.value = false;
      return false;
    }
  }

  Future<bool> _completeLogin(
    Map<String, dynamic> response, {
    bool clearPendingSession = false,
  }) async {
    if (!response.containsKey('token') || !response.containsKey('user')) {
      throw Exception('Invalid response from server');
    }

    final token = response['token'] as String;
    final userData = response['user'] as Map<String, dynamic>;
    userData['timestamp'] = DateTime.now().toIso8601String();
    final user = User.fromJson(userData);

    await _saveToken(token);
    await _saveUserData(user);

    currentUser.value = user;
    isAuthenticated.value = true;
    successMessage.value = 'Login successful';
    isLoading.value = false;

    if (clearPendingSession) {
      pendingSession.value = '';
      pendingRole.value = '';
    }

    Future.delayed(
      const Duration(seconds: 1),
      () => _navigateBasedOnRole(user),
    );
    return true;
  }

  bool _isMissingProfileError(dynamic error) {
    final message = error.toString();
    return message.contains('PGRST116') ||
        message.contains('Cannot coerce the result to a single JSON object') ||
        message.contains('The result contains 0 rows');
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

  Future<void> loginWithGoogle() async {
    try {
      errorMessage.value = '';
      successMessage.value = '';
      isLoading.value = true;
      final response = await _apiClient.get('users/auth/google');
      if (response == null || !response.containsKey('url')) {
        throw Exception('Failed to get Google sign-in URL');
      }
      final googleUrl = response['url'] as String;
      await launchUrl(
        Uri.parse(googleUrl),
        mode: LaunchMode.externalApplication,
      );
    } catch (e) {
      _handleError(e);
      isLoading.value = false;
    }
  }

  Future<void> handleGoogleCallback(Uri uri) async {
    try {
      final fragment = uri.fragment;
      final params = Uri.splitQueryString(fragment);

      final error = params['error'] ?? uri.queryParameters['error'];
      if (error != null) {
        errorMessage.value = Uri.decodeComponent(error);
        isLoading.value = false;
        return;
      }
      final token = params['access_token'];
      if (token == null) {
        errorMessage.value = 'Google sign-in failed. No token received.';
        isLoading.value = false;
        return;
      }
      final parts = token.split('.');
      if (parts.length != 3) {
        errorMessage.value = 'Google sign-in failed. Invalid token.';
        isLoading.value = false;
        return;
      }
      String payload = parts[1];
      payload += '=' * ((4 - payload.length % 4) % 4);
      final payloadJson = utf8.decode(base64Url.decode(payload));
      final payloadMap = jsonDecode(payloadJson) as Map<String, dynamic>;
      final userMeta =
          payloadMap['user_metadata'] as Map<String, dynamic>? ?? {};

      final userData = {
        'id': payloadMap['sub'] ?? '',
        'email': payloadMap['email'] ?? '',
        'role': 'passenger',
        'first_name': userMeta['full_name']?.toString().split(' ').first ?? '',
        'last_name':
            userMeta['full_name']?.toString().split(' ').skip(1).join(' ') ??
            '',
        'token_balance': 0,
        'timestamp': DateTime.now().toIso8601String(),
      };
      final user = User.fromJson(userData);
      await _saveToken(token);
      await _saveUserData(user);
      currentUser.value = user;
      isAuthenticated.value = true;
      successMessage.value = 'Google sign-in successful';
      isLoading.value = false;
      _navigateBasedOnRole(user);
    } catch (e) {
      print('🔴 [Google] handleGoogleCallback error: $e');
      _handleError(e);
      isLoading.value = false;
    }
  }

  Future<void> logout() async {
    await _deleteToken();
    await _deleteUserData();
    currentUser.value = null;
    isAuthenticated.value = false;
    Get.offAllNamed('/login');
  }

  void _navigateBasedOnRole(User user) {
    if (user.isSuperAdmin) {
      Get.offAllNamed('/superadminhome');
    } else if (user.isController) {
      Get.offAllNamed('/controllerhome');
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
          const int sessionLimitMinutes = 30;

          if (now.difference(loginDate).inMinutes >= sessionLimitMinutes) {
            print('Session expired. Redirecting...');
            await _deleteToken();
            await _deleteUserData();
            currentUser.value = null;
            isAuthenticated.value = false;
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

  /// handle errors from API calls and convert to user-friendly messages
  void _handleError(dynamic error) {
    String message = 'An error occurred';

    if (error is Exception) {
      print('Raw error: $error');
      print('Error type: ${error.runtimeType}');
      String errorString = error.toString();
      if (errorString.contains('401') || errorString.contains('Unauthorized')) {
        message = 'Invalid email or password';
      } else if (errorString.contains('PGRST116') ||
          errorString.contains(
            'Cannot coerce the result to a single JSON object',
          ) ||
          errorString.contains('The result contains 0 rows')) {
        message =
            'This account has no profile in users table. Ask backend admin to fix this user record, then try again.';
      } else if (errorString.contains('409') ||
          errorString.contains('already')) {
        message = 'Email is already registered. Please login instead.';
      } else if (errorString.contains('500') ||
          errorString.contains('Server')) {
        message = error.toString().replaceAll('Exception: ', '');
        ;
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
