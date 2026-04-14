class Schedule {
  final String id;
  final String routeId;
  final String from;
  final String to;
  final String departure;
  final String arrival;
  final int price;
  final int availableSeats;
  final String transportType;
  final String direction; // ADD THIS

  Schedule({
    required this.id,
    required this.routeId,
    required this.from,
    required this.to,
    required this.departure,
    required this.arrival,
    required this.price,
    required this.availableSeats,
    required this.transportType,
    required this.direction, // ADD THIS
  });

  factory Schedule.fromJson(Map<String, dynamic> json) {
    final route = json['routes'];
    final transport = json['transports'];

    return Schedule(
      id: json['schedule_id']?.toString() ?? '',
      routeId: json['route_id']?.toString() ?? '',
      from: route?['start_station']?['name'] ?? 'Unknown',
      to: route?['end_station']?['name'] ?? 'Unknown',
      departure: json['departure_time']?.toString() ?? '--:--',
      arrival: json['arrival_time']?.toString() ?? '--:--',
      price: (json['current_price'] ?? route?['base_price'] ?? 0).toInt(),
      availableSeats: json['available_seats'] ?? 0,
      transportType: transport?['type'] ?? 'Unknown',
      direction: json['direction']?.toString() ?? '', // ADD THIS
    );
  }
}