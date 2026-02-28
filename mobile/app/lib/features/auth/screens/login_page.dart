import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:app/core/theme/colors_R.dart';
import 'package:app/features/auth/screens/signup_page.dart';

class LoginScreen extends StatefulWidget{
  const LoginScreen({super.key});
  @override
  _LoginScreenState createState() => _LoginScreenState();
}
class _LoginScreenState extends State<LoginScreen>{
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isPasswordVisible = false ;
  bool _isLoading = false;
  Widget _buildDivider() {
  return Padding(
    padding: const EdgeInsets.symmetric(vertical: 20),
    child: Row(children: [Expanded(child: Divider(color: Colors.grey[300], thickness: 1)),
    Padding(padding: const EdgeInsets.symmetric(horizontal: 10),
    child: Text( "OR",style: GoogleFonts.poppins(color: Colors.grey[500], fontSize: 12),),),
    Expanded(child: Divider(color: Colors.grey[300], thickness: 1)),],
    ),);
    }
  Widget _buildGoogleButton() {
  return Container(
    width: double.infinity,
    height: 55,
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(15),
      boxShadow:[BoxShadow(color: Colors.black.withOpacity(0.05),blurRadius: 10,offset: const Offset(0, 5),),],
      border: Border.all(color: Colors.grey.shade200,),
    ),
    child: InkWell(
      borderRadius: BorderRadius.circular(15),
      onTap: () {print("Continue with Google tapped");},
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [ Image.asset( "assets/logoGoogle.png", height: 22,),
        const SizedBox(width: 12),
        Text(
            "Continue with Google",
              style: GoogleFonts.poppins(color: Colors.black87,fontSize: 15,fontWeight: FontWeight.w600,),
            ),],
      ),
    ),
  );
}
  @override
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: AppColors.colorL,
      appBar: AppBar(backgroundColor: Colors.transparent,elevation: 0),
      body: SafeArea(child:Center(child :SingleChildScrollView(padding: const EdgeInsets.symmetric(horizontal: 30), child: Container(constraints: const BoxConstraints(maxWidth: 450),child:Form(key: _formKey,
      child: Column( mainAxisAlignment: MainAxisAlignment.center,
      children: [
      Text("Welcome Back",style: GoogleFonts.poppins(fontSize: 32,fontWeight: FontWeight.bold,color: AppColors.colorA,letterSpacing: 1.5,),),
      const SizedBox(height: 8),
      Text("Login to stay connected",textAlign: TextAlign.center,style: GoogleFonts.poppins(fontSize: 16,color: Colors.grey[600],),),
      const SizedBox(height: 40),
    
      TextFormField(controller: emailController, keyboardType: TextInputType.emailAddress,decoration: InputDecoration(labelText: 'Email',hintText: 'Enter your email',
      prefixIcon: Icon(Icons.email_outlined, color: AppColors.colorA),filled: true,fillColor :Colors.white,
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(15),borderSide: BorderSide.none,),),
      validator: (value) => (value == null || value.isEmpty) ? 'Email requis' : null,
      ),
      SizedBox(height: 18), 

      TextFormField(controller: passwordController,obscureText: !_isPasswordVisible,decoration: InputDecoration(labelText: 'Password',hintText: 'Enter your password',
      prefixIcon: Icon(Icons.lock_outline, color: AppColors.colorA),suffixIcon:IconButton(icon:Icon(_isPasswordVisible?Icons.visibility:Icons.visibility_off,color: Colors.grey,), onPressed: () => setState(() => _isPasswordVisible = !_isPasswordVisible),),
      filled :true,fillColor:Colors.white,
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(15),borderSide: BorderSide.none,),),
      validator: (value) => (value == null || value.isEmpty) ? 'Mot de passe requis' : null,
       ),
      Align(alignment: Alignment.centerRight,child: TextButton(onPressed: (){}, child: Text("forgotten password ?",style: TextStyle(color: AppColors.colorA)),),),
      const SizedBox(height: 10),

      SizedBox(width:double.infinity,height:  55,child: ElevatedButton(style: ElevatedButton.styleFrom(backgroundColor:AppColors.colorA,elevation: 5,shadowColor: AppColors.colorA.withOpacity(0.4),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),),
      onPressed: _isLoading ? null : () async {
        if (_formKey.currentState!.validate()) {
          setState(() => _isLoading = true);
          await Future.delayed(const Duration(seconds: 2));
          if (mounted){
          setState(() => _isLoading = false);
          ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
          content: Text("Login Successful!"), 
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,),);
        }
       }
     },
      child: _isLoading ? const SizedBox(height: 24,child: CircularProgressIndicator(color: Colors.white,strokeWidth: 2))                  
      : Text("Login",style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
    ),
    ),
      const SizedBox(height: 20),
      Row(mainAxisAlignment: MainAxisAlignment.center,
          children: [Text("Don't have an account ?",style: GoogleFonts.poppins(color: Colors.grey[700]),),
          TextButton(onPressed: () {Navigator.push(context,MaterialPageRoute(builder: (context) => const SignupScreen()),);},
          child: Text("Create Account",style: GoogleFonts.poppins(fontWeight: FontWeight.bold,color: AppColors.colorA,decoration: TextDecoration.underline,),),)],
        ),
      _buildDivider(),
      _buildGoogleButton(),
      const SizedBox(height: 30),
      ],
     ),),),),),),
    );
  }
}
