import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/schedule.dart';
import '../models/schedule_slot.dart';

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:3000';

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
}
