import 'package:flutter/material.dart';
import 'package:app/core/theme/colors_R.dart';
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
      backgroundColor: AppColors.colorK,

      body: Center(child:SingleChildScrollView(padding: const EdgeInsets.all(25),child: Form(key: _formKey,
      child: Column(children: [
        SizedBox(height: 150,child:Image.asset("assets/logo.png"),),
        const SizedBox(height: 25),
        const Text("Welcome Back to Wassalni",style:TextStyle(fontSize: 26,fontWeight: FontWeight.bold,),),
        const SizedBox(height: 30),
        TextFormField(controller: emailController,decoration: InputDecoration(labelText:"Email",border: OutlineInputBorder(borderRadius: BorderRadius.circular(12),),prefixIcon: const Icon(Icons.email),),
        validator: (value){
          if (value==null || value.isEmpty){
            return "Please enter your email";
          }
          return null;
        },
        ),
        const SizedBox(height:20),
        TextFormField( controller: passwordController,obscureText: true,decoration: InputDecoration(
          labelText: "Password",border: OutlineInputBorder(borderRadius: BorderRadius.circular(12),),prefixIcon: const Icon(Icons.lock),
        ),validator: (value) {
          if (value==null || value.isEmpty){
            return "Password cannot be empty !";
          }
          return null;
        },
        ),
        const SizedBox(height: 30),
        SizedBox(
          width:double.infinity,
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
