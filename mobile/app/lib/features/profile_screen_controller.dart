import 'package:get/get.dart';
import 'package:app/data/api/api_client.dart';
import 'package:app/features/auth/auth_controller.dart';

class ProfileScreenController extends GetxController {
  final ApiClient _apiClient = ApiClient();
  final AuthController _authController = Get.find<AuthController>();

  final RxBool isLoading = false.obs;
  final RxBool isChangingPassword = false.obs;
  final RxString fullName = 'Wasalni user'.obs;
  final RxString email = ''.obs;
  final RxInt tokenBalance = 0.obs;

  @override
  void onInit() {
    super.onInit();
    _setFromLocalUser();
    loadProfileInfo();
  }

  void _setFromLocalUser() {
    final user = _authController.currentUser.value;
    if (user == null) return;

    final localName = '${user.firstName} ${user.lastName}'.trim();
    if (localName.isNotEmpty) {
      fullName.value = localName;
    }

    email.value = user.email;
    tokenBalance.value = user.tokenBalance.toInt();
  }

  Future<void> loadProfileInfo() async {
    final user = _authController.currentUser.value;
    final userId = user?.userId;

    if (userId == null || userId.isEmpty) {
      return;
    }

    try {
      isLoading.value = true;
      final response = await _apiClient.post(
        'users/getuseressentialinfo',
        body: {'user_id': userId},
      );

      final firstName = (response['first_name'] ?? '').toString();
      final lastName = (response['last_name'] ?? '').toString();
      final fetchedName = '$firstName $lastName'.trim();
      final fetchedEmail = (response['email'] ?? '').toString();
      final fetchedBalance = response['token_balance'] is num
          ? (response['token_balance'] as num).toDouble()
          : double.tryParse(response['token_balance']?.toString() ?? '') ?? 0;

      if (fetchedName.isNotEmpty) {
        fullName.value = fetchedName;
      }

      if (fetchedEmail.isNotEmpty) {
        email.value = fetchedEmail;
      }

      tokenBalance.value = fetchedBalance.toInt();

      if (user != null) {
        _authController.currentUser.value = User(
          userId: user.userId,
          email: fetchedEmail.isNotEmpty ? fetchedEmail : user.email,
          firstName: firstName.isNotEmpty ? firstName : user.firstName,
          lastName: lastName.isNotEmpty ? lastName : user.lastName,
          role: user.role,
          tokenBalance: fetchedBalance,
          timestamp: user.timestamp,
        );
      }
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> changePassword({required String newPassword}) async {
    if (newPassword.length < 6) {
      throw Exception('Password must be at least 6 characters');
    }

    try {
      isChangingPassword.value = true;
      await _apiClient.post(
        'users/changepassword',
        body: {'new_password': newPassword},
      );
    } finally {
      isChangingPassword.value = false;
    }
  }

  Future<void> logout() async {
    await _authController.logout();
  }
}
