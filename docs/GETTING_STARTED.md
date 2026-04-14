# 🚀 TachyonDeck: Quickstart & Custom Build Guide

Welcome to the definitive setup guide for **TachyonDeck**. 

Because TachyonDeck utilizes true **WebRTC** for zero-latency, Peer-to-Peer encrypted communication with your backend edge nodes, it requires native C++ and Java/Swift bindings. **Standard "Expo Go" cannot be used.** Instead, we must compile a **Custom Development Client** (a dedicated version of the app built specifically for your devices).

This guide is designed to be universally applicable, whether you are on Windows, macOS, or Linux, and whether you are deploying to an Android device or an iPhone. 

---

## 💻 System Requirements

*   **Node.js**: v18 or newer installed on your development machine.
*   **Expo Account**: A free account at [expo.dev](https://expo.dev/) (Required for frictionless cloud builds).
*   **Target Device**: A physical iOS/Android smartphone, or a desktop emulator.

---

## 🛠️ Build Path A: Cloud Build via EAS (Highly Recommended)

The Expo Application Services (EAS) cloud build approach is the easiest, most universally compatible method. It offloads the heavy lifting of compiling native code (which normally requires gigabytes of Android Studio/Xcode installations) to Expo's free cloud servers.

### Step 1: Install the EAS CLI
Open a terminal on your development machine inside the `tachyondeck` directory and install the global Expo build tool:
```bash
npm install -g eas-cli
```

### Step 2: Authenticate with Expo
Log in using your free Expo account credentials:
```bash
eas login
```

### Step 3: Initialize the Cloud Build
Command the cloud server to compile your custom WebRTC-enabled development client. 

**For Android:**
```bash
eas build --profile development --platform android
```
**For iOS (Requires an Apple Developer Account):**
```bash
eas build --profile development --platform ios
```

*Note: The platform will prompt you to automatically create an EAS project or generate a Keystore/Provisioning Profile. Answer **yes** to all default prompts. The build typically takes 10–15 minutes.*

### Step 4: Install the App on Your Device
Once the cloud build finishes, your terminal will output a **Build Link** and a **QR Code**.
1. Open your phone's default Camera app.
2. Scan the QR code displayed in your terminal.
3. Download the resulting `.apk` (Android) or `.tar.gz` (iOS) file and install it directly onto your device.

---

## 🛠️ Build Path B: Local Build (Advanced Users)

If you strictly prefer to build the application locally and have the requisite SDKs already installed on your machine, you can bypass the cloud entirely.

### Requirements for Local Builds:
*   **Android:** [Android Studio](https://developer.android.com/studio) installed, with `ANDROID_HOME` configured in your environment variables.
*   **iOS:** A Mac computer with [Xcode](https://developer.apple.com/xcode/) installed.

### Execution:
Simply run the following command to compile the native code locally and push it to your plugged-in device or running emulator:

**For Android:**
```bash
npx expo run:android
```
**For iOS:**
```bash
npx expo run:ios
```

---

## 🔗 Connecting the CLI to the App

No matter which build path you chose (Cloud or Local), you now have the TachyonDeck Custom Development Client installed on your device. It's time to connect it to your local code so you can develop in real-time.

### Step 1: Start the Development Server
On your development machine, start the Metro Bundler and explicitly flag it to use your newly installed dev client:
```bash
npx expo start --dev-client
```

### Step 2: Sync Your Device
1. A new QR code will appear in your terminal.
2. Open the **Camera app** on your phone (do *not* use Expo Go).
3. Scan the QR code. It will prompt you to open the link in the **TachyonDeck** app you just installed.
4. Tap the link. The app will open, bundle the JavaScript assets over your local Wi-Fi, and launch!

*Presto! You are now securely managing your infrastructure with full Native WebRTC support!*
