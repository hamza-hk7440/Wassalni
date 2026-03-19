### api_client.dart handles:
├─ Making HTTP requests
├─ Automatically adding token to headers
├─ Checking response status codes
├─ Throwing appropriate exceptions
└─ Decoding JSON responses

### The Beauty:
├─ Screens don't worry about token
├─ Screens don't worry about error handling details
├─ Just call: await apiClient.get('/api/endpoint')
└─ And it handles everything!

### api_client.dart contains:
├─ Exception Classes (Custom Errors)
│  ├─ ApiException (base)
│  ├─ UnauthorizedException (401)
│  ├─ ServerException (500)
│  ├─ ClientException (400)
│  └─ NetworkException (no internet)
│
└─ ApiClient Class
   ├─ Constants
   ├─ Singleton Pattern Setup
   ├─ Public Methods
   │  ├─ get()
   │  ├─ post()
   │  ├─ put()
   │  └─ delete()
   ├─ Private Helper Methods
   │  ├─ _getHeaders()
   │  ├─ _getToken()
   │  ├─ _handleResponse()
   │  └─ _buildUrl()
   └─ Debug Methods