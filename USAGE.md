# TachyonDeck: Mobile Usage Guide

Welcome to the **TachyonDeck** Usage Guide! This guide is designed to help you quickly set up your secure mobile tunnel. **TachyonDeck** is the companion app to your remote computer (which runs the `TachyonFlux` edge node). 

Using TachyonDeck allows you to securely send commands, view private files, or control smart home devices directly from your iOS or Android phone without opening any dangerous ports on your router.

---

## 📱 Phase 1: Getting the App on Your Phone

You can launch TachyonDeck using the quick web version, or install it as a fully native application. 

### Option A: The Instant Web App (No Install Required)

The fastest way to test your secure tunnel is directly through your mobile browser.

1. Open **Safari** (on iPhone) or **Chrome** (on Android).
2. Type in: `https://rmediatech.com/tachyon`
3. Tap **Launch Secure Deck**.
4. *(Optional but Highly Recommended):* Tap your browser's "Share" button and select **Add to Home Screen**. This lets it operate perfectly as a standalone, full-screen mobile app!

### Option B: The Native App (coming soon)

* **Android:** Tap the "Play Store" button to download it directly.
* **iOS:** Tap the "App Store" button to download.

---

## 🤝 Phase 2: Securely Pairing with Your Server

Before we control anything, we need to introduce your phone to your remote computer.

1. Open the **TachyonDeck** app on your phone.
2. Log in using your secure credentials.
3. Once logged in, tap on the **Connect** button in the center dashboard.
4. Your phone will reach out and silently handshake with your remote `TachyonFlux` node. 
5. When the status indicator turns **Green**, your end-to-end encrypted WebRTC tunnel is locked in.

---

## 🛠️ Phase 3: Actionable Mobile Scenarios

Now that your phone is securely married to your remote computer, here is exactly how to manage things with just a few taps.

### Scenario 1: Restarting a Broken Docker Container

*Goal: A service crashed on your cloud server. You are at an airport with only your phone and need to quickly restart the service.*

1. Tap the **Terminal Dashboard** icon.
2. In the `Command` input, type: `docker`
3. In the `Arguments` input, type: `restart my_web_app`
4. Tap the **Execute** button.

*Result:* The encrypted command flies straight to your server, restarts the application securely, and streams the success output right back to your mobile screen.

### Scenario 2: Controlling an Internal Smart-Home Device

*Goal: You want to trigger an internal home automation, like opening a garage door managed by Home Assistant (`http://192.168.1.150:8123`), but you haven't exposed your home to the internet.*

1. Tap the **Network Proxy** icon.
2. Change the method selector to `POST`.
3. Set the private target URL to: `http://192.168.1.150:8123/api/webhook/open_garage`
4. Tap **Send Secure Payload**.

*Result:* TachyonDeck uses your remote computer as a secure bridge, successfully executing the command on your local Wi-Fi without you physically being there.

### Scenario 3: Checking Secure Log Files

*Goal: Your computer is acting funny, and you want to read a specific protected log file deeply buried on the machine.*

1. Tap the **File Explorer** icon.
2. Simply type the absolute path you wish to view. Example: `/var/log/syslog`
3. Tap **Fetch Securely**.

*Result:* The file contents are grabbed and displayed natively inside your app's code-viewer window for fast, lag-free scrolling.

---

## 🔒 Your Privacy First

- **End-to-End Encrypted:** Not even the middle-man servers can see your passwords or terminal output. 
- **Zero-Ingress Setup:** Hackers can't "attack" your TachyonDeck connection because it never opens listening ports on the web. It uses modern WebRTC peer-to-peer tunneling!
