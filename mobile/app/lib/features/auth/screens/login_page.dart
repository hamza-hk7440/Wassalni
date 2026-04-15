import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:get/get.dart';
import 'package:app/core/theme/colors_R.dart';
import 'package:app/features/auth/screens/signup_page.dart';
import 'package:app/features/auth/auth_controller.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isPasswordVisible = false;
  bool _isCodeDialogOpen = false;
  final AuthController authController = Get.find<AuthController>();

  Widget _buildDivider() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 20),
      child: Row(
        children: [
          Expanded(child: Divider(color: Colors.grey[300], thickness: 1)),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10),
            child: Text(
              'or_separator'.tr,
              style: GoogleFonts.poppins(color: Colors.grey[500], fontSize: 12),
            ),
          ),
          Expanded(child: Divider(color: Colors.grey[300], thickness: 1)),
        ],
      ),
    );
  }

  Widget _buildGoogleButton() {
    return Container(
      width: double.infinity,
      height: 55,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Obx(
        () => InkWell(
          borderRadius: BorderRadius.circular(15),
          onTap: authController.isLoading.value
              ? null
              : () => authController.loginWithGoogle(),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (authController.isLoading.value)
                const SizedBox(
                  height: 22,
                  width: 22,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              else
                Image.asset("assets/logoGoogle.png", height: 22),
              const SizedBox(width: 12),
              Text(
                'continue_with_google'.tr,
                style: GoogleFonts.poppins(
                  color: Colors.black87,
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.colorL,
      appBar: AppBar(backgroundColor: Colors.transparent, elevation: 0),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 30),
            child: Container(
              constraints: const BoxConstraints(maxWidth: 450),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'welcome_back'.tr,
                      style: GoogleFonts.poppins(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: AppColors.colorA,
                        letterSpacing: 1.5,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'login_subtitle'.tr,
                      textAlign: TextAlign.center,
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        color: Colors.grey[600],
                      ),
                    ),
                    const SizedBox(height: 40),

                    TextFormField(
                      controller: emailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: InputDecoration(
                        labelText: 'email'.tr,
                        hintText: 'enter_email'.tr,
                        prefixIcon: Icon(
                          Icons.email_outlined,
                          color: AppColors.colorA,
                        ),
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      validator: (value) => (value == null || value.isEmpty)
                          ? 'email_required'.tr
                          : null,
                    ),
                    SizedBox(height: 18),

                    TextFormField(
                      controller: passwordController,
                      obscureText: !_isPasswordVisible,
                      decoration: InputDecoration(
                        labelText: 'password'.tr,
                        hintText: 'enter_password'.tr,
                        prefixIcon: Icon(
                          Icons.lock_outline,
                          color: AppColors.colorA,
                        ),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _isPasswordVisible
                                ? Icons.visibility
                                : Icons.visibility_off,
                            color: Colors.grey,
                          ),
                          onPressed: () => setState(
                            () => _isPasswordVisible = !_isPasswordVisible,
                          ),
                        ),
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      validator: (value) => (value == null || value.isEmpty)
                          ? 'password_required'.tr
                          : null,
                    ),
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () {},
                        child: Text(
                          'forgot_password'.tr,
                          style: TextStyle(color: AppColors.colorA),
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),

                    Obx(() {
                      if (authController.errorMessage.value.isNotEmpty) {
                        return Padding(
                          padding: EdgeInsets.only(bottom: 16),
                          child: Text(
                            authController.errorMessage.value,
                            style: TextStyle(color: Colors.red),
                          ),
                        );
                      }
                      return SizedBox.shrink();
                    }),

                    SizedBox(
                      width: double.infinity,
                      height: 55,
                      child: Obx(
                        () => ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.colorA,
                            elevation: 5,
                            shadowColor: AppColors.colorA.withOpacity(0.4),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(15),
                            ),
                          ),
                          onPressed: authController.isLoading.value
                              ? null
                              : () async {
                                  if (_formKey.currentState!.validate()) {
                                    await authController.login(
                                      email: emailController.text,
                                      password: passwordController.text,
                                    );
                                    if (authController
                                            .pendingRole
                                            .value
                                            .isNotEmpty &&
                                        authController
                                            .pendingSession
                                            .value
                                            .isNotEmpty) {
                                      _maybeShowCodeDialog(
                                        authController.pendingRole.value,
                                      );
                                    }
                                  }
                                },
                          child: authController.isLoading.value
                              ? const SizedBox(
                                  height: 24,
                                  child: CircularProgressIndicator(
                                    color: Colors.white,
                                    strokeWidth: 2,
                                  ),
                                )
                              : Text(
                                  'login'.tr,
                                  style: GoogleFonts.poppins(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'dont_have_account'.tr,
                          style: GoogleFonts.poppins(color: Colors.grey[700]),
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const SignupScreen(),
                              ),
                            );
                          },
                          child: Text(
                            'create_account'.tr,
                            style: GoogleFonts.poppins(
                              fontWeight: FontWeight.bold,
                              color: AppColors.colorA,
                              decoration: TextDecoration.underline,
                            ),
                          ),
                        ),
                      ],
                    ),
                    _buildDivider(),
                    _buildGoogleButton(),
                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    ever(authController.pendingRole, (role) {
      if (role.isNotEmpty && authController.pendingSession.value.isNotEmpty) {
        _maybeShowCodeDialog(role);
      }
    });
  }

  void _maybeShowCodeDialog(String role) {
    if (!mounted || _isCodeDialogOpen) {
      return;
    }

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || _isCodeDialogOpen) return;
      if (authController.pendingRole.value.isNotEmpty &&
          authController.pendingSession.value.isNotEmpty) {
        _showCodeDialog(role);
      }
    });
  }

  void _showCodeDialog(String role) {
    if (_isCodeDialogOpen) return;
    _isCodeDialogOpen = true;
    final codeController = TextEditingController();
    final label = role == 'controller' ? 'controller_code' : 'admin_code';
    final hint = role == 'controller'
        ? 'verification_hint_controller'
        : 'verification_hint_admin';
    final maxLength = role == 'controller' ? 6 : 4;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          'verification_required'.tr,
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'verification_message'.tr,
              style: GoogleFonts.poppins(fontSize: 14, color: Colors.grey[600]),
            ),
            const SizedBox(height: 16),
            Obx(() {
              if (authController.errorMessage.value.isNotEmpty) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Text(
                    authController.errorMessage.value,
                    style: const TextStyle(color: Colors.red, fontSize: 13),
                  ),
                );
              }
              return const SizedBox.shrink();
            }),
            TextField(
              controller: codeController,
              keyboardType: TextInputType.number,
              maxLength: maxLength,
              decoration: InputDecoration(
                labelText: label.tr,
                hintText: hint.tr,
                prefixIcon: Icon(Icons.lock_outline, color: AppColors.colorA),
                filled: true,
                fillColor: Colors.grey[100],
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                counterText: '',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              authController.pendingSession.value = '';
              authController.pendingRole.value = '';
              authController.errorMessage.value = '';
              _isCodeDialogOpen = false;
              Navigator.pop(context);
            },
            child: Text('cancel'.tr, style: TextStyle(color: Colors.grey[600])),
          ),
          Obx(
            () => ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.colorA,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: authController.isLoading.value
                  ? null
                  : () async {
                      final success = await authController.verifyRoleCode(
                        code: codeController.text.trim(),
                      );
                      if (success) {
                        _isCodeDialogOpen = false;
                        Navigator.pop(context);
                      }
                    },
              child: authController.isLoading.value
                  ? const SizedBox(
                      height: 18,
                      width: 18,
                      child: CircularProgressIndicator(
                        color: Colors.white,
                        strokeWidth: 2,
                      ),
                    )
                  : Text(
                      'verify'.tr,
                      style: GoogleFonts.poppins(color: Colors.white),
                    ),
            ),
          ),
        ],
      ),
    );
  }
}
