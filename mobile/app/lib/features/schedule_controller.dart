import 'package:flutter/material.dart';
import '../data/api/api_service.dart';
import '../data/models/schedule.dart';

class ScheduleController extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  List<Schedule> schedules = [];
  bool isLoading = false;
  String errorMessage = "";
  DateTime selectedDay = DateTime.now();

  Future<void> loadSchedules({DateTime? day}) async {
    isLoading = true;
    errorMessage = "";
    notifyListeners();
    try {
      final target = day ?? selectedDay;
      schedules = await _apiService.fetchSchedules(date: target);
    } catch (e) {
      errorMessage = e.toString();
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  void selectDay(DateTime day) {
    selectedDay = day;
    loadSchedules(day: day);
  }
}
