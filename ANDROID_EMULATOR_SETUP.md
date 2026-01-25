# Android Emulator Setup Guide for SaraMedico

This guide will help you install Android Studio and set up an Android emulator on your Linux machine.

## Prerequisites

- At least 8GB RAM (16GB recommended)
- 20GB free disk space
- Linux desktop environment

## Step 1: Install Android Studio

### Option A: Via Snap (Easiest)
```bash
sudo snap install android-studio --classic
```

### Option B: Manual Installation
```bash
# Download Android Studio from official website
wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2023.2.1.24/android-studio-2023.2.1.24-linux.tar.gz

# Extract the archive
tar -xzf android-studio-*-linux.tar.gz

# Move to /opt
sudo mv android-studio /opt/

# Create desktop entry
cat > ~/.local/share/applications/android-studio.desktop << 'EOF'
[Desktop Entry]
Version=1.0
Type=Application
Name=Android Studio
Icon=/opt/android-studio/bin/studio.png
Exec=/opt/android-studio/bin/studio.sh
Terminal=false
Categories=Development;IDE;
EOF

# Launch Android Studio
/opt/android-studio/bin/studio.sh
```

## Step 2: Complete Android Studio Setup

1. Launch Android Studio
2. Follow the setup wizard
3. **Install Android SDK** (accept default location: `~/Android/Sdk`)
4. **Install Android SDK Components**:
   - Android SDK Platform-Tools
   - Android SDK Build-Tools
   - Android Emulator
   - Android 14.0 (API 34) or latest

## Step 3: Set Environment Variables

Add these lines to your `~/.bashrc` or `~/.zshrc`:

```bash
# Android SDK
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

Apply the changes:
```bash
source ~/.bashrc  # or source ~/.zshrc
```

## Step 4: Create an Android Virtual Device (AVD)

### Via Android Studio GUI:
1. Open Android Studio
2. Click **"More Actions" → "Virtual Device Manager"**
3. Click **"Create Device"**
4. Select a device definition (e.g., **Pixel 6**)
5. Download a system image (e.g., **Android 14.0 Tiramisu**)
6. Configure AVD:
   - Name: `Pixel_6_API_34`
   - Graphics: **Hardware - GLES 2.0**
7. Click **Finish**

### Via Command Line:
```bash
# List available system images
sdkmanager --list | grep system-images

# Install system image (Android 14)
sdkmanager "system-images;android-34;google_apis;x86_64"

# Create AVD
avdmanager create avd -n Pixel_6_API_34 -k "system-images;android-34;google_apis;x86_64" -d "pixel_6"

# List created AVDs
avdmanager list avd
```

## Step 5: Start the Emulator

### Via Android Studio:
1. Open **Virtual Device Manager**
2. Click the **▶️ Play button** next to your AVD

### Via Command Line:
```bash
# List available emulators
emulator -list-avds

# Start emulator
emulator -avd Pixel_6_API_34
```

## Step 6: Test with Expo

1. Start your backend server:
   ```bash
   cd ~/Desktop/Projects/folder/sara_medico/backend
   ./start_backend.sh
   ```

2. Start Expo:
   ```bash
   cd ~/Desktop/Projects/folder/sara_medico/react
   npx expo start
   ```

3. Press `a` in the Expo terminal to open on Android emulator

## Troubleshooting

### Emulator Performance Issues

**Enable Hardware Acceleration (KVM):**
```bash
# Check if KVM is available
egrep -c '(vmx|svm)' /proc/cpuinfo
# Output > 0 means KVM is available

# Check if KVM is installed
kvm-ok

# Install KVM if needed
sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils

# Add your user to KVM group
sudo usermod -aG kvm $USER

# Reboot for changes to take effect
sudo reboot
```

### Emulator Won't Start

**Check system requirements:**
```bash
# Verify ANDROID_HOME is set
echo $ANDROID_HOME

# Check emulator binary
which emulator

# Try starting with more RAM
emulator -avd Pixel_6_API_34 -memory 4096
```

### Network Issues in Emulator

The Android emulator uses `10.0.2.2` to access the host's `localhost`. Your config is already set correctly:

```javascript
// config.js already handles this:
if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api/v1';  // Emulator
}
```

## Quick Reference

```bash
# Start emulator
emulator -avd Pixel_6_API_34

# Start with specific resolution
emulator -avd Pixel_6_API_34 -skin 1080x2400

# List running devices
adb devices

# View emulator logs
adb logcat

# Install APK manually
adb install app-debug.apk

# Restart ADB
adb kill-server && adb start-server
```

## Recommended System Settings

For best performance:
- **RAM allocation**: 4-8GB to AVD
- **Graphics**: Hardware - GLES 2.0
- **Enable KVM** for hardware acceleration
- **Cold boot**: Disable (use quick boot)

---

## Alternative: Continue Using Physical Device

If emulator performance is poor, you can continue using your **physical phone with Expo Go**. I've already updated the config to use your laptop's IP address (`172.25.251.254`), so it should work now!

Just make sure:
1. Phone and laptop are on the **same WiFi**
2. Backend is running on port **8000** (or update `BACKEND_PORT` in `config.js`)
3. Restart the Expo server after config changes
