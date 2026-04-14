# 🚀 TachyonDeck: Quickstart & System Requirements

## 💻 System Requirements
TachyonDeck is built to be tested and deployed quickly across any modern ecosystem.
* **Development Environment:** Requires a standard Node.js environment (v18+) to run the bundler.
* **Mobile Testing:** We highly recommend the free **Expo Go** application (available on iOS and Android app stores) for immediate, over-the-air native device testing.
* **Web Testing:** Any modern browser (such as those running on a standard laptop, Google TV, or smart displays like the Echo Show).

## 🛠️ Step-by-Step Quickstart (Multi-Device Setup)
Want to see the app run on your cell phone, Google TV, and desktop simultaneously? You do **not** need App Store approvals or complex developer accounts! 

*(Make sure your TachyonFlux backend node is running on your network first. See the [TachyonFlux README](https://github.com/xuoxod/tachyonflux) for that quick step).*

**Step 1: Start the UI Bundler (On your Dev Laptop)**
Open a terminal in the `tachyondeck` project directory and start the local environment:
```bash
npm install --legacy-peer-deps
npx expo start
```
*A distinct QR code will immediately appear in your terminal window.*

**Step 2: Connect via Smartphone (iOS or Android)**
1. Download the free **Expo Go** app from your platform's app store.
2. Open Expo Go and tap the "Scan QR Code" option.
3. Point your camera at the terminal on your development laptop. The application will instantly synchronize over your Wi-Fi and resolve natively on your phone screen!

**Step 3: Connect via Smart TV or Smart Display (Web Mode)**
1. In the same terminal where the QR code is displayed, press the **`w`** key on your keyboard. This instructs the bundler to compile a universal Web version of your app.
2. Locate the web URL printed on the screen (usually resembling `http://192.168.1.XX:8081`).
3. Open the built-in browser on your Google TV, secondary laptop, or Echo Show, and type in that exact URL. 

*Presto! You are now securely managing your infrastructure from multiple physical screens at once.*
