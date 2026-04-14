import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:app/core/theme/colors_R.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../data/api/api_service.dart';
import '../auth_controller.dart';

class RechargePage extends StatefulWidget {
  const RechargePage({super.key});

  @override
  State<RechargePage> createState() => _RechargePageState();
}

class _RechargePageState extends State<RechargePage> {
  final ApiService _apiService = ApiService();
  final AuthController _authController = Get.find<AuthController>();
  int _tokenBalance = 0;
  String _loadingPack = '';

  @override
  void initState() {
    super.initState();
    _loadTokenBalance();
  }

  Future<void> _loadTokenBalance() async {
    final userId = _authController.currentUser.value?.userId;
    if (userId == null || userId.isEmpty) return;

    try {
      final balance = await _apiService.getTokensBalance(userId: userId);
      if (!mounted) return;
      setState(() => _tokenBalance = balance);

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
    } catch (_) {
      final fallback = _authController.currentUser.value?.tokenBalance ?? 0;
      if (mounted) {
        setState(() => _tokenBalance = fallback.toInt());
      }
    }
  }

  Future<void> _startRecharge({
    required String tokenPack,
    required String priceLabel,
  }) async {
    final userId = _authController.currentUser.value?.userId;
    if (userId == null || userId.isEmpty) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('not_authenticated'.tr)));
      return;
    }

    final amount = double.tryParse(priceLabel.replaceAll(' DT', ''));
    if (amount == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('invalid_amount'.tr)));
      return;
    }

    setState(() => _loadingPack = tokenPack);

    try {
      final paymentUrl = await _apiService.createRecharge(
        userId: userId,
        amount: amount,
      );

      final uri = Uri.parse(paymentUrl);
      final launched = await launchUrl(
        uri,
        mode: LaunchMode.externalApplication,
      );

      if (!launched && mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('unable_open_paymee'.tr)));
      }
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('payment_failed'.trParams({'error': error.toString()})),
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _loadingPack = '');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.colorL, // Utilisation de ta couleur de fond
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Text(
          'recharge_title'.tr,
          style: GoogleFonts.poppins(
            color: AppColors.colorD,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios, color: AppColors.colorA),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildCurrentBalance(),
              const SizedBox(height: 30),
              Text(
                'choose_pack'.tr,
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.colorD,
                ),
              ),
              const SizedBox(height: 20),
              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 2,
                crossAxisSpacing: 15,
                mainAxisSpacing: 15,
                childAspectRatio: 1.1,
                children: [
                  _buildTokenPack(context, "20", "2 DT"),
                  _buildTokenPack(context, "50", "4.5 DT"),
                  _buildTokenPack(context, "80", "7 DT"),
                  _buildTokenPack(context, "120", "10.5 DT"),
                  _buildTokenPack(context, "200", "18 DT"),
                  _buildTokenPack(context, "300", "27 DT"),
                ],
              ),
              const SizedBox(height: 40),
              Container(
                padding: const EdgeInsets.all(15),
                decoration: BoxDecoration(
                  color: AppColors.colorA.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Text(
                  'tokens_info'.tr,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(
                    fontSize: 13,
                    color: AppColors.colorA,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCurrentBalance() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.colorA,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppColors.colorA.withOpacity(0.3),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Text(
            'current_balance'.tr,
            style: GoogleFonts.poppins(color: Colors.white70, fontSize: 14),
          ),
          const SizedBox(height: 5),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset("assets/token.png", height: 28), // Icône token
              const SizedBox(width: 10),
              Text(
                "$_tokenBalance",
                style: GoogleFonts.poppins(
                  color: Colors.white,
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTokenPack(BuildContext context, String count, String price) {
    final isLoading = _loadingPack == count;

    return GestureDetector(
      onTap: isLoading
          ? null
          : () => _startRecharge(tokenPack: count, priceLabel: price),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (isLoading)
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: AppColors.colorA,
                  ),
                ),
              ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Image.asset("assets/token.png", height: 22),
                const SizedBox(width: 8),
                Text(
                  count,
                  style: GoogleFonts.poppins(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: AppColors.colorD,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 5),
            Text(
              "Tokens",
              style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey),
            ),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 5),
              decoration: BoxDecoration(
                color: AppColors.colorA.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                price,
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.colorA,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
