# Quick Start Guide 🚀

## ✅ Good News: The Server is Already Running!

Your Flask backend is already running on **http://localhost:5000**

## Step 1: Open the Application

**Option A - Double Click (Easiest)**
1. Go to your desktop
2. Open the folder: `stochasticProject`
3. Find the file: `index.html`
4. **Double-click** `index.html` to open it in your browser

**Option B - From File Explorer**
1. Press `Windows Key + E` to open File Explorer
2. Navigate to: `C:\Users\Akram\OneDrive\Desktop\stochasticProject`
3. Double-click `index.html`

**Option C - Copy-Paste This Path**
1. Open your web browser (Chrome, Edge, Firefox)
2. Copy and paste this into the address bar:
   ```
   file:///C:/Users/Akram/OneDrive/Desktop/stochasticProject/index.html
   ```
3. Press Enter

## Step 2: Use the Application

Once the page opens:

1. **Select a Corpus**
   - Click on any of the colorful cards (e.g., "Romeo & Juliet" 🎭)
   - Wait a moment for it to load

2. **Train the Model**
   - Scroll down a bit
   - Click the purple "Train Model" button 🎓
   - Wait a few seconds (it'll change to "✓ Model Trained")

3. **Generate Text**
   - Scroll down more
   - Click the pink "Generate Text" button 🎲
   - See your Shakespeare-style text appear!

4. **Explore Analysis**
   - Scroll to the bottom
   - Click on "Statistics", "N-Grams", or "Comparison" tabs
   - See cool analytics about the generated text

## 🔄 If You Need to Restart the Server

### Stop the Server
1. Find the terminal/PowerShell window with `python app.py` running
2. Press `Ctrl + C` to stop it

### Start the Server Again
1. Open PowerShell (or Command Prompt)
2. Type these commands:
   ```powershell
   cd C:\Users\Akram\OneDrive\Desktop\stochasticProject
   python app.py
   ```
3. You should see:
   ```
   🚀 Starting Markov Chain API Server...
   📍 Server running on http://localhost:5000
   ✨ Ready to generate text!
   ```

## 🐛 Troubleshooting

### "Cannot connect to server" Error
- **Solution**: Make sure the Python server is running
- Check if you see a window with `python app.py` running
- If not, follow the "Start the Server Again" steps above

### Page Opens But Nothing Works
- **Check**: Is the Flask server running?
- **Fix**: Open a new PowerShell and run:
  ```powershell
  cd C:\Users\Akram\OneDrive\Desktop\stochasticProject
  python app.py
  ```

### "Python is not recognized" Error
- **Solution**: Python might not be installed or not in PATH
- **Fix**: Download Python from python.org and install it
- Make sure to check "Add Python to PATH" during installation

## 📝 Summary

**Current Status:**
- ✅ Server IS running (http://localhost:5000)
- 📂 Files are in: `C:\Users\Akram\OneDrive\Desktop\stochasticProject`
- 🌐 Frontend file: `index.html`

**To use it:**
1. Double-click `index.html`
2. Select a corpus
3. Click "Train Model"
4. Click "Generate Text"
5. Enjoy! 🎉

That's it! The server is already running, you just need to open the HTML file in your browser.
