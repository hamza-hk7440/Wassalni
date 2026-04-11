import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'dart:async';

class ApiException implements Exception {
  final String message;
  final String? errorCode;
  final int? statusCode;
  final dynamic originalError;
  ApiException(
    this.message, {
    this.errorCode,
    this.statusCode,
    this.originalError,
  });
  @override
  String toString() => message;
}

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

class NetworkException extends ApiException {
  NetworkException({required String message, dynamic originalError})
    : super(message, errorCode: 'NETWORK_ERROR', originalError: originalError);
}

class ApiClient {
  static const String baseUrl = 'http://192.168.1.8:3000';
  static const int timeoutSeconds = 10;
  static const String authTokenKey = 'auth_token';
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() {
    return _instance;
  }
  ApiClient._internal();
  Future<Map<String, String>> _getHeaders() async {
    final token = await _getToken();
    final headers = {'Content-Type': 'application/json'};
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
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
      final decodedBody = jsonDecode(response.body) ?? {};
      final backendMessage = decodedBody is Map<String, dynamic>
          ? (decodedBody['message'] ?? decodedBody['error'])?.toString()
          : null;
      if (response.statusCode == 200 || response.statusCode == 201) {
        return decodedBody;
      } else if (response.statusCode == 401) {
        throw UnauthorizedException(
          message: backendMessage ?? 'Unauthorized',
          statusCode: response.statusCode,
        );
      } else if (response.statusCode == 500) {
        throw ServerException(
          message: backendMessage ?? 'Server error',
          statusCode: response.statusCode,
        );
      } else if (response.statusCode == 400) {
        throw ClientException(
          message: backendMessage ?? 'Invalid request',
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
      print(' Error: $e, Response: ${response.body}');
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
    return url;
  }

  //public meethods
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
