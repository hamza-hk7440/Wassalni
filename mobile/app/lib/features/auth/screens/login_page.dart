import 'package:flutter/material.dart';
import 'package:app/core/theme/colors_R.dart';
import 'package:app/core/theme/styles_R.dart';
class LoginScreen extends StatefulWidget{
  const LoginScreen({super.key});
  State<LoginScreen> createState() => _LoginScreenState();
}
class _LoginScreenState extends State<LoginScreen>{
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: AppColors.colorA,
      body: Center(child:SingleChildScrollView(padding: const EdgeInsets.all(25), child: Form(key: _formKey,
      child: Column(children: [
        const SizedBox(height: 40),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.1),blurRadius: 20,spreadRadius: 2,offset: const Offset(0, 8))]),
          child: Image.asset("assets/logoApp.png",height: 170,width: 50,),
        ),
        const SizedBox(height: 25),
        const Text("Welcome Back to Wassalni",style: AppTextStyles.grandTitre),
        const SizedBox(height: 30),
        TextFormField(controller: emailController,
        decoration: InputDecoration(labelText:"Email",hintText :"Enter your mail", labelStyle: AppTextStyles.hint,hintStyle: AppTextStyles.hint,border: OutlineInputBorder(borderRadius: BorderRadius.circular(12),),prefixIcon: const Icon(Icons.email),),
        validator: (value){
          if (value==null || value.isEmpty){
            return "Please enter your email";
          }
          return null;
        },
        ),
        const SizedBox(height:20),
        TextFormField( controller: passwordController,obscureText: true,
        decoration: InputDecoration(labelText: "Password",hintText:"Enter your password ",labelStyle: AppTextStyles.hint,hintStyle: AppTextStyles.hint,border: OutlineInputBorder(borderRadius: BorderRadius.circular(12),),prefixIcon: const Icon(Icons.lock),),validator: (value) {
          if (value==null || value.isEmpty){
            return "Password cannot be empty !";
          }
          return null;
        },
        ),
        const SizedBox(height: 30),
        SizedBox(
          width:400,
          height: 50,
          child: ElevatedButton(style: ElevatedButton.styleFrom(elevation: 3,shape: RoundedRectangleBorder(borderRadius: BorderRadiusGeometry.circular(12),),),
          onPressed:() {
            if (_formKey.currentState!.validate()){
              print("Email :${emailController.text}");
              print("Password :${passwordController.text}");
            }
          },
          child: const Text("Login",style: TextStyle(fontSize: 18),),),),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,children: [
              const Text("Don't have an account ?"),
              TextButton(onPressed: () {}, child: const Text("Create Account"),)
            ],
          ),


      ],),),),
     
      )
    );
  }
}
