import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:app/core/theme/colors_R.dart';

class LoginScreen extends StatefulWidget{
  const LoginScreen({super.key});
  State<LoginScreen> createState() => _LoginScreenState();
}
class _LoginScreenState extends State<LoginScreen>{
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  Widget _buildGoogleButton() {
  return Container(
    width: double.infinity,
    height: 55,
    decoration: BoxDecoration(
      color: Colors.white.withOpacity(0.1),
      borderRadius: BorderRadius.circular(18),
      border: Border.all(
        color: const Color(0xFF4DD0E1).withOpacity(0.3),
      ),
    ),
    child: InkWell(
      borderRadius: BorderRadius.circular(18),
      onTap: () {
        print("Continue with Google tapped");
      },
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [ Image.network( "https://developers.google.com/identity/images/g-logo.png", height: 22,),
        const SizedBox(width: 12),
        const Text(
            "Continue with Google",
            style: TextStyle(
              color: Color(0xFFE0F7FA),
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    ),
  );
}
  @override
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: AppColors.colorF,
      body: Center(child:SingleChildScrollView(padding: const EdgeInsets.all(25), child: Form(key: _formKey,
      child: Column(children: [SizedBox(height: 30),Text("Welcome Back",style: GoogleFonts.poppins(fontSize: 28,fontWeight: FontWeight.w700,color: Colors.blue[900],
                shadows: [Shadow(offset: Offset(1, 1),blurRadius: 3,color: Colors.blueGrey.withOpacity(0.5),)],),
                  textAlign: TextAlign.center,
        ),
        SizedBox(height: 30),
        TextFormField(controller: emailController, decoration: InputDecoration(labelText: 'Email',hintText: 'Enter your email',prefixIcon: Icon(Icons.email, color: Colors.blue[800]),
           border: OutlineInputBorder(borderRadius: BorderRadius.circular(12),),filled: true,fillColor: Colors.white,),
           validator: (value) {
             if (value == null || value.isEmpty) {
                return 'Please enter your email';
             }
             return null;
          },
        ),
        SizedBox(height: 20), 
        TextFormField(controller: passwordController,obscureText: true,decoration: InputDecoration(labelText: 'Password',hintText: 'Enter your password',
          prefixIcon: Icon(Icons.lock, color: Colors.blue[800]),border: OutlineInputBorder(borderRadius: BorderRadius.circular(12),),filled: true,fillColor: Colors.white,),
          validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Password cannot be empty!';
              }
              return null;
          },
       ),
        const SizedBox(height: 30),
        SizedBox( width: double.infinity,height: 50,child: ElevatedButton(style: ElevatedButton.styleFrom(backgroundColor: Colors.blue[800],shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12),),),
          onPressed: () {
            if (_formKey.currentState!.validate()){
              print("Email :${emailController.text}");
              print("Password :${passwordController.text}");
            }
          },
          child:Text("Login",style: GoogleFonts.poppins(fontSize: 18,fontWeight: FontWeight.bold,color: Colors.white,),),),),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text("Don't have an account ?",style: GoogleFonts.poppins(color: Colors.grey[700]),),
              TextButton(onPressed: () {}, child: Text("Create Account",style: GoogleFonts.poppins(fontWeight: FontWeight.bold,color: Colors.blue[700],decoration: TextDecoration.underline,),),)
            ],
          ),
        const SizedBox(height: 30),
        _buildGoogleButton(),
      ],
     ),),),),
    );
  }
}
