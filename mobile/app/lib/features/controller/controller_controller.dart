
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:flutter/material.dart';
import 'package:app/features/controller/widgets/handleQrCode.dart';

class TicketScannerScreen extends StatelessWidget {
  @override
  const TicketScannerScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final scannerController = MobileScannerController();
    return Scaffold(
      appBar: AppBar(title: Text('Scan Ticket QR Code')),
      body: MobileScanner(
        controller: scannerController,
        onDetect: (capture) {
          final List<Barcode> barcodes = capture.barcodes;
          final qrData = barcodes.first.rawValue;
          if (qrData != null) {
            handleQrData(context, qrData, scannerController);
          }
        },
      ),
    );
  }
}
