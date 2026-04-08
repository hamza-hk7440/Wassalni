import 'package:get/get.dart';

class RoleChoiceController extends GetxController {
  // Method to handle navigation based on the selected role
  void selectRole(String role) {
    if (role == 'passenger') {
      Get.toNamed('/login');
    } else if (role == 'controller') {
      Get.toNamed('/loginforcontroller');
    }
  }
}
