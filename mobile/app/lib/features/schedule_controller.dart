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

  // schedule_controller.dart

  Future<void> loadSchedules({DateTime? day}) async {
    isLoading = true;
    errorMessage = "";
    _safeNotify();
    try {
      final target = day ?? selectedDay;
      final result = await _apiService.fetchSchedules(date: target);

      
      if (result.isEmpty && day == null) {
        for (int i = 1; i <= 7; i++) {
          final nextDay = target.add(Duration(days: i));
          final fallback = await _apiService.fetchSchedules(date: nextDay);
          if (fallback.isNotEmpty) {
            selectedDay = nextDay; 
            schedules = fallback;
            _safeNotify();
            return;
          }
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
