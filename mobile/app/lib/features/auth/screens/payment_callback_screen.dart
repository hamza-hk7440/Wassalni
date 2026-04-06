import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:app/core/theme/colors_R.dart';
import '../../../data/api/api_service.dart';
import '../auth_controller.dart';
import 'home_screen.dart';
import 'recharge_screen.dart';

class PaymentCallbackScreen extends StatefulWidget {
  final bool isSuccess;
  final String? transactionId;

  const PaymentCallbackScreen({
    super.key,
    required this.isSuccess,
    this.transactionId,
  });

  @override
  State<PaymentCallbackScreen> createState() => _PaymentCallbackScreenState();
}

class _PaymentCallbackScreenState extends State<PaymentCallbackScreen> {
  final ApiService _apiService = ApiService();
  final AuthController _authController = Get.find<AuthController>();
  int? _updatedBalance;
  bool _isRefreshing = false;

  @override
  void initState() {
    super.initState();
    if (widget.isSuccess) {
      _refreshBalanceAfterPayment();
    }
  }

  Future<void> _refreshBalanceAfterPayment() async {
    final userId = _authController.currentUser.value?.userId;
    if (userId == null || userId.isEmpty) return;

    setState(() => _isRefreshing = true);

    for (int attempt = 0; attempt < 15; attempt++) {
      try {
        final balance = await _apiService.getTokensBalance(userId: userId);
        if (!mounted) return;

        setState(() {
          _updatedBalance = balance;
          _isRefreshing = false;
        });

        final current = _authController.currentUser.value;
        if (current != null) {
          _authController.currentUser.value = User(
            userId: current.userId,
            email: current.email,
            firstName: current.firstName,
            lastName: current.lastName,
            role: current.role,
            tokenBalance: balance.toDouble(),
            timestamp: current.timestamp,
          );
        }
        return;
      } catch (_) {
        await Future.delayed(const Duration(seconds: 2));
      }
    }

    if (mounted) {
      setState(() => _isRefreshing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.colorL,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  widget.isSuccess ? Icons.check_circle : Icons.cancel,
                  size: 80,
                  color: widget.isSuccess ? Colors.green : Colors.redAccent,
                ),
                const SizedBox(height: 16),
                Text(
                  widget.isSuccess ? 'Payment Successful' : 'Payment Failed',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: AppColors.colorD,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  widget.isSuccess
                      ? 'Your recharge request is received. Your token balance will update after confirmation.'
                      : 'The payment was cancelled or failed. You can retry your recharge.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    color: Colors.grey[700],
                  ),
                ),
                if (_isRefreshing) ...[
                  const SizedBox(height: 12),
                  const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Updating token balance...',
                    style: GoogleFonts.poppins(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
                if (_updatedBalance != null) ...[
                  const SizedBox(height: 12),
                  Text(
                    'New balance: $_updatedBalance tokens',
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Colors.green[700],
                    ),
                  ),
                ],
                if ((widget.transactionId ?? '').isNotEmpty) ...[
                  const SizedBox(height: 10),
                  Text(
                    'Transaction: ${widget.transactionId}',
                    style: GoogleFonts.poppins(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(builder: (_) => const RechargePage()),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.colorA,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    child: Text(
                      widget.isSuccess
                          ? 'Back to Recharge'
                          : 'Try Recharge Again',
                      style: GoogleFonts.poppins(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                TextButton(
                  onPressed: () {
                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(builder: (_) => const HomePage()),
                      (route) => false,
                    );
                  },
                  child: const Text('Go to Home'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
