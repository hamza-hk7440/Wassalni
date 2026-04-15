import 'package:app/data/api/api_client.dart';

class AdminDashboardData {
  final int totalUsers;
  final int totalTransactions;
  final int activeBuses;
  final double totalRevenue;
  final int routeCount;
  final int stationCount;
  final int transportCount;
  final int todayScheduleCount;
  final List<Map<String, dynamic>> users;
  final List<Map<String, dynamic>> transactions;
  final List<Map<String, dynamic>> tickets;
  final List<Map<String, dynamic>> routes;
  final List<Map<String, dynamic>> stations;
  final List<Map<String, dynamic>> transports;
  final List<Map<String, dynamic>> schedules;

  const AdminDashboardData({
    required this.totalUsers,
    required this.totalTransactions,
    required this.activeBuses,
    required this.totalRevenue,
    required this.routeCount,
    required this.stationCount,
    required this.transportCount,
    required this.todayScheduleCount,
    required this.users,
    required this.transactions,
    required this.tickets,
    required this.routes,
    required this.stations,
    required this.transports,
    required this.schedules,
  });
}

class AdminDashboardService {
  final ApiClient _apiClient = ApiClient();

  Future<AdminDashboardData> loadDashboardData() async {
    final today = DateTime.now();
    final dateStr =
        '${today.year}-${today.month.toString().padLeft(2, '0')}-${today.day.toString().padLeft(2, '0')}';

    final statsResult = await _safeGet('admin/dashboard');
    final usersResult = await _safeGet('admin/users');
    final transactionsResult = await _safeGet('admin/transactions');
    final ticketsResult = await _safeGet('admin/tickets');
    final routesResult = await _safeGet('routes');
    final stationsResult = await _safeGet('stations');
    final transportsResult = await _safeGet('transports');
    final schedulesResult = await _safeGet(
      'schedules/all',
      queryParameters: {'date': dateStr},
    );

    final stats = _asMap(statsResult);
    final users = _extractList(usersResult, keys: const ['users', 'data']);
    final transactions = _extractList(
      transactionsResult,
      keys: const ['transactions', 'data'],
    );
    final tickets = _extractList(
      ticketsResult,
      keys: const ['tickets', 'data'],
    );
    final routes = _extractList(routesResult, keys: const ['routes', 'data']);
    final stations = _extractList(
      stationsResult,
      keys: const ['stations', 'data'],
    );
    final transports = _extractList(
      transportsResult,
      keys: const ['transports', 'data'],
    );
    final schedules = _extractList(
      schedulesResult,
      keys: const ['data', 'schedules'],
    );

    return AdminDashboardData(
      totalUsers: _toInt(stats['total_users']) ?? users.length,
      totalTransactions:
          _toInt(stats['total_transactions']) ?? transactions.length,
      activeBuses: _toInt(stats['activeBuses']) ?? transports.length,
      totalRevenue: _toDouble(stats['total_revenue']) ?? 0,
      routeCount: routes.length,
      stationCount: stations.length,
      transportCount: transports.length,
      todayScheduleCount: schedules.length,
      users: users,
      transactions: transactions,
      tickets: tickets,
      routes: routes,
      stations: stations,
      transports: transports,
      schedules: schedules,
    );
  }

  Future<Map<String, dynamic>> createController({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
  }) async {
    try {
      final response = await _apiClient.post(
        'admin/createcontroller',
        body: {
          'email': email,
          'password': password,
          'first_name': firstName,
          'last_name': lastName,
        },
      );
      final responseMap = _asMap(response);
      return {
        ...responseMap,
        'generated_code': _extractGeneratedCode(responseMap),
      };
    } catch (_) {
      final fallbackResponse = await _apiClient.post(
        'users/createuser',
        body: {
          'email': email,
          'password': password,
          'first_name': firstName,
          'last_name': lastName,
          'role': 'controller',
        },
      );
      final fallbackMap = _asMap(fallbackResponse);
      return {
        ...fallbackMap,
        'generated_code': _extractGeneratedCode(fallbackMap),
      };
    }
  }

  Future<Map<String, dynamic>> createAdmin({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
  }) async {
    final response = await _apiClient.post(
      'users/createuser',
      body: {
        'email': email,
        'password': password,
        'first_name': firstName,
        'last_name': lastName,
        'role': 'admin',
      },
    );

    final responseMap = _asMap(response);
    return {
      ...responseMap,
      'generated_code': _extractGeneratedCode(responseMap),
    };
  }

  Future<void> deleteUser(String userId) async {
    await _apiClient.delete('admin/users/$userId');
  }

  Future<void> createDelayAnnouncement({
    required String scheduleId,
    required int delayMinutes,
    String? message,
  }) async {
    await _apiClient.post(
      'ticket/admin/announcement/delay',
      body: {
        'schedule_id': scheduleId,
        'delay_minutes': delayMinutes,
        'message': message ?? '',
      },
    );
  }

  Future<void> createCancellationAnnouncement({
    required String scheduleId,
    String? message,
  }) async {
    await _apiClient.post(
      'ticket/admin/announcement/cancellation',
      body: {'schedule_id': scheduleId, 'message': message ?? ''},
    );
  }

  List<Map<String, dynamic>> _extractList(
    dynamic response, {
    List<String> keys = const ['data'],
  }) {
    if (response is List) {
      return response
          .whereType<Map>()
          .map((item) => item.map((k, v) => MapEntry(k.toString(), v)))
          .toList();
    }

    final map = _asMap(response);
    for (final key in keys) {
      final value = map[key];
      if (value is List) {
        return value
            .whereType<Map>()
            .map((item) => item.map((k, v) => MapEntry(k.toString(), v)))
            .toList();
      }
    }

    return const [];
  }

  Map<String, dynamic> _asMap(dynamic response) {
    if (response is Map<String, dynamic>) {
      return response;
    }

    if (response is Map) {
      return response.map((key, value) => MapEntry(key.toString(), value));
    }

    return <String, dynamic>{};
  }

  int? _toInt(dynamic value) {
    if (value == null) return null;
    if (value is int) return value;
    if (value is num) return value.toInt();
    return int.tryParse(value.toString());
  }

  double? _toDouble(dynamic value) {
    if (value == null) return null;
    if (value is double) return value;
    if (value is num) return value.toDouble();
    return double.tryParse(value.toString());
  }

  Future<dynamic> _safeGet(
    String endpoint, {
    Map<String, String>? queryParameters,
  }) async {
    try {
      return await _apiClient.get(endpoint, queryParameters: queryParameters);
    } catch (_) {
      return const <String, dynamic>{};
    }
  }

  String? _extractGeneratedCode(Map<String, dynamic> response) {
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
}
