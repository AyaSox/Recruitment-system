# API Request Method Debugging Guide

## Issue: Swagger Shows POST but Debugger Shows GET

### What We've Done to Fix This:

1. **Enhanced Login Form Handling**:
   - Added explicit `event.preventDefault()` to prevent default form submission
   - Added proper form submission handling with Formik
   - Added loading states and better error handling

2. **Enhanced API Logging**:
   - Added comprehensive request/response logging in the API service
   - Added debug logging in AuthService
   - Added detailed logging in the backend AuthController

3. **Added API Debug Tool**:
   - Created `ApiDebugger` component to test endpoints directly
   - Temporarily added to LoginPage for testing

### How to Debug:

1. **Start Both Servers**:
   ```powershell
   .\start-servers.ps1
   ```

2. **Open Browser Developer Tools**:
   - Press F12
   - Go to Console tab
   - Go to Network tab

3. **Test the API**:
   - Navigate to http://localhost:5173
   - Use the "API Debugger" section on the login page
   - Click "Test Auth Endpoint" first
   - Then click "Test Login"

4. **Check the Logs**:
   - **Browser Console**: Look for the detailed request logs
   - **Browser Network Tab**: Verify HTTP methods (should show POST for login)
   - **Backend Console**: Check for the detailed server logs

### Expected Behavior:

#### Browser Console Should Show:
```
?? API Request: POST /api/auth/login
Request data: {email: "admin@atsrecruit.com", password: "Admin@123"}
? API Response: 200 POST /auth/login
```

#### Browser Network Tab Should Show:
- Request URL: `http://localhost:5173/api/auth/login`
- Request Method: `POST`
- Status: `200 OK` (if successful)

#### Backend Console Should Show:
```
POST /api/auth/login - Login attempt for email: admin@atsrecruit.com
POST /api/auth/login - Login successful for email: admin@atsrecruit.com
```

### Common Causes of GET Instead of POST:

1. **Form Default Behavior**: 
   - **Symptom**: Form submits as GET with URL parameters
   - **Fix**: Ensure `event.preventDefault()` is called
   - **Status**: ? Fixed in LoginPage.tsx

2. **Browser Navigation**:
   - **Symptom**: Page refreshes and shows GET request
   - **Fix**: Proper async handling and error catching
   - **Status**: ? Fixed in AuthContext.tsx

3. **Proxy Issues**:
   - **Symptom**: Request doesn't reach the backend
   - **Fix**: Proper Vite proxy configuration
   - **Status**: ? Fixed in vite.config.ts

4. **CORS Redirect**:
   - **Symptom**: Browser redirects POST to GET
   - **Fix**: Proper CORS configuration
   - **Status**: ? Configured in Program.cs

### Troubleshooting Steps:

1. **If you see GET requests in Network tab**:
   ```javascript
   // Check if form is preventing default submission
   // Look for this in browser console
   console.log('Form submission prevented');
   ```

2. **If requests aren't reaching the backend**:
   - Check Vite proxy configuration
   - Verify backend is running on https://localhost:7129
   - Check CORS settings

3. **If backend receives requests but they're GET**:
   - This suggests a browser redirect issue
   - Check for HTTPS/HTTP mismatches
   - Verify CORS configuration

### Testing with the Debug Tool:

1. **Click "Test Auth Endpoint"**: 
   - Should make GET request to `/api/auth/test`
   - Should return success with timestamp

2. **Click "Test Login"**: 
   - Should make POST request to `/api/auth/login`
   - Should return success with login token

3. **Use Regular Login Form**:
   - Fill in credentials
   - Watch Network tab during submission
   - Verify POST method is used

### Quick Fix Commands:

```powershell
# If you need to restart everything
.\stop-servers.ps1
.\start-servers.ps1

# If you need to clear browser cache
# Press Ctrl+Shift+R in browser
# Or open DevTools > Application > Storage > Clear storage
```

### Expected Resolution:

After implementing these fixes:
- ? Login form should submit as POST
- ? API requests should be properly logged
- ? Backend should receive POST requests
- ? Authentication should work properly

### Remove Debug Code:

Once everything is working, remove the `<ApiDebugger />` component from `LoginPage.tsx` and optionally reduce the console logging in the services.

### Next Steps:

1. Test with the debug tool
2. Verify POST requests in Network tab
3. Check console logs for any errors
4. Try actual login with test credentials
5. Report back with specific error messages if issues persist