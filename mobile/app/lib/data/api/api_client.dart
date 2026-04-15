import 'dart:async';
import 'dart:convert';

import 'package:app/data/api/api_config.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

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
  static String get baseUrl => ApiConfig.baseUrl;
  static int get timeoutSeconds => ApiConfig.timeoutSeconds;
  static const String authTokenKey = 'auth_token';

  static final ApiClient _instance = ApiClient._internal();

  factory ApiClient() => _instance;

  ApiClient._internal();

  Future<String?> _getToken() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString(authTokenKey);
    } catch (_) {
      return null;
    }
  }

  Future<Map<String, String>> _getHeaders() async {
    final token = await _getToken();
    final headers = <String, String>{'Content-Type': 'application/json'};

    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }

    return headers;
  }

  dynamic _handleResponse(http.Response response) {
    try {
      final decodedBody = jsonDecode(response.body);
      final backendMessage = decodedBody is Map<String, dynamic>
          ? (decodedBody['message'] ?? decodedBody['error'])?.toString()
          : null;

      if (response.statusCode == 200 || response.statusCode == 201) {
        return decodedBody;
      }

      if (response.statusCode == 401) {
        throw UnauthorizedException(
          message: backendMessage ?? 'Unauthorized',
          statusCode: response.statusCode,
        );
      }

      if (response.statusCode == 500) {
        throw ServerException(
          message: backendMessage ?? 'Server error',
          statusCode: response.statusCode,
        );
      }

      if (response.statusCode == 400) {
        throw ClientException(
          message: backendMessage ?? 'Invalid request',
          statusCode: response.statusCode,
        );
      }

      throw ApiException(
        'Request failed with status ${response.statusCode}',
        statusCode: response.statusCode,
      );
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException(
        'Failed to process response: ${response.body}',
        originalError: e,
      );
    }
  }

  String _buildUrl(String endpoint, [Map<String, String>? queryParams]) {
    var url = '$baseUrl/$endpoint';

    if (queryParams != null && queryParams.isNotEmpty) {
      final query = queryParams.entries
          .map((entry) => '${entry.key}=${entry.value}')
          .join('&');
      url = '$url?$query';
    }

    return url;
  }

  Future<dynamic> get(
    String endpoint, {
    Map<String, String>? queryParameters,
  }) async {
    try {
      final headers = await _getHeaders();
      final url = _buildUrl(endpoint, queryParameters);

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

  Future<dynamic> post(
    String endpoint, {
    required Map<String, dynamic> body,
  }) async {
    try {
      final headers = await _getHeaders();
      final url = _buildUrl(endpoint);
      final jsonBody = jsonEncode(body);

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

  Future<dynamic> delete(
    String endpoint, {
    Map<String, String>? queryParameters,
  }) async {
    try {
      final headers = await _getHeaders();
      final url = _buildUrl(endpoint, queryParameters);

      final response = await http
          .delete(Uri.parse(url), headers: headers)
          .timeout(
            Duration(seconds: timeoutSeconds),
            onTimeout: () {
              throw TimeoutException(
                'Request timeout after $timeoutSeconds seconds',
              );
            },
          );

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
