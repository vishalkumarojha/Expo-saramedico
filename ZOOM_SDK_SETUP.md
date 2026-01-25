# Zoom SDK Setup Instructions

## Prerequisites

1. **Zoom SDK Credentials**
   - Go to https://marketplace.zoom.us/
   - Create a Meeting SDK app
   - Get your SDK Key and SDK Secret
   - Update `/home/arno/Desktop/Projects/folder/sara_medico/react/src/services/zoomService.js`:
     ```javascript
     const ZOOM_SDK_KEY = 'YOUR_ZOOM_SDK_KEY'; // Replace
     const ZOOM_SDK_SECRET = 'YOUR_ZOOM_SDK_SECRET'; // Replace
     ```

## Android Setup

1. **Update `android/app/build.gradle`**:

```gradle
android {
    compileSdkVersion 34
    
    defaultConfig {
        minSdkVersion 21  // REQUIRED for Zoom SDK
        targetSdkVersion 34
    }
}

dependencies {
    // Add Zoom SDK
    implementation project(':react-native-zoom-us')
}
```

2. **Add permissions to `android/app/src/main/AndroidManifest.xml`**:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
```

3. **Rebuild the app**:
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

## iOS Setup

1. **Update `ios/Podfile`**:

```ruby
platform :ios, '12.0'  # Minimum iOS 12

target 'saramedico' do
  # ... existing pods
  
  # Add Zoom SDK
  pod 'react-native-zoom-us', :path => '../node_modules/@zoom/meetingsdk-react-native'
end
```

2. **Add permissions to `ios/saramedico/Info.plist`**:

```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access for video calls</string>
<key>NSMicrophoneUsageDescription</key>
<string>We need microphone access for video calls</string>
```

3. **Install pods and rebuild**:
```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

## Backend Update (Already Done)

The backend appointment model already returns:
- `meeting_id` - Zoom meeting ID number
- `join_url` - Join link
- `start_url` - Host link  
- `meeting_password` - Meeting password

## Testing

1. **Doctor Flow**:
   - Login as doctor@test.com
   - View schedule → Approve pending appointment
   - Click "Start Video Call"
   - Should auto-join with doctor name

2. **Patient Flow**:
   - Login as patient@test.com
   - Go to schedule
   - Click "Join Call" on approved appointment
   - Enter name → should join meeting

## Troubleshooting

- **Meeting ID not found**: Ensure backend is returning `meeting_id` in appointment response
- **SDK initialization failed**: Check SDK credentials are correct
- **Camera/Mic not working**: Check permissions in device settings
- **Build errors**: Clean and rebuild native code (`cd android && ./gradlew clean`)

## Alternative: Use Existing Browser Flow

If you encounter SDK licensing or setup issues, the existing browser-based flow (using `Linking.openURL`) works perfectly and doesn't require native code changes. Just comment out the VideoCallScreen navigation and uncomment the Linking.openURL code.
