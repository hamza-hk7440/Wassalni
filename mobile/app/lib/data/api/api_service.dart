import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/schedule.dart';
import '../models/schedule_slot.dart';

class ApiService {
  static const String baseUrl = 'http://192.168.1.8:3000';

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

  Future<List<Map<String, dynamic>>> fetchRouteStations(String routeId) async {
    final uri = Uri.parse('$baseUrl/routes/$routeId');
    try {
      final response = await http.get(uri);
      if (response.statusCode != 200) {
        throw Exception(
          'Server error ${response.statusCode}: ${response.body}',
        );
      }

      final decoded = json.decode(response.body) as Map<String, dynamic>;
      final route = decoded['route'];
      if (route is! Map<String, dynamic>) {
        return const [];
      }

      final stops = route['route_stations'];
      if (stops is! List) {
        return const [];
      }

      final mapped = stops
          .whereType<Map>()
          .map((item) => item.map((k, v) => MapEntry(k.toString(), v)))
          .toList();

      mapped.sort((a, b) {
        final aOrder = (a['sequence_order'] is num)
            ? (a['sequence_order'] as num).toInt()
            : int.tryParse(a['sequence_order']?.toString() ?? '') ?? 0;
        final bOrder = (b['sequence_order'] is num)
            ? (b['sequence_order'] as num).toInt()
            : int.tryParse(b['sequence_order']?.toString() ?? '') ?? 0;
        return aOrder.compareTo(bOrder);
      });

      return mapped;
    } catch (e) {
      print('fetchRouteStations error: $e');
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
    String? boardingStationId,
    String? alightingStationId,
  }) async {
    final uri = Uri.parse('$baseUrl/ticket/createticket');
    final headers = await _getAuthHeaders();

    final requestBody = {
      'user_id': userId,
      'schedule_id': scheduleId,
      'price': price,
      if (boardingStationId != null && alightingStationId != null) ...{
        'boarding_station_id': boardingStationId,
        'alighting_station_id': alightingStationId,
      },
    };

    final response = await http.post(
      uri,
      headers: headers,
      body: jsonEncode(requestBody),
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

  Future<List<Map<String, dynamic>>> fetchMyActiveTickets() async {
    final uri = Uri.parse('$baseUrl/ticket/mytickets/active');
    final headers = await _getAuthHeaders();

    final response = await http.get(uri, headers: headers);
    if (response.statusCode != 200) {
      throw Exception('Failed to fetch active tickets: ${response.body}');
    }

    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    final tickets = decoded['tickets'];
    if (tickets is List) {
      return tickets
          .whereType<Map>()
          .map((item) => item.map((k, v) => MapEntry(k.toString(), v)))
          .toList();
    }
    return const [];
  }

  Future<List<Map<String, dynamic>>> fetchMyTicketHistory() async {
    final uri = Uri.parse('$baseUrl/ticket/mytickets/history');
    final headers = await _getAuthHeaders();

    final response = await http.get(uri, headers: headers);
    if (response.statusCode != 200) {
      throw Exception('Failed to fetch ticket history: ${response.body}');
    }

    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    final tickets = decoded['tickets'];
    if (tickets is List) {
      return tickets
          .whereType<Map>()
          .map((item) => item.map((k, v) => MapEntry(k.toString(), v)))
          .toList();
    }
    return const [];
  }

  Future<String> getQrDataByTicketId({required String ticketId}) async {
    final uri = Uri.parse('$baseUrl/ticket/getqrdatabyticketid');
    final headers = await _getAuthHeaders();

    final response = await http.post(
      uri,
      headers: headers,
      body: jsonEncode({'ticket_id': ticketId}),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to fetch qr data: ${response.body}');
    }

    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    return decoded['qrData']?.toString() ?? '';
  }

  Future<Map<String, dynamic>> getTicketStatusByIdSuffix({
    required String ticketSuffix,
  }) async {
    final uri = Uri.parse('$baseUrl/ticket/getticketstatusbyidsuffix');
    final headers = await _getAuthHeaders();

    final response = await http.post(
      uri,
      headers: headers,
      body: jsonEncode({'ticket_suffix': ticketSuffix}),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to verify ticket: ${response.body}');
    }

    return (jsonDecode(response.body) as Map<String, dynamic>);
  }

  Future<Map<String, dynamic>> getTicketDetailsByInput({
    required String ticketInput,
  }) async {
    final uri = Uri.parse('$baseUrl/ticket/getticketdetailsbyinput');
    final headers = await _getAuthHeaders();

    final response = await http.post(
      uri,
      headers: headers,
      body: jsonEncode({'ticket_input': ticketInput}),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to fetch ticket details: ${response.body}');
    }

    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> markTicketAsUsed({
    required String ticketId,
  }) async {
    final uri = Uri.parse('$baseUrl/ticket/markticketasused');
    final headers = await _getAuthHeaders();

    final response = await http.post(
      uri,
      headers: headers,
      body: jsonEncode({'ticket_id': ticketId}),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to mark ticket as used: ${response.body}');
    }

    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Future<void> requestTicketRefund({required String ticketId}) async {
    final uri = Uri.parse('$baseUrl/ticket/requestrefund');
    final headers = await _getAuthHeaders();

    final response = await http.post(
      uri,
      headers: headers,
      body: jsonEncode({'ticket_id': ticketId}),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to request refund: ${response.body}');
    }
  }

  Future<List<Map<String, dynamic>>> fetchRefundRequests() async {
    final uri = Uri.parse('$baseUrl/ticket/refundrequests');
    final headers = await _getAuthHeaders();

    final response = await http.get(uri, headers: headers);
    if (response.statusCode != 200) {
      throw Exception('Failed to fetch refund requests: ${response.body}');
    }

    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    final requests = decoded['refund_requests'];
    if (requests is List) {
      return requests
          .whereType<Map>()
          .map((item) => item.map((k, v) => MapEntry(k.toString(), v)))
          .toList();
    }
    return const [];
  }
}
