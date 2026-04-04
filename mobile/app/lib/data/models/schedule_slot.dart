class ScheduleSlot {
  final String scheduleId;
  final String departureTime;
  final String arrivalTime;
  final int availableSeats;
  final int price;

  ScheduleSlot({
    required this.scheduleId,
    required this.departureTime,
    required this.arrivalTime,
    required this.availableSeats,
    required this.price,
  });

  factory ScheduleSlot.fromJson(Map<String, dynamic> json) {
    return ScheduleSlot(
      scheduleId: json['schedule_id']?.toString() ?? '',
      departureTime: json['departure_time']?.toString() ?? '',
      arrivalTime: json['arrival_time']?.toString() ?? '',
      availableSeats: json['available_seats'] ?? 0,
      price: (json['current_price'] ?? 0).toInt(),
    );
  }
}
