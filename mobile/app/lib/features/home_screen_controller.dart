import 'package:get/get.dart';
import 'package:app/data/api/api_client.dart';
import 'package:app/features/auth/auth_controller.dart';

class HomeScreenController extends GetxController {
  final ApiClient _apiClient = ApiClient();
  final AuthController _authController = Get.find<AuthController>();

  final RxBool isLoading = false.obs;
  final RxInt tokenBalance = 0.obs;
  final RxString displayName = 'Wasalni user'.obs;

  @override
  void onInit() {
    super.onInit();
    _setFromLocalUser();
    loadHomeInfo();
  }

  void _setFromLocalUser() {
    final current = _authController.currentUser.value;
    if (current == null) return;

    tokenBalance.value = current.tokenBalance.toInt();

    final localName = '${current.firstName} ${current.lastName}'.trim();
    if (localName.isNotEmpty) {
      displayName.value = localName;
    }
  }

  Future<void> loadHomeInfo() async {
    final current = _authController.currentUser.value;
    final userId = current?.userId;

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
      final fullName = '$firstName $lastName'.trim();
      final balance = (response['token_balance'] is num)
          ? (response['token_balance'] as num).toInt()
          : int.tryParse(response['token_balance']?.toString() ?? '') ?? 0;

      tokenBalance.value = balance;
      if (fullName.isNotEmpty) {
        displayName.value = fullName;
      }

      if (current != null) {
        _authController.currentUser.value = User(
          userId: current.userId,
          email: current.email,
          firstName: firstName.isNotEmpty ? firstName : current.firstName,
          lastName: lastName.isNotEmpty ? lastName : current.lastName,
          role: current.role,
          tokenBalance: balance.toDouble(),
          timestamp: current.timestamp,
        );
      }
    } catch (_) {
      _setFromLocalUser();
    } finally {
      isLoading.value = false;
    }
  }
}
