import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:app/core/theme/colors_R.dart';
import '../../profile_screen_controller.dart';
import 'recharge_screen.dart';
import 'my_tickets_screen.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  late final ProfileScreenController _controller;

  @override
  void initState() {
    super.initState();
    _controller = Get.isRegistered<ProfileScreenController>()
        ? Get.find<ProfileScreenController>()
        : Get.put(ProfileScreenController());
  }

  @override
  void dispose() {
    if (Get.isRegistered<ProfileScreenController>()) {
      Get.delete<ProfileScreenController>();
    }
    super.dispose();
  }

  Future<void> _openChangePasswordDialog() async {
    final passwordController = TextEditingController();
    final confirmController = TextEditingController();
    String? errorText;

    await showDialog(
      context: context,
      builder: (dialogContext) {
        return StatefulBuilder(
          builder: (dialogContext, setDialogState) {
            return AlertDialog(
              title: const Text("Change password"),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: passwordController,
                    obscureText: true,
                    decoration: const InputDecoration(
                      labelText: "New password",
                    ),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: confirmController,
                    obscureText: true,
                    decoration: const InputDecoration(
                      labelText: "Confirm password",
                    ),
                  ),
                  if (errorText != null) ...[
                    const SizedBox(height: 10),
                    Text(errorText!, style: const TextStyle(color: Colors.red)),
                  ],
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(dialogContext),
                  child: const Text("Cancel"),
                ),
                Obx(
                  () => TextButton(
                    onPressed: _controller.isChangingPassword.value
                        ? null
                        : () async {
                            final newPassword = passwordController.text.trim();
                            final confirmPassword = confirmController.text
                                .trim();

                            if (newPassword.isEmpty ||
                                confirmPassword.isEmpty) {
                              setDialogState(
                                () => errorText = "All fields are required",
                              );
                              return;
                            }

                            if (newPassword != confirmPassword) {
                              setDialogState(
                                () => errorText = "Passwords do not match",
                              );
                              return;
                            }

                            try {
                              await _controller.changePassword(
                                newPassword: newPassword,
                              );
                              if (!mounted) return;
                              Navigator.pop(dialogContext);
                            } catch (e) {
                              setDialogState(() => errorText = e.toString());
                            }
                          },
                    child: _controller.isChangingPassword.value
                        ? const SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Text("Save"),
                  ),
                ),
              ],
            );
          },
        );
      },
    );
  }

  void _showPersonalInfoDialog() {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text("Personal informations"),
        content: Obx(
          () => Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text("Name: ${_controller.fullName.value}"),
              const SizedBox(height: 6),
              Text("Email: ${_controller.email.value}"),
              const SizedBox(height: 6),
              Text("Tokens: ${_controller.tokenBalance.value}"),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text("Close"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.colorL,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Text(
          "My Profil",
          style: GoogleFonts.poppins(
            color: AppColors.colorD,
            fontWeight: FontWeight.bold,
            fontSize: 20,
          ),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios, color: AppColors.colorA),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 30),
            Center(
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 55,
                    backgroundColor: AppColors.colorA.withOpacity(0.1),
                    backgroundImage: const AssetImage("assets/profile.png"),
                  ),
                  const SizedBox(height: 15),
                  Obx(
                    () => Text(
                      _controller.fullName.value,
                      style: GoogleFonts.poppins(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: AppColors.colorD,
                      ),
                    ),
                  ),
                  Obx(
                    () => Text(
                      _controller.email.value,
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        color: Colors.grey,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 35),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 25),
              child: Row(
                children: [
                  Expanded(
                    flex: 2,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        vertical: 15,
                        horizontal: 20,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(15),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.03),
                            blurRadius: 10,
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          Image.asset("assets/token.png", height: 24),
                          const SizedBox(width: 12),
                          Obx(
                            () => Text(
                              "${_controller.tokenBalance.value} Tokens",
                              style: GoogleFonts.poppins(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                color: AppColors.colorD,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 15),
                  Expanded(
                    flex: 1,
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const RechargePage(),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.colorA,
                        padding: const EdgeInsets.symmetric(vertical: 15),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                        elevation: 0,
                      ),
                      child: const Icon(
                        Icons.add_rounded,
                        color: Colors.white,
                        size: 30,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 30),
            _buildSectionTitle("Account & Security"),
            _buildProfileItem(
              Icons.lock_outline,
              "Change password",
              onTap: _openChangePasswordDialog,
            ),
            _buildProfileItem(
              Icons.person_outline,
              "Personal informations",
              onTap: _showPersonalInfoDialog,
            ),
            const SizedBox(height: 20),
            _buildSectionTitle("Activités"),
            _buildProfileItem(
              Icons.confirmation_number_outlined,
              "Tickets history",
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => MyTicketsPage()),
                );
              },
            ),
            const SizedBox(height: 30),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 25),
              child: ListTile(
                onTap: () => _controller.logout(),
                tileColor: Colors.red.withOpacity(0.05),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15),
                ),
                leading: const Icon(Icons.logout, color: Colors.red),
                title: Text(
                  "Log out",
                  style: GoogleFonts.poppins(
                    color: Colors.red,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 30, bottom: 10, top: 10),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Text(
          title,
          style: GoogleFonts.poppins(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            color: Colors.grey[400],
          ),
        ),
      ),
    );
  }

  Widget _buildProfileItem(IconData icon, String title, {VoidCallback? onTap}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 5),
      child: ListTile(
        onTap: onTap ?? () {},
        tileColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        leading: Icon(icon, color: AppColors.colorA),
        title: Text(
          title,
          style: GoogleFonts.poppins(
            fontSize: 15,
            fontWeight: FontWeight.w500,
            color: AppColors.colorD,
          ),
        ),
        trailing: const Icon(
          Icons.arrow_forward_ios,
          size: 14,
          color: Colors.grey,
        ),
      ),
    );
  }
}
