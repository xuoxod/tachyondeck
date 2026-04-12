# TachyonDeck: Step-by-Step Usage Guide

This guide will take you from starting `TachyonDeck` on your mobile device to securely executing your first proxied request to your private network.

---

## Step 1: Getting the App

You have two ways to execute TachyonDeck on your mobile device:

### Option A: The Direct Web App (PWA)
1. Open your phone's web browser and go to **[rmediatech.com/tachyon](https://rmediatech.com/tachyon)**.
2. Scroll to the **TachyonDeck** card and tap the **"Launch PWA directly"** button. This opens the deck interface immediately.
3. *Optional:* You can use the "Add to Home Screen" option in iOS Safari or Google Chrome to treat it as a native app instance.

### Option B: The Native App
* **Android:** Tap the "Play Store" button to download from the Google Play Store.
* **iOS:** Tap the "App Store" button for the iOS build.

---

## Step 2: The Mobile Handshake

Now that your app is open, you need to connect to an edge node (a machine running `tachyonflux`):
1. **Authenticate:** Log in using your standard RMediaTech account credentials inside the TachyonDeck app. 
2. **Navigate to Edge Nodes:** The `rmediatech` signaling server automatically links your authenticated account to any running `tachyonflux` instances associated with you.
3. **Establish Tunnel:** Tap **Connect** next to your active node. 
4. The app negotiates an end-to-end encrypted WebRTC DataChannel directly to your edge machine. The cloud infrastructure steps out of the loop completely.

---

## Step 3: Executing Commands (Examples)

Once connected, your phone has a direct, encrypted pipeline to the machine running `tachyonflux`, no matter what networks you are on.

### Example A: Remote Terminal Execution
Need to restart a docker container on your server while away from your laptop?
1. Open the **Terminal** view in TachyonDeck.
2. Type your bash command: `docker restart my_web_app`
3. Hit Send. The command is run securely by `tachyonflux` locally, and the stdout streams directly to your mobile screen.

### Example B: Proxied HTTP Request (Internal Webcams / IoT)
Suppose you have a webcam or a local admin dashboard at `http://192.168.1.50:80` on your home network, which is safely blocked from the public internet.
1. Open the **Network Proxy** view in TachyonDeck.
2. Enter the exact target local URL: `http://192.168.1.50`
3. Set Method: `GET`
4. Send the request. `tachyonflux` safely fetches the internal network page and returns the stream through the robust WebRTC tunnel.

### Example C: Home Assistant Webhook
Suppose your Home Assistant is running on `127.0.0.1:8123` on the same machine as `flux`.
1. Navigate to the **Macros** manager.
2. Set the target HTTP endpoint: `http://127.0.0.1:8123/api/webhook/secret_hook`
3. Set Method: `POST`, and define a JSON body/payload if necessary.
4. Save the Macro. Whenever you tap that macro button, you securely trigger an internal smart-home automation. No port forwarding required.
