import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'dart:async';

//exceptions classes...we need this classes to handle the exceptions so instead of throwing a generic exception we can throw a specific exception and handle it in the UI
class ApiException implements Exception {
  final String message; //what we will show to the user
  final String? errorCode; // 'UNAUTHORIZED', 'SERVER_ERROR', etc.
  final int? statusCode; // HTTP status code (401, 500, etc.)
  final dynamic originalError; // original error object for debugging
  ApiException(
    this.message, {
    this.errorCode,
    this.statusCode,
    this.originalError,
  });
  @override
  String toString() => message;
}

///exception for  401-Unauthorized(wrong password or token expired)
class UnauthorizedException extends ApiException {
  UnauthorizedException({
    required String message,
    int? statusCode,
    dynamic originalError,
  }) : super(
         message,
         errorCode: 'UNAUTHORIZED',
         statusCode: statusCode,
         originalError: originalError,
       );
}

/// exception for 500 - Server error
class ServerException extends ApiException {
  ServerException({
    required String message,
    int? statusCode,
    dynamic originalError,
  }) : super(
         message,
         errorCode: 'SERVER_ERROR',
         statusCode: statusCode,
         originalError: originalError,
       );
}

/// exception for 400 - Bad request (invalid input)
class ClientException extends ApiException {
  ClientException({
    required String message,
    int? statusCode,
    dynamic originalError,
  }) : super(
         message,
         errorCode: 'CLIENT_ERROR',
         statusCode: statusCode,
         originalError: originalError,
       );
}

/// exception for network issues (no internet, timeout)
class NetworkException extends ApiException {
  NetworkException({required String message, dynamic originalError})
    : super(message, errorCode: 'NETWORK_ERROR', originalError: originalError);
}

//api client class to handle all the api calls and handle the exceptions(main http communication layer between the app and the backend)
class ApiClient {
  //constants
  //base url of the backend server
  //it will be changed to the actual url of the backend server when we deploy it, for now we will use localhost for testing
  static const String baseUrl = 'http://10.0.2.2:3000';
  //timeout duration for the http requests
  //if the request takes more than 10 seconds, we will consider it as a network error and throw a NetworkException
  static const int timeoutSeconds = 10;
  //method to get the auth token from shared preferences
  //used to retrieve the token from shared preferences (must match the key used in auth_controller)
  static const String authTokenKey = 'auth_token';
  //singleton pattern to ensure only one instance of ApiClient is created
  //only one instance of ApiClient will be created and shared across the app, this is important to manage the http client and avoid creating multiple instances that can lead to memory leaks
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() {
    return _instance;
  }
  ApiClient._internal();
  // Add these methods to ApiClient class:

  Future<Map<String, String>> _getHeaders() async {
    final token = await _getToken();
    final headers = {'Content-Type': 'application/json'};
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    print('📤 Sending Headers: $headers'); // ← DEBUG: Print headers
    return headers;
  }

  Future<String?> _getToken() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString(authTokenKey);
    } catch (e) {
      return null;
    }
  }

  dynamic _handleResponse(http.Response response) {
    try {
      // ← ADD THESE DEBUG LINES
      print('📡 Response Status: ${response.statusCode}');
      print('📡 Response Headers: ${response.headers}');
      print('📡 Response Body: ${response.body}');

      final decodedBody = jsonDecode(response.body) ?? {};
      if (response.statusCode == 200 || response.statusCode == 201) {
        return decodedBody;
      } else if (response.statusCode == 401) {
        throw UnauthorizedException(
          message: decodedBody['message'] ?? 'Unauthorized',
          statusCode: response.statusCode,
        );
      } else if (response.statusCode == 500) {
        throw ServerException(
          message: decodedBody['message'] ?? 'Server error',
          statusCode: response.statusCode,
        );
      } else if (response.statusCode == 400) {
        throw ClientException(
          message: decodedBody['message'] ?? 'Invalid request',
          statusCode: response.statusCode,
        );
      } else {
        throw ApiException(
          'Request failed with status ${response.statusCode}',
          statusCode: response.statusCode,
        );
      }
    } on ApiException {
      rethrow;
    } catch (e) {
      print('❌ Error: $e');
      print('📡 Full Response Body: ${response.body}');
      throw ApiException(
        'Failed to process response: ${response.body}',
        originalError: e,
      );
    }
  }

  String _buildUrl(String endpoint, [Map<String, String>? queryParams]) {
    String url = baseUrl + '/' + endpoint;
    if (queryParams != null && queryParams.isNotEmpty) {
      final queryString = queryParams.entries
          .map((e) => '${e.key}=${e.value}')
          .join('&');
      url += '?$queryString';
    }
    print('🔗 Full URL: $url'); // ← DEBUG: Print URL
    return url;
  }

  //public meethods
  //get request method
  //parameters: endpoint (the api endpoint to call, e.g. 'auth/login'), queryParameters (optional query parameters for the request)
  //returns: the response body as a Map (decoded from JSON)
  //throws: ApiException (UnauthorizedException, ServerException, ClientException, NetworkException)
  Future<dynamic> get(
    String endpoint, {
    Map<String, String>? queryParameters,
  }) async {
    try {
      //step 1: get the headers(including the auth token if available)
      final headers = await _getHeaders();
      //step 2: construct the full url with query parameters if provided
      final url = _buildUrl(endpoint, queryParameters);
      //step 3: make the http GET request with a timeout
      final response = await http
          .get(Uri.parse(url), headers: headers)
          .timeout(
            Duration(seconds: timeoutSeconds),
            onTimeout: () {
              throw NetworkException(
                message: 'Request timeout after $timeoutSeconds seconds',
              );
            },
          );
      //step 4: handle the response based on the status code
      return _handleResponse(response);
    } on http.ClientException catch (e) {
      // Specific exception type - catch first
      throw NetworkException(
        message: 'Network error. Please check your internet connection.',
        originalError: e,
      );
    } on TimeoutException catch (e) {
      throw NetworkException(
        message: 'Request timeout. Please check your internet connection.',
        originalError: e,
      );
    } catch (e) {
      rethrow;
    }
  }

  //post request method
  //parameters: endpoint (the api endpoint to call, e.g. 'auth/login'), body (the request body as a Map, will be encoded to JSON)
  //returns: the response body as a Map (decoded from JSON)
  Future<dynamic> post(
    String endpoint, {
    required Map<String, dynamic> body,
  }) async {
    try {
      //step 1: get the headers(including the auth token if available)
      final headers = await _getHeaders();
      //step 2: construct the full url
      final url = _buildUrl(endpoint);
      //step 3: encode the body to JSON
      final jsonBody = jsonEncode(body);
      print('📤 Request Body: $jsonBody'); // ← DEBUG: Print request body
      //step 4: make the http POST request with a timeout
      final response = await http
          .post(Uri.parse(url), headers: headers, body: jsonBody)
          .timeout(
            Duration(seconds: timeoutSeconds),
            onTimeout: () {
              throw TimeoutException(
                'Request timeout after $timeoutSeconds seconds',
              );
            },
          );
      //step 5: handle the response based on the status code
      return _handleResponse(response);
    } on http.ClientException catch (e) {
      // Specific exception type - catch first
      throw NetworkException(
        message: 'Network error. Please check your internet connection.',
        originalError: e,
      );
    } on TimeoutException catch (e) {
      throw NetworkException(
        message: 'Request timeout. Please check your internet connection.',
        originalError: e,
      );
    } catch (e) {
      rethrow;
    }
  }
}

//private helper method
//get the token from the response
Future<String?> _getToken() async {
  try {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(ApiClient.authTokenKey);
  } catch (e) {
    print(' Error retrieving token: $e');
    return null;
  }
}

//get headers with the token if available
Future<Map<String, String>> _getHeaders() async {
  try {
    final token = await _getToken();
    final headers = {'Content-Type': 'application/json'};
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  } catch (e) {
    print('Error getting headers: $e');
    return {'Content-Type': 'application/json'};
  }
}
