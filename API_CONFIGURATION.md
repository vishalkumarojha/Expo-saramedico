# API Configuration Guide

## Overview

The Sara Medico app is configured to work with both **local development APIs** and **AWS deployed REST APIs**. You can easily switch between them using environment variables.

## Quick Start

### Using AWS Deployed API (Default)

The app is configured by default to use the AWS deployed API at `http://65.0.98.170:8000`.

**No changes needed** - just run the app!

```bash
npm start
# or
expo start
```

### Using Local Development API

To switch to your local backend:

1. **Update `.env` file**:
   ```bash
   API_ENVIRONMENT=local
   LOCAL_API_HOST=localhost  # or your machine's IP for physical devices
   LOCAL_API_PORT=8000
   ```

2. **Restart the app** (important - Expo needs to reload env variables):
   ```bash
   # Stop the current server (Ctrl+C)
   npm start
   ```

3. **Start your local backend** on port 8000

## Environment Variables Reference

### `.env` File Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `API_ENVIRONMENT` | API environment to use | `aws` | `aws` or `local` |
| `AWS_API_URL` | AWS deployed API base URL | `http://65.0.98.170:8000` | `http://65.0.98.170:8000` |
| `LOCAL_API_HOST` | Local API hostname/IP | `localhost` | `localhost` or `192.168.1.100` |
| `LOCAL_API_PORT` | Local API port | `8000` | `8000` or `8001` |

## Platform-Specific Behavior

### Android Emulator
- **Local API**: Uses `10.0.2.2` (special emulator address for host machine)
- **AWS API**: Uses AWS URL directly
- **Example**: `http://10.0.2.2:8000/api/v1`

### iOS Simulator
- **Local API**: Uses `localhost` or configured IP
- **AWS API**: Uses AWS URL directly
- **Example**: `http://localhost:8000/api/v1`

### Physical Devices
When testing on a physical device with local API:
1. Find your computer's IP address on WiFi
2. Update `LOCAL_API_HOST` in `.env`:
   ```bash
   LOCAL_API_HOST=192.168.1.100  # Your actual IP
   ```
3. Ensure your device is on the same WiFi network

## Checking Active Configuration

When the app starts, check the console logs for API configuration:

```
🌐 [API Config] Using AWS Deployed API
✅ [API Config] Base URL: http://65.0.98.170:8000/api/v1
ℹ️  [API Config] To switch APIs, change API_ENVIRONMENT in .env file
```

or

```
💻 [API Config] Using Local Development API
📱 [API Config] Platform: Android Emulator
✅ [API Config] Base URL: http://10.0.2.2:8000/api/v1
ℹ️  [API Config] To switch APIs, change API_ENVIRONMENT in .env file
```

## Common Scenarios

### Scenario 1: Development on Android Emulator with Local Backend

```bash
# .env
API_ENVIRONMENT=local
LOCAL_API_PORT=8000
```

The app will automatically use `http://10.0.2.2:8000/api/v1`

### Scenario 2: Testing on Physical Device with AWS API

```bash
# .env
API_ENVIRONMENT=aws
```

The app will use `http://65.0.98.170:8000/api/v1`

### Scenario 3: iOS Simulator with Local Backend

```bash
# .env
API_ENVIRONMENT=local
LOCAL_API_HOST=localhost
LOCAL_API_PORT=8000
```

The app will use `http://localhost:8000/api/v1`

### Scenario 4: Physical Device with Local Backend

```bash
# .env
API_ENVIRONMENT=local
LOCAL_API_HOST=192.168.1.100  # Your computer's WiFi IP
LOCAL_API_PORT=8000
```

The app will use `http://192.168.1.100:8000/api/v1`

## Troubleshooting

### Issue: API calls failing after changing environment

**Solution**: Restart the Expo development server
```bash
# Press Ctrl+C to stop
npm start
```

### Issue: "Network Error" on physical device with local API

**Solutions**:
1. Verify device is on same WiFi network as your computer
2. Check `LOCAL_API_HOST` is set to your computer's WiFi IP (not `localhost`)
3. Ensure local backend is running and accessible
4. Check firewall settings allow connections on the backend port

### Issue: Android emulator can't connect to local backend

**Solutions**:
1. Verify `API_ENVIRONMENT=local` in `.env`
2. Ensure backend is running on the specified port
3. Try `adb reverse tcp:8000 tcp:8000` command
4. Check that `LOCAL_API_PORT` matches your backend port

### Issue: Environment variables not updating

**Solution**: 
1. Stop the Expo server completely (Ctrl+C)
2. Clear Metro bundler cache:
   ```bash
   expo start -c
   ```
3. Restart the app

## Finding Your Computer's IP Address

### macOS
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### Linux
```bash
hostname -I
```

### Windows
```bash
ipconfig
```

Look for the IPv4 address on your WiFi adapter (usually starts with 192.168.x.x or 10.x.x.x)

## Backend API Documentation

The backend API documentation is available at:
- **AWS**: http://65.0.98.170:8000/docs
- **Local**: http://localhost:8000/docs (when running locally)

### Issue: Login fails in production APK but works in development

**Reason**: Android blocks HTTP (cleartext) traffic by default in production.
**Solution**: 
1. The app has been configured with `withAndroidCleartext` Expo plugin (in `app.config.js`) to allow cleartext traffic.
2. Ensure you rebuild the APK using `npx expo prebuild` or `eas build` to apply these configuration changes.
3. For best security, it is highly recommended to migrate the AWS API to HTTPS (port 443).
