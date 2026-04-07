import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/schedule.dart';
import '../models/schedule_slot.dart';

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:3000';

  Future<Map<String, String>> _getAuthHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    final headers = {'Content-Type': 'application/json'};
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  Future<List<Schedule>> fetchSchedules({DateTime? date}) async {
    final target = date ?? DateTime.now();
    final dateStr =
        '${target.year}-${target.month.toString().padLeft(2, '0')}-${target.day.toString().padLeft(2, '0')}';
    final uri = Uri.parse('$baseUrl/schedules/all?date=$dateStr');
    try {
      final response = await http.get(uri);
      print('Status: ${response.statusCode}');
      print('Body: ${response.body}');

      if (response.statusCode == 200) {
        final decoded = json.decode(response.body);
        List data = decoded['data'] ?? [];
        return data.map((item) => Schedule.fromJson(item)).toList();
      } else {
        throw Exception(
          'Server error ${response.statusCode}: ${response.body}',
        );
      }
    } catch (e) {
      print('fetchSchedules error: $e');
      rethrow;
    }
  }

  Future<List<ScheduleSlot>> fetchSlotsByRoute(String routeId) async {
    final uri = Uri.parse('$baseUrl/schedules/route/$routeId');
    try {
      final response = await http.get(uri);
      if (response.statusCode == 200) {
        final decoded = json.decode(response.body);
        List data = decoded['data'] ?? [];
        return data.map((item) => ScheduleSlot.fromJson(item)).toList();
      } else {
        throw Exception('Server error ${response.statusCode}');
      }
    } catch (e) {
      print('fetchSlotsByRoute error: $e');
      rethrow;
    }
  }

  Future<bool> verifyTokensNumber({
    required String userId,
    required int amount,
  }) async {
    final uri = Uri.parse('$baseUrl/token/verifynumberoftokens');
    final headers = await _getAuthHeaders();

    final response = await http.post(
      uri,
      headers: headers,
      body: jsonEncode({'user_id': userId, 'amount': amount}),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to verify tokens: ${response.body}');
    }

    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    return decoded['tokensData'] == true;
  }

  Future<int> getTokensBalance({required String userId}) async {
    final uri = Uri.parse('$baseUrl/token/gettokenbalance');
    final headers = await _getAuthHeaders();

    final response = await http.post(
      uri,
      headers: headers,
      body: jsonEncode({'user_id': userId}),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to get token balance: ${response.body}');
    }

    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    final balance = decoded['tokenBalence'];
    return (balance is num) ? balance.toInt() : 0;
  }

  Future<void> redeemTokensFromUser({
    required String userId,
    required int amount,
  }) async {
    final uri = Uri.parse('$baseUrl/users/redeemtokensfromuser');
    final headers = await _getAuthHeaders();

    final response = await http.post(
      uri,
      headers: headers,
      body: jsonEncode({'user_id': userId, 'amount': amount}),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to redeem tokens: ${response.body}');
    }
  }

  Future<String> createTicket({
    required String userId,
    required String scheduleId,
    required int price,
  }) async {
    final uri = Uri.parse('$baseUrl/ticket/createticket');
    final headers = await _getAuthHeaders();

    final response = await http.post(
      uri,
      headers: headers,
      body: jsonEncode({
        'user_id': userId,
        'schedule_id': scheduleId,
        'price': price,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to create ticket: ${response.body}');
    }

    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    final ticketData = decoded['ticketData'];
    return ticketData?.toString() ?? '';
  }

  Future<String> createRecharge({
    required String userId,
    required double amount,
  }) async {
    final uri = Uri.parse('$baseUrl/api/payments/recharge');
    final headers = await _getAuthHeaders();

    final response = await http.post(
      uri,
      headers: headers,
      body: jsonEncode({'user_id': userId, 'amount': amount}),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to initiate recharge: ${response.body}');
    }

    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    final paymentUrl = decoded['payment_url'];
    if (paymentUrl == null || paymentUrl.toString().isEmpty) {
      throw Exception('Paymee payment URL not found in response');
    }

    return paymentUrl.toString();
  }
}
