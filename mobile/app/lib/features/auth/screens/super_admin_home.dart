import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:app/features/auth/auth_controller.dart';

import 'package:flutter/material.dart';

class SuperAdminHome extends StatelessWidget {
  const SuperAdminHome({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.blue,
        title: Text('Super Admin Home'),
      ),
      body: Center(child: Text('Login Successful!')),
    );
  }
}
