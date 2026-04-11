import 'package:flutter/material.dart';
import '../data/api/api_service.dart';
import '../data/models/schedule.dart';

class ScheduleController extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  final String direction; // only need direction now

  List<Schedule> _allSchedules = [];
  bool isLoading = false;
  String errorMessage = "";
  DateTime selectedDay = DateTime.now();
  bool _disposed = false;

  ScheduleController({this.direction = ''});

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }

  void _safeNotify() {
    if (!_disposed) notifyListeners();
  }

  List<Schedule> get schedules {
    return _allSchedules.where((s) {
      if (direction == 'bus') {
        return s.transportType.toLowerCase() == 'bus';
      }
      if (direction.isNotEmpty) {
        // train: filter by direction field
        return s.transportType.toLowerCase() == 'metro' &&
            s.direction.toLowerCase() == direction.toLowerCase();
      }
      return true;
    }).toList();
  }

  Future<void> loadSchedules({DateTime? day}) async {
    isLoading = true;
    errorMessage = "";
    _safeNotify();
    try {
      final target = day ?? selectedDay;
      _allSchedules = await _apiService.fetchSchedules(date: target);
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
