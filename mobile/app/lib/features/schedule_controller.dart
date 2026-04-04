import 'package:flutter/material.dart';
import '../data/api/api_service.dart';
import '../data/models/schedule.dart';

class ScheduleController extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  List<Schedule> schedules = [];
  bool isLoading = false;
  String errorMessage = "";
  DateTime selectedDay = DateTime.now();
  bool _disposed = false;

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }

  void _safeNotify() {
    if (!_disposed) notifyListeners();
  }

  Future<void> loadSchedules({DateTime? day, int retries = 3}) async {
    isLoading = true;
    errorMessage = "";
    _safeNotify();
    try {
      final target = day ?? selectedDay;

      List<Schedule> result = [];
      for (int attempt = 1; attempt <= retries; attempt++) {
        result = await _apiService.fetchSchedules(date: target);
        if (result.isNotEmpty) break;

        if (attempt < retries) {
          print('⚠️ Empty result, retrying... ($attempt/$retries)');
          await Future.delayed(const Duration(seconds: 1));
        }
      }

      schedules = result;
    } catch (e) {
      errorMessage = e.toString();
    } finally {
      isLoading = false;
      _safeNotify();
    }
  }

  void selectDay(DateTime day) {
    selectedDay = day;
    loadSchedules(day: day);
  }
}
