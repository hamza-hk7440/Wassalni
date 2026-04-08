import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:app/core/theme/colors_R.dart';
import '../../home_screen_controller.dart';
import 'BusSchedule_screen.dart';
import 'TrainSchedule_screen.dart';
import 'recharge_screen.dart';
import 'profile_screen.dart';
import 'my_tickets_screen.dart';
import 'refund_requests_screen.dart';
import 'direction_choice.dart';
import '../auth_controller.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  late final HomeScreenController _homeController;
  late final AuthController _authController;

  @override
  void initState() {
    super.initState();
    _authController = Get.find<AuthController>();
    _homeController = Get.isRegistered<HomeScreenController>()
        ? Get.find<HomeScreenController>()
        : Get.put(HomeScreenController());
  }

  @override
  void dispose() {
    if (Get.isRegistered<HomeScreenController>()) {
      Get.delete<HomeScreenController>();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    double squareSize = MediaQuery.of(context).size.width - 90;
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: AppColors.colorL,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leadingWidth: 250,
        leading: Padding(
          padding: const EdgeInsets.only(left: 20),
          child: Row(
            children: [
              Text(
                "WASALNI",
                style: GoogleFonts.poppins(
                  color: AppColors.colorA,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
              const SizedBox(width: 15),
              Row(
                children: [
                  Image.asset("assets/token.png", height: 16),
                  const SizedBox(width: 5),
                  Obx(
                    () => Text(
                      "${_homeController.tokenBalance.value}",
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.colorD,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.refresh, color: AppColors.colorA),
            onPressed: () => _homeController.loadHomeInfo(),
          ),
          IconButton(
            icon: Icon(Icons.menu, color: AppColors.colorD),
            onPressed: () => _scaffoldKey.currentState!.openEndDrawer(),
          ),
        ],
      ),
      endDrawer: _buildUserDrawer(),
      body: Center(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildTransportButton(
                  title: "Bus",
                  subtitle: "Check Bus schedule and book your seat easily",
                  assetPath: "assets/bus.png",
                  size: squareSize,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const BusSchedulePage(),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 30),
                _buildTransportButton(
                  title: "Train",
                  subtitle: "View Train schedules and buy your digital ticket",
                  assetPath: "assets/trainnn.png",
                  size: squareSize,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const DirectionChoice(),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),

      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) {
          setState(() => _selectedIndex = index);
          if (index == 1) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => MyTicketsPage()),
            );
          } else if (index == 2) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const ProfilePage()),
            );
          }
        },
        backgroundColor: Colors.white,
        selectedItemColor: AppColors.colorA,
        unselectedItemColor: Colors.grey,
        type: BottomNavigationBarType.fixed,
        items: [
          BottomNavigationBarItem(
            icon: Image.asset("assets/home.png", height: 22),
            label: "Home",
          ),
          BottomNavigationBarItem(
            icon: Image.asset("assets/tickett.png", height: 22),
            label: "My Tickets",
          ),
          BottomNavigationBarItem(
            icon: Image.asset("assets/profile.png", height: 22),
            label: "Profile",
          ),
        ],
      ),
    );
  }

  Widget _buildTransportButton({
    required String title,
    required String subtitle,
    required String assetPath,
    required double size,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(25),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(assetPath, height: 80),
            const SizedBox(height: 20),
            Text(
              title,
              style: GoogleFonts.poppins(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: AppColors.colorD,
              ),
            ),
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                subtitle,
                textAlign: TextAlign.center,
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  color: Colors.black.withOpacity(0.8),
                  fontWeight: FontWeight.w400,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUserDrawer() {
    return Drawer(
      backgroundColor: Colors.white,
      child: Column(
        children: [
          DrawerHeader(
            decoration: BoxDecoration(
              color: AppColors.colorA.withOpacity(0.05),
            ),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 30,
                  backgroundImage: AssetImage("assets/profile.png"),
                ),
                const SizedBox(width: 15),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Welcome,",
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        color: Colors.grey,
                      ),
                    ),
                    Obx(
                      () => Text(
                        _homeController.displayName.value,
                        style: GoogleFonts.poppins(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Obx(
                      () => Text(
                        "${_homeController.tokenBalance.value} tokens",
                        style: GoogleFonts.poppins(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          _drawerTile(
            Icons.person_outline,
            "Profile",
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const ProfilePage()),
              );
            },
          ),
          _drawerTile(
            Icons.account_balance_wallet_outlined,
            "Recharge Tokens",
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const RechargePage()),
              );
            },
          ),
          _drawerTile(
            Icons.history,
            "My Tickets",
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => MyTicketsPage()),
              );
            },
          ),
          _drawerTile(
            Icons.request_page_outlined,
            "Refund Requests",
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const RefundRequestsPage(),
                ),
              );
            },
          ),
          const Spacer(),
          const Divider(),
          _drawerTile(
            Icons.logout,
            "Logout",
            isExit: true,
            onTap: () {
              Navigator.of(context).pop();
              _authController.logout();
            },
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _drawerTile(
    IconData icon,
    String title, {
    bool isExit = false,
    VoidCallback? onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: isExit ? Colors.red : AppColors.colorA),
      title: Text(
        title,
        style: GoogleFonts.poppins(
          color: isExit ? Colors.red : AppColors.colorD,
        ),
      ),
      onTap: onTap,
    );
  }

  Widget _buildMainBanner() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      height: 180,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(25),
        image: const DecorationImage(
          image: AssetImage("assets/banner_image.jpeg"),
          fit: BoxFit.cover,
        ),
      ),
    );
  }
}
