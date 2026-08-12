# 🙏 Maala Counter

A dedicated digital maala counter designed for Dadi. 

**Critical Feature**: The physical **Volume Up** button increments the maala count. No confusing on-screen buttons. It works perfectly without any "maximum volume limit" issues because it is built as a Native Android App (via Capacitor).

## How to Get the `.apk` File (Zero Install Method)

You do **not** need Android Studio or Java installed on your computer to build the app! I have configured a **GitHub Actions Cloud Build** for you.

### Steps to Build Online:
1. Go to your GitHub account and create a new **Public** repository (e.g., named `Maala-Counter`).
2. Upload all the files in this folder to that GitHub repository. You can do this by dragging and dropping them into the GitHub website, or by using git commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/Maala-Counter.git
   git push -u origin main
   ```
3. Once the code is uploaded, go to the **Actions** tab on your GitHub repository page.
4. You will see a workflow running called **"Build APK"**. 
5. Wait about 2-3 minutes for it to finish.
6. Click on the completed workflow run, scroll down to the **Artifacts** section, and download **`Maala-Counter-APK.zip`**.
7. Extract the ZIP to get your `app-debug.apk` file!

### Transfer to Phone
1. Send the `app-debug.apk` file to Dadi's Android phone (e.g., via WhatsApp, Email, or USB cable).
2. Tap the file on her phone to install it.
3. Android may ask you to "Allow installing unknown apps" from that source. Enable it for this installation.
