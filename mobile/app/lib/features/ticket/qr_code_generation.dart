import 'package:qr_flutter/qr_flutter.dart';
import 'package:app/data/models/ticket_model.dart';
import 'package:flutter/material.dart';

class QrCodeGeneration extends StatelessWidget {
  final String qrData;

  const QrCodeGeneration({Key? key, required this.qrData}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return QrImageView(
      data: qrData,
      version: QrVersions.auto,
      size: 200.0,
      backgroundColor: Colors.white,
    );
  }
}
