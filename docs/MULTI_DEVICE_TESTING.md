# 📱 Multi-Device Testing & Deployment Guide

This guide walks you through deploying the zero-trust architecture across your cross-platform ecosystem (Mobile, Smart TVs, and Web).

## 🚀 Step 1: Start the Backend (On your "Other Laptop")

1. Open a terminal on the target computer and run:

   ```bash
   git clone https://github.com/xuoxod/tachyonflux.git
   cd tachyonflux
   go run cmd/tachyon/main.go --turn wss://sfu.rmediatech.com/ws
   ```

   *(Note: Use `sfu.rmediatech.com` if `turn.rmediatech.com` has a certificate mismatch!)*
2. Find out this laptop's local Wi-Fi IP address (e.g., `192.168.1.50`). You will need this for the mobile app to securely connect over your local area network.

## 💻 Step 2: Start the UI Bundler (On your Dev Laptop)

On your primary development machine, open your terminal and run:

```bash
cd /home/emhcet/private/projects/desktop/mobile/tachyondeck
npm install --legacy-peer-deps
npx expo start
```

*A giant QR code will prominently appear in your terminal window.*

## 🤳 Step 3: Connect your Android Phone

1. Connect your Android phone to the **exact same Wi-Fi network** as your Dev Laptop.
2. Download the free **Expo Go** app from the Google Play Store.
3. Open Expo Go, tap **Scan QR Code**, and point your camera at the QR code on your Dev Laptop.
4. The JavaScript bundle will download over your LAN and the React Native UI will launch.

## 📺 Step 4: Connect the Google TV & Echo Show (Web Mode)

1. Go back to the terminal on your Dev Laptop that is displaying the QR code, and firmly press the **`w`** key.
2. Expo will instantly compile and bind a pristine Web URL (e.g., `http://192.168.1.XX:8081`).
3. Open the **Silk Browser** on your Echo Show, and whatever native web browser you use on your **Google TV**, and enter that exact URL.

*You are now monitoring your secure endpoints seamlessly across four different screens!*
