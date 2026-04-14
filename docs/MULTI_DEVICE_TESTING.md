# 📱 Multi-Device Testing & Deployment Guide

This guide walks you through deploying the zero-trust architecture across your cross-platform ecosystem (Mobile, Smart TVs, and Web).

## 🚀 Step 1: Start the Backend (On your Target Server/Laptop)

1. Open a terminal on the target edge node and run:

   ```bash
   cd tachyonflux
   go run cmd/tachyon/main.go
   ```

2. Make sure your server is securely communicating with the centralized `https://rmediatech.com/api/signal/tachyon` signaling REST API.

## 💻 Step 2: Compile the Custom Dev Client (On your Dev Laptop)

Because TachyonDeck utilizes true native WebRTC data channels, standard "Expo Go" is insufficient. 

1. On your primary development machine, open your terminal and run:
   ```bash
   cd /home/emhcet/private/projects/desktop/mobile/tachyondeck
   npm install
   eas build --profile development --platform android
   ```
   *(If deploying to iOS, change the platform to `ios`)*
2. Wait for the EAS Cloud Build to finish. It will generate a QR Code.

## 🤳 Step 3: Install & Connect your Mobile Phone (iOS/Android)

1. Connect your smartphone to the **exact same Wi-Fi network** as your Dev Laptop.
2. Open your phone's native **Camera app**, scan the EAS Build QR code from your terminal, and install the `.apk` or `.tar.gz` directly onto your phone.
3. Once the app is installed, go back to your Dev Laptop and start the bundler explicitly targeting your new custom client:
   ```bash
   npx expo start --dev-client
   ```
4. A *new* QR code for the bundler will appear. Scan this *second* QR code with your phone's Camera app, and it will prompt you to open the **TachyonDeck** app you just installed. The JavaScript bundle will download over your LAN and the React Native UI will launch.

## 📺 Step 4: Connect the Google TV & Echo Show (Web Mode)

1. Go back to the terminal on your Dev Laptop that is displaying the `npx expo start` QR code, and press the **`w`** key.
2. Expo will instantly compile and bind a pristine Web API URL (e.g., `http://192.168.1.XX:8081`).
3. Open the **Silk Browser** on your Echo Show, and whatever native web browser you use on your **Google TV**, and enter that exact URL.

*You are now monitoring your secure endpoints seamlessly across four different screens!*
