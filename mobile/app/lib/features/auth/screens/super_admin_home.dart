import 'package:app/core/theme/colors_R.dart';
import 'package:app/data/api/admin_dashboard_service.dart';
import 'package:app/features/auth/auth_controller.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

class SuperAdminHome extends StatefulWidget {
  const SuperAdminHome({super.key});

  @override
  State<SuperAdminHome> createState() => _SuperAdminHomeState();
}

class _SuperAdminHomeState extends State<SuperAdminHome> {
  final AdminDashboardService _service = AdminDashboardService();
  final AuthController _authController = Get.find<AuthController>();
  late Future<AdminDashboardData> _future;

  @override
  void initState() {
    super.initState();
    _future = _service.loadDashboardData();
  }

  Future<void> _refresh() async {
    setState(() {
      _future = _service.loadDashboardData();
    });
    await _future;
  }

  Future<void> _withLoading(Future<void> Function() action) async {
    try {
      await action();
      await _refresh();
    } catch (e) {
      if (!mounted) return;
      Get.snackbar(
        'Action failed',
        e.toString(),
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red.shade50,
        colorText: Colors.red.shade900,
        margin: const EdgeInsets.all(16),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = _authController.currentUser.value;
    final adminName = (user?.fullName.trim().isNotEmpty ?? false)
        ? user!.fullName
        : 'Super Admin';

    return Scaffold(
      backgroundColor: AppColors.colorL,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Text(
          'SUPER ADMIN DASHBOARD',
          style: GoogleFonts.poppins(
            color: AppColors.colorD,
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: Colors.grey),
            onPressed: _refresh,
            tooltip: 'Refresh',
          ),
          IconButton(
            icon: const Icon(Icons.notifications_none, color: Colors.grey),
            onPressed: () {
              Get.snackbar(
                'Notifications',
                'No new notifications',
                snackPosition: SnackPosition.BOTTOM,
                backgroundColor: Colors.white,
              );
            },
          ),
          const SizedBox(width: 6),
        ],
      ),
      body: FutureBuilder<AdminDashboardData>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(
              child: CircularProgressIndicator(color: AppColors.colorA),
            );
          }

          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Text(
                  snapshot.error.toString(),
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(color: Colors.redAccent),
                ),
              ),
            );
          }

          final data = snapshot.data;
          if (data == null) {
            return const SizedBox.shrink();
          }

          return RefreshIndicator(
            onRefresh: _refresh,
            child: ListView(
              padding: const EdgeInsets.all(18),
              children: [
                _buildHeaderCard(adminName, data),
                const SizedBox(height: 18),
                _sectionTitle('Core Overview'),
                const SizedBox(height: 12),
                _buildMetricGrid(context, [
                  _MetricCard(
                    title: 'Revenue',
                    value: _formatMoney(data.totalRevenue),
                    subtitle: 'Completed payments',
                    icon: Icons.payments_rounded,
                    color: Colors.green,
                  ),
                  _MetricCard(
                    title: 'Transactions',
                    value: data.totalTransactions.toString(),
                    subtitle: 'All transaction records',
                    icon: Icons.swap_horiz_rounded,
                    color: Colors.orange,
                  ),
                  _MetricCard(
                    title: 'Users',
                    value: data.totalUsers.toString(),
                    subtitle: 'Passenger + staff accounts',
                    icon: Icons.people_alt_rounded,
                    color: AppColors.colorA,
                  ),
                  _MetricCard(
                    title: 'Fleet',
                    value: data.activeBuses.toString(),
                    subtitle: 'Active transport units',
                    icon: Icons.directions_bus_rounded,
                    color: Colors.blueAccent,
                  ),
                ]),
                const SizedBox(height: 18),
                _sectionTitle('Operations'),
                const SizedBox(height: 12),
                _buildMetricGrid(context, [
                  _MetricCard(
                    title: 'Routes',
                    value: data.routeCount.toString(),
                    subtitle: 'Published lines',
                    icon: Icons.alt_route_rounded,
                    color: Colors.purple,
                    onTap: () => _showEntityDetailsBottomSheet(
                      title: 'Routes',
                      items: data.routes,
                      idKey: 'route_id',
                      keyLabels: const {
                        'name': 'Name',
                        'start_station.name': 'Start station',
                        'end_station.name': 'End station',
                      },
                    ),
                  ),
                  _MetricCard(
                    title: 'Stations',
                    value: data.stationCount.toString(),
                    subtitle: 'Station records',
                    icon: Icons.location_on_rounded,
                    color: Colors.teal,
                    onTap: () => _showEntityDetailsBottomSheet(
                      title: 'Stations',
                      items: data.stations,
                      idKey: 'station_id',
                      keyLabels: const {'name': 'Name', 'location': 'Location'},
                    ),
                  ),
                  _MetricCard(
                    title: 'Transports',
                    value: data.transportCount.toString(),
                    subtitle: 'Vehicles in system',
                    icon: Icons.train_rounded,
                    color: Colors.redAccent,
                    onTap: () => _showEntityDetailsBottomSheet(
                      title: 'Transports',
                      items: data.transports,
                      idKey: 'transport_id',
                      keyLabels: const {
                        'type': 'Type',
                        'license_plate': 'License plate',
                        'status': 'Status',
                        'capacity': 'Capacity',
                      },
                    ),
                  ),
                  _MetricCard(
                    title: 'Today Schedules',
                    value: data.todayScheduleCount.toString(),
                    subtitle: 'Scheduled runs today',
                    icon: Icons.schedule_rounded,
                    color: Colors.indigo,
                    onTap: () => _showEntityDetailsBottomSheet(
                      title: 'Schedules',
                      items: data.schedules,
                      idKey: 'schedule_id',
                      keyLabels: const {
                        'route_id': 'Route ID',
                        'direction': 'Direction',
                        'routes.name': 'Route name',
                        'departure_time': 'Departure',
                        'arrival_time': 'Arrival',
                      },
                    ),
                  ),
                ]),
                const SizedBox(height: 18),
                _sectionTitle('Quick Actions'),
                const SizedBox(height: 12),
                _buildActionGrid(context, [
                  _ActionCard(
                    title: 'Create admin',
                    subtitle: 'Add a new admin account',
                    icon: Icons.admin_panel_settings_rounded,
                    color: Colors.indigo,
                    onTap: () => _showCreateAdminDialog(context),
                  ),
                  _ActionCard(
                    title: 'Create controller',
                    subtitle: 'Add a new controller account',
                    icon: Icons.person_add_alt_1_rounded,
                    color: AppColors.colorA,
                    onTap: () => _showCreateControllerDialog(context),
                  ),
                  _ActionCard(
                    title: 'Delay alert',
                    subtitle: 'Publish a delay announcement',
                    icon: Icons.timer_rounded,
                    color: Colors.orange,
                    onTap: () => _showDelayDialog(context),
                  ),
                  _ActionCard(
                    title: 'Cancellation alert',
                    subtitle: 'Publish a cancellation announcement',
                    icon: Icons.cancel_schedule_send_rounded,
                    color: Colors.redAccent,
                    onTap: () => _showCancellationDialog(context),
                  ),
                  _ActionCard(
                    title: 'Refresh data',
                    subtitle: 'Reload every section',
                    icon: Icons.refresh_rounded,
                    color: Colors.green,
                    onTap: _refresh,
                  ),
                ]),
                const SizedBox(height: 18),
                _sectionHeader(
                  title: 'Recent Users',
                  subtitle: 'Latest accounts',
                ),
                const SizedBox(height: 10),
                _buildCompactList(
                  data.users,
                  emptyText: 'No users available',
                  itemBuilder: _buildUserTile,
                  maxItems: 5,
                ),
                const SizedBox(height: 18),
                _sectionHeader(
                  title: 'Recent Transactions',
                  subtitle: 'Latest payment records',
                ),
                const SizedBox(height: 10),
                _buildCompactList(
                  data.transactions,
                  emptyText: 'No transactions available',
                  itemBuilder: _buildTransactionTile,
                  maxItems: 5,
                ),
                const SizedBox(height: 18),
                _sectionHeader(
                  title: 'Recent Tickets',
                  subtitle: 'Latest ticket records',
                ),
                const SizedBox(height: 10),
                _buildCompactList(
                  data.tickets,
                  emptyText: 'No tickets available',
                  itemBuilder: _buildTicketTile,
                  maxItems: 5,
                ),
                const SizedBox(height: 24),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildHeaderCard(String adminName, AdminDashboardData data) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.colorA, AppColors.colorD],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: AppColors.colorA.withOpacity(0.18),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.16),
              borderRadius: BorderRadius.circular(18),
            ),
            child: const Icon(
              Icons.admin_panel_settings_rounded,
              color: Colors.white,
              size: 30,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Welcome back, $adminName',
                  style: GoogleFonts.poppins(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Manage users, fleet, tickets and announcements from one place.',
                  style: GoogleFonts.poppins(
                    color: Colors.white.withOpacity(0.88),
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    _smallChip('Revenue ${_formatMoney(data.totalRevenue)}'),
                    _smallChip('${data.totalUsers} users'),
                    _smallChip('${data.routeCount} routes'),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _smallChip(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.16),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: Colors.white.withOpacity(0.16)),
      ),
      child: Text(
        text,
        style: GoogleFonts.poppins(
          color: Colors.white,
          fontSize: 11,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _buildMetricGrid(BuildContext context, List<_MetricCard> items) {
    final width = MediaQuery.of(context).size.width;
    final crossAxisCount = width >= 1100
        ? 4
        : width >= 700
        ? 3
        : 2;
    final childAspectRatio = width >= 1100
        ? 1.45
        : width >= 700
        ? 1.25
        : 0.90;

    return GridView.count(
      crossAxisCount: crossAxisCount,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: childAspectRatio,
      children: items.map(_buildMetricCard).toList(),
    );
  }

  Widget _buildMetricCard(_MetricCard item) {
    final card = Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: item.color.withOpacity(0.12)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircleAvatar(
            radius: 18,
            backgroundColor: item.color.withOpacity(0.12),
            child: Icon(item.icon, color: item.color, size: 20),
          ),
          const SizedBox(height: 14),
          Text(
            item.value,
            style: GoogleFonts.poppins(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: AppColors.colorD,
            ),
          ),
          Text(
            item.title,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: GoogleFonts.poppins(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: Colors.grey.shade800,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            item.subtitle,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: GoogleFonts.poppins(
              fontSize: 11,
              color: Colors.grey.shade600,
            ),
          ),
          if (item.onTap != null) ...[
            const SizedBox(height: 8),
            Text(
              'Tap for details',
              style: GoogleFonts.poppins(
                fontSize: 10,
                color: item.color,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ],
      ),
    );

    if (item.onTap == null) {
      return card;
    }

    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(20),
        onTap: item.onTap,
        child: card,
      ),
    );
  }

  Widget _buildActionGrid(BuildContext context, List<_ActionCard> items) {
    final width = MediaQuery.of(context).size.width;
    final crossAxisCount = width >= 1100
        ? 4
        : width >= 700
        ? 2
        : 1;

    return GridView.count(
      crossAxisCount: crossAxisCount,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 2.6,
      children: items.map(_buildActionCard).toList(),
    );
  }

  Widget _buildActionCard(_ActionCard item) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(20),
      child: InkWell(
        borderRadius: BorderRadius.circular(20),
        onTap: item.onTap,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: item.color.withOpacity(0.1)),
          ),
          child: Row(
            children: [
              CircleAvatar(
                radius: 22,
                backgroundColor: item.color.withOpacity(0.12),
                child: Icon(item.icon, color: item.color, size: 22),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      item.title,
                      style: GoogleFonts.poppins(
                        fontWeight: FontWeight.w600,
                        color: AppColors.colorD,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      item.subtitle,
                      style: GoogleFonts.poppins(
                        fontSize: 11,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
              ),
              Icon(Icons.chevron_right_rounded, color: Colors.grey.shade400),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCompactList(
    List<Map<String, dynamic>> items, {
    required String emptyText,
    required Widget Function(Map<String, dynamic>) itemBuilder,
    int maxItems = 5,
  }) {
    if (items.isEmpty) {
      return _emptyCard(emptyText);
    }

    final limitedItems = items.take(maxItems).toList();
    return Column(
      children: [
        ...limitedItems.map(
          (item) => Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: itemBuilder(item),
          ),
        ),
      ],
    );
  }

  Widget _buildUserTile(Map<String, dynamic> user) {
    final userId =
        user['user_id']?.toString() ?? user['id']?.toString() ?? '--';
    final name = [
      user['first_name']?.toString().trim(),
      user['last_name']?.toString().trim(),
    ].where((part) => part != null && part!.isNotEmpty).join(' ');
    final displayName = name.trim().isNotEmpty ? name : 'Unnamed user';
    final role = user['role']?.toString() ?? 'unknown';
    final email = user['email']?.toString() ?? '--';
    final tokenBalance = user['token_balance']?.toString() ?? '0';

    return _roundedCard(
      child: Row(
        children: [
          CircleAvatar(
            radius: 22,
            backgroundColor: AppColors.colorA.withOpacity(0.12),
            child: Icon(Icons.person_rounded, color: AppColors.colorA),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  displayName,
                  style: GoogleFonts.poppins(
                    fontWeight: FontWeight.w600,
                    color: AppColors.colorD,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  email,
                  style: GoogleFonts.poppins(
                    fontSize: 12,
                    color: Colors.grey.shade600,
                  ),
                ),
                const SizedBox(height: 4),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    _tag(role.toUpperCase(), Colors.blueGrey),
                    _tag('Tokens: $tokenBalance', Colors.green),
                    _tag('ID: ${_shortId(userId)}', Colors.purple),
                  ],
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.delete_outline_rounded, color: Colors.red),
            onPressed: () => _confirmDeleteUser(userId, displayName),
          ),
        ],
      ),
    );
  }

  Widget _buildTransactionTile(Map<String, dynamic> tx) {
    final amount = tx['amount'] ?? tx['value'] ?? '--';
    final status = tx['status']?.toString() ?? 'unknown';
    final timestamp = tx['timestamp'] ?? tx['created_at'] ?? tx['date'];
    final transactionId =
        tx['transaction_id']?.toString() ?? tx['id']?.toString() ?? '--';

    return _roundedCard(
      child: Row(
        children: [
          CircleAvatar(
            radius: 22,
            backgroundColor: Colors.orange.withOpacity(0.12),
            child: Icon(Icons.receipt_long_rounded, color: Colors.orange),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Transaction ${_shortId(transactionId)}',
                  style: GoogleFonts.poppins(
                    fontWeight: FontWeight.w600,
                    color: AppColors.colorD,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Amount: ${_formatMoney(amount)}',
                  style: GoogleFonts.poppins(
                    fontSize: 12,
                    color: Colors.grey.shade600,
                  ),
                ),
                const SizedBox(height: 4),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    _tag(status.toUpperCase(), _statusColor(status)),
                    _tag(_formatDate(timestamp), Colors.blueGrey),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTicketTile(Map<String, dynamic> ticket) {
    final ticketId =
        ticket['ticket_id']?.toString() ?? ticket['id']?.toString() ?? '--';
    final status = ticket['status']?.toString() ?? 'unknown';
    final price = ticket['price'] ?? ticket['amount'] ?? '--';
    final timestamp =
        ticket['purchase_date'] ?? ticket['timestamp'] ?? ticket['created_at'];

    return _roundedCard(
      child: Row(
        children: [
          CircleAvatar(
            radius: 22,
            backgroundColor: Colors.teal.withOpacity(0.12),
            child: Icon(Icons.confirmation_num_rounded, color: Colors.teal),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Ticket ${_shortId(ticketId)}',
                  style: GoogleFonts.poppins(
                    fontWeight: FontWeight.w600,
                    color: AppColors.colorD,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Price: ${_formatMoney(price)}',
                  style: GoogleFonts.poppins(
                    fontSize: 12,
                    color: Colors.grey.shade600,
                  ),
                ),
                const SizedBox(height: 4),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    _tag(status.toUpperCase(), _statusColor(status)),
                    _tag(_formatDate(timestamp), Colors.blueGrey),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _roundedCard({required Widget child}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: child,
    );
  }

  Widget _tag(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        text,
        style: GoogleFonts.poppins(
          fontSize: 10,
          fontWeight: FontWeight.w600,
          color: color,
        ),
      ),
    );
  }

  Widget _emptyCard(String message) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Text(
        message,
        style: GoogleFonts.poppins(color: Colors.grey.shade600),
      ),
    );
  }

  Widget _sectionTitle(String title) {
    return Text(
      title,
      style: GoogleFonts.poppins(
        fontSize: 18,
        fontWeight: FontWeight.w700,
        color: AppColors.colorD,
      ),
    );
  }

  Widget _sectionHeader({required String title, required String subtitle}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: GoogleFonts.poppins(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.colorD,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          subtitle,
          style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey.shade600),
        ),
      ],
    );
  }

  Future<void> _showCreateControllerDialog(BuildContext context) async {
    await _showCreateStaffDialog(
      context,
      title: 'Create controller',
      actionColor: AppColors.colorA,
      onCreate:
          ({
            required String email,
            required String password,
            required String firstName,
            required String lastName,
          }) {
            return _service.createController(
              email: email,
              password: password,
              firstName: firstName,
              lastName: lastName,
            );
          },
      roleLabel: 'Controller',
    );
  }

  Future<void> _showCreateAdminDialog(BuildContext context) async {
    await _showCreateStaffDialog(
      context,
      title: 'Create admin',
      actionColor: Colors.indigo,
      onCreate:
          ({
            required String email,
            required String password,
            required String firstName,
            required String lastName,
          }) {
            return _service.createAdmin(
              email: email,
              password: password,
              firstName: firstName,
              lastName: lastName,
            );
          },
      roleLabel: 'Admin',
    );
  }

  Future<void> _showCreateStaffDialog(
    BuildContext context, {
    required String title,
    required Color actionColor,
    required String roleLabel,
    required Future<Map<String, dynamic>> Function({
      required String email,
      required String password,
      required String firstName,
      required String lastName,
    })
    onCreate,
  }) async {
    final formKey = GlobalKey<FormState>();
    final emailController = TextEditingController();
    final passwordController = TextEditingController();
    final firstNameController = TextEditingController();
    final lastNameController = TextEditingController();
    bool isSaving = false;

    await showDialog<void>(
      context: context,
      builder: (dialogContext) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
              ),
              title: Text(
                title,
                style: GoogleFonts.poppins(fontWeight: FontWeight.w700),
              ),
              content: SingleChildScrollView(
                child: Form(
                  key: formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _dialogField(
                        emailController,
                        'Email',
                        Icons.email_outlined,
                      ),
                      const SizedBox(height: 12),
                      _dialogField(
                        firstNameController,
                        'First name',
                        Icons.person_outline,
                      ),
                      const SizedBox(height: 12),
                      _dialogField(
                        lastNameController,
                        'Last name',
                        Icons.person_outline,
                      ),
                      const SizedBox(height: 12),
                      _dialogField(
                        passwordController,
                        'Temporary password',
                        Icons.lock_outline,
                        obscureText: true,
                      ),
                    ],
                  ),
                ),
              ),
              actions: [
                TextButton(
                  onPressed: isSaving
                      ? null
                      : () => Navigator.pop(dialogContext),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: actionColor,
                    foregroundColor: Colors.white,
                  ),
                  onPressed: isSaving
                      ? null
                      : () async {
                          if (!(formKey.currentState?.validate() ?? false)) {
                            return;
                          }
                          setState(() => isSaving = true);
                          try {
                            final response = await onCreate(
                              email: emailController.text.trim(),
                              password: passwordController.text,
                              firstName: firstNameController.text.trim(),
                              lastName: lastNameController.text.trim(),
                            );
                            if (mounted) Navigator.pop(dialogContext);

                            final code = _extractGeneratedCodeFromResponse(
                              response,
                            );
                            if (code != null && code.trim().isNotEmpty) {
                              _showGeneratedCodeDialog(
                                roleLabel: roleLabel,
                                code: code,
                              );
                            } else {
                              Get.snackbar(
                                'Created, but no code returned',
                                '$roleLabel account was created, but backend did not return a code.',
                                snackPosition: SnackPosition.BOTTOM,
                                backgroundColor: Colors.orange.shade50,
                                colorText: Colors.orange.shade900,
                              );
                            }

                            await _refresh();
                          } catch (e) {
                            setState(() => isSaving = false);
                            Get.snackbar(
                              'Error',
                              e.toString(),
                              snackPosition: SnackPosition.BOTTOM,
                              backgroundColor: Colors.red.shade50,
                              colorText: Colors.red.shade900,
                            );
                          }
                        },
                  child: isSaving
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Create'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  void _showGeneratedCodeDialog({
    required String roleLabel,
    required String code,
  }) {
    Get.dialog(
      AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: Text(
          '$roleLabel created',
          style: GoogleFonts.poppins(fontWeight: FontWeight.w700),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Save this $roleLabel code:',
              style: GoogleFonts.poppins(color: Colors.grey.shade700),
            ),
            const SizedBox(height: 10),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey.shade100,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                code,
                style: GoogleFonts.poppins(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: AppColors.colorD,
                ),
              ),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Get.back(),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.colorA,
              foregroundColor: Colors.white,
            ),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  void _showEntityDetailsBottomSheet({
    required String title,
    required List<Map<String, dynamic>> items,
    required String idKey,
    required Map<String, String> keyLabels,
  }) {
    Get.bottomSheet(
      Container(
        constraints: BoxConstraints(maxHeight: Get.height * 0.85),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
            const SizedBox(height: 12),
            Container(
              width: 44,
              height: 5,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(99),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      '$title Details',
                      style: GoogleFonts.poppins(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: AppColors.colorD,
                      ),
                    ),
                  ),
                  Text(
                    '${items.length} items',
                    style: GoogleFonts.poppins(
                      fontSize: 12,
                      color: Colors.grey.shade600,
                    ),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),
            Expanded(
              child: items.isEmpty
                  ? Center(
                      child: Text(
                        'No $title found',
                        style: GoogleFonts.poppins(color: Colors.grey.shade700),
                      ),
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.all(16),
                      itemCount: items.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 10),
                      itemBuilder: (context, index) {
                        final item = items[index];
                        final idValue = _valueByPath(item, idKey) ?? '--';
                        return Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: AppColors.colorL,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: AppColors.colorC),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      'ID: $idValue',
                                      style: GoogleFonts.poppins(
                                        fontWeight: FontWeight.w700,
                                        color: AppColors.colorD,
                                      ),
                                    ),
                                  ),
                                  IconButton(
                                    visualDensity: VisualDensity.compact,
                                    icon: const Icon(
                                      Icons.copy_rounded,
                                      size: 18,
                                    ),
                                    onPressed: idValue == '--'
                                        ? null
                                        : () => _copyText(idValue.toString()),
                                    tooltip: 'Copy ID',
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              ...keyLabels.entries.map((entry) {
                                final value =
                                    _valueByPath(item, entry.key) ?? '--';
                                return Padding(
                                  padding: const EdgeInsets.only(bottom: 4),
                                  child: Text(
                                    '${entry.value}: $value',
                                    style: GoogleFonts.poppins(
                                      fontSize: 12,
                                      color: Colors.grey.shade700,
                                    ),
                                  ),
                                );
                              }),
                            ],
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
      isScrollControlled: true,
    );
  }

  dynamic _valueByPath(Map<String, dynamic> map, String path) {
    dynamic current = map;
    for (final key in path.split('.')) {
      if (current is Map && current.containsKey(key)) {
        current = current[key];
      } else {
        return null;
      }
    }
    return current;
  }

  Future<void> _showDelayDialog(BuildContext context) async {
    await _showAnnouncementDialog(
      context: context,
      title: 'Delay announcement',
      icon: Icons.timer_rounded,
      color: Colors.orange,
      onSubmit: (scheduleId, minutes, message) {
        if (minutes == null) {
          throw Exception('Delay minutes are required');
        }
        return _service.createDelayAnnouncement(
          scheduleId: scheduleId,
          delayMinutes: minutes,
          message: message,
        );
      },
      includeDelayField: true,
    );
  }

  Future<void> _showCancellationDialog(BuildContext context) async {
    await _showAnnouncementDialog(
      context: context,
      title: 'Cancellation announcement',
      icon: Icons.cancel_schedule_send_rounded,
      color: Colors.redAccent,
      onSubmit: (scheduleId, minutes, message) {
        return _service.createCancellationAnnouncement(
          scheduleId: scheduleId,
          message: message,
        );
      },
      includeDelayField: false,
    );
  }

  Future<void> _showAnnouncementDialog({
    required BuildContext context,
    required String title,
    required IconData icon,
    required Color color,
    required Future<void> Function(
      String scheduleId,
      int? minutes,
      String? message,
    )
    onSubmit,
    required bool includeDelayField,
  }) async {
    final formKey = GlobalKey<FormState>();
    final scheduleController = TextEditingController();
    final delayController = TextEditingController();
    final messageController = TextEditingController();
    bool isSaving = false;

    await showDialog<void>(
      context: context,
      builder: (dialogContext) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
              ),
              title: Row(
                children: [
                  CircleAvatar(
                    radius: 16,
                    backgroundColor: color.withOpacity(0.12),
                    child: Icon(icon, color: color, size: 18),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      title,
                      style: GoogleFonts.poppins(fontWeight: FontWeight.w700),
                    ),
                  ),
                ],
              ),
              content: SingleChildScrollView(
                child: Form(
                  key: formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _dialogField(
                        scheduleController,
                        'Schedule ID',
                        Icons.route_rounded,
                        suffixIcon: IconButton(
                          icon: const Icon(Icons.copy_rounded, size: 18),
                          onPressed: () {
                            final text = scheduleController.text.trim();
                            if (text.isEmpty) {
                              Get.snackbar(
                                'Copy failed',
                                'Enter or paste a schedule ID first',
                                snackPosition: SnackPosition.BOTTOM,
                                backgroundColor: Colors.orange.shade50,
                                colorText: Colors.orange.shade900,
                              );
                              return;
                            }
                            _copyText(text);
                          },
                          tooltip: 'Copy schedule ID',
                        ),
                      ),
                      if (includeDelayField) ...[
                        const SizedBox(height: 12),
                        _dialogField(
                          delayController,
                          'Delay minutes',
                          Icons.timelapse_rounded,
                          keyboardType: TextInputType.number,
                        ),
                      ],
                      const SizedBox(height: 12),
                      _dialogField(
                        messageController,
                        'Message (optional)',
                        Icons.message_outlined,
                        maxLines: 3,
                      ),
                    ],
                  ),
                ),
              ),
              actions: [
                TextButton(
                  onPressed: isSaving
                      ? null
                      : () => Navigator.pop(dialogContext),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: color,
                    foregroundColor: Colors.white,
                  ),
                  onPressed: isSaving
                      ? null
                      : () async {
                          if (!(formKey.currentState?.validate() ?? false)) {
                            return;
                          }
                          setState(() => isSaving = true);
                          try {
                            final minutes = includeDelayField
                                ? int.tryParse(delayController.text.trim())
                                : null;
                            await onSubmit(
                              scheduleController.text.trim(),
                              minutes,
                              messageController.text.trim().isEmpty
                                  ? null
                                  : messageController.text.trim(),
                            );
                            if (mounted) Navigator.pop(dialogContext);
                            Get.snackbar(
                              'Success',
                              'Announcement sent successfully',
                              snackPosition: SnackPosition.BOTTOM,
                              backgroundColor: Colors.green.shade50,
                              colorText: Colors.green.shade900,
                            );
                            await _refresh();
                          } catch (e) {
                            setState(() => isSaving = false);
                            Get.snackbar(
                              'Error',
                              e.toString(),
                              snackPosition: SnackPosition.BOTTOM,
                              backgroundColor: Colors.red.shade50,
                              colorText: Colors.red.shade900,
                            );
                          }
                        },
                  child: isSaving
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Send'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Widget _dialogField(
    TextEditingController controller,
    String label,
    IconData icon, {
    bool obscureText = false,
    int maxLines = 1,
    TextInputType keyboardType = TextInputType.text,
    Widget? suffixIcon,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      maxLines: maxLines,
      keyboardType: keyboardType,
      validator: (value) {
        if ((value ?? '').trim().isEmpty && label != 'Message (optional)') {
          return '$label is required';
        }
        return null;
      },
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
      ),
    );
  }

  Future<void> _copyText(String text) async {
    await Clipboard.setData(ClipboardData(text: text));
    if (!mounted) return;
    Get.snackbar(
      'Copied',
      text,
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: Colors.black87,
      colorText: Colors.white,
      duration: const Duration(seconds: 1),
    );
  }

  String? _extractGeneratedCodeFromResponse(Map<String, dynamic> response) {
    return _findGeneratedCodeRecursive(response);
  }

  String? _findGeneratedCodeRecursive(dynamic node) {
    if (node == null) return null;

    if (node is String) {
      final value = node.trim();
      if (value.isNotEmpty &&
          (value.startsWith('CTRL-') ||
              RegExp(r'^\d{4,10}$').hasMatch(value))) {
        return value;
      }
      return null;
    }

    if (node is num) {
      return node.toString();
    }

    if (node is Map) {
      final normalized = node.map((k, v) => MapEntry(k.toString(), v));
      const priorityKeys = [
        'generated_code',
        'controller_code',
        'admin_code',
        'super_admin_code',
        'code',
      ];

      for (final key in priorityKeys) {
        final value = normalized[key];
        if (value is String && value.trim().isNotEmpty) return value.trim();
        if (value is num) return value.toString();
      }

      for (final value in normalized.values) {
        final found = _findGeneratedCodeRecursive(value);
        if (found != null && found.trim().isNotEmpty) {
          return found;
        }
      }
    }

    if (node is List) {
      for (final value in node) {
        final found = _findGeneratedCodeRecursive(value);
        if (found != null && found.trim().isNotEmpty) {
          return found;
        }
      }
    }

    return null;
  }

  Future<void> _confirmDeleteUser(String userId, String displayName) async {
    final confirmed = await Get.dialog<bool>(
      AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: Text(
          'Delete user',
          style: GoogleFonts.poppins(fontWeight: FontWeight.w700),
        ),
        content: Text(
          'Delete $displayName permanently?',
          style: GoogleFonts.poppins(),
        ),
        actions: [
          TextButton(
            onPressed: () => Get.back(result: false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.redAccent,
              foregroundColor: Colors.white,
            ),
            onPressed: () => Get.back(result: true),
            child: const Text('Delete'),
          ),
        ],
      ),
      barrierDismissible: false,
    );

    if (confirmed != true) return;

    await _withLoading(() => _service.deleteUser(userId));
    if (!mounted) return;
    Get.snackbar(
      'Deleted',
      '$displayName has been removed',
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: Colors.green.shade50,
      colorText: Colors.green.shade900,
    );
  }

  String _shortId(String value) {
    final clean = value.trim();
    if (clean.isEmpty) return '--';
    final parts = clean.split('-');
    return parts.isNotEmpty ? parts.last : clean;
  }

  String _formatMoney(dynamic value) {
    if (value == null) return '0 DT';
    final parsed = double.tryParse(value.toString());
    if (parsed == null) return '${value.toString()} DT';
    return '${parsed.toStringAsFixed(parsed % 1 == 0 ? 0 : 2)} DT';
  }

  String _formatDate(dynamic raw) {
    try {
      if (raw == null) return '--';
      final dt = DateTime.parse(raw.toString()).toLocal();
      return '${dt.day.toString().padLeft(2, '0')}/${dt.month.toString().padLeft(2, '0')}/${dt.year}';
    } catch (_) {
      return raw?.toString() ?? '--';
    }
  }

  Color _statusColor(String status) {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
      case 'paid':
        return Colors.green;
      case 'pending':
      case 'processing':
        return Colors.orange;
      case 'cancelled':
      case 'failed':
      case 'rejected':
        return Colors.red;
      default:
        return Colors.blueGrey;
    }
  }
}

class _MetricCard {
  final String title;
  final String value;
  final String subtitle;
  final IconData icon;
  final Color color;
  final VoidCallback? onTap;

  const _MetricCard({
    required this.title,
    required this.value,
    required this.subtitle,
    required this.icon,
    required this.color,
    this.onTap,
  });
}

class _ActionCard {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _ActionCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    required this.onTap,
  });
}
