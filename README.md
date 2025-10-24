🚀 Hey there! Check out the Universal API Client!

Seriously, this thing is awesome. It’s a totally free and super-fast API client that works right in your browser! You can test all your requests—GET, POST, PUT, DELETE, PATCH, everything!—analyze JSON, and handle headers or authentication easily. Forget those big, heavy apps like Postman or Insomnia. This is your quick and pain-free way to test APIs and squash bugs!



✨ Features You’ll Love (Why it's cool!)

🌐 Yep, It Does All the Methods: Full support for every common request type. You won't miss a thing!

🛠️ Easy-Peasy Setup: Setting up your request URL, parameters, and headers is a total breeze. It’s super intuitive.

📝 Flexible Payloads: Need to send data? We've got two great ways:

- form-data: Perfect for web forms. You can send text fields and even upload files!

- raw: Gives you complete control for sending JSON, XML, or any text.

💡 Smart JSON Helper: We validate your JSON live while you type! Plus, you can pretty-print it instantly or Import a file from your computer. So handy!

📊 See Everything: Get a quick look at the HTTP Status, how long it took (Time), and the Size of the response. We even color-code the body and separate the Headers and Cookies—nice, right?

📐 Customize the View: Drag the panels to focus on the request or the response. It’s all flexible!

🎨 Your Style, Your Colors: Tweak the colors for syntax highlighting and the UI itself to make it yours!

🚀 How to Fire Off an API Call (User Guide)

Using this tool is super simple, honestly. Here’s how you execute your first API request:

1. Tell It What to Hit

Start by typing the API endpoint URL into the main bar. Then, just use the dropdown on the left to select the right method (GET, POST, etc.).

2. Get Your Details Right

Use the tabs below the URL bar to configure everything else:

- **Params:** Add your query parameters here; they’ll automatically get slapped onto the end of the URL.
- **Auth:** If you need a token, drop that Bearer Token right here. Easy!
- **Headers:** Got any special headers your API requires? Add them here.

3. Build the Data (if you need to)

For requests like POST or PUT, the Body tab is where you define the payload:

- **form-data:** Great for submitting form data and files.
- **raw:** Use this for plain JSON or other data types. Don't forget to use the Format button if your JSON gets messy!

4. See What You Got!

Click the Send button, and bam! The response appears instantly on the right.

- **Metrics:** Quickly check the status code, time, and size.
- **Body Tab:** Your response body lives here, and if it's JSON, it's already beautifully formatted and color-coded.
- **Headers/Cookies:** Easily inspect all the stuff the server sent back in the headers and cookies.

⚙️ Installation & Setup (How to get started)

Since this is a web-based tool, there's no install needed for just using it!

#### For Regular Users (The easy way)

Simply open the `index.html` file in any modern web browser. That’s seriously it!

#### For Developers (Want to mess with the code?)

If you plan to tweak the source code and run it locally, you'll need to follow the standard development steps. You'll need Node.js and npm installed, by the way!

1.  **Grab the Code:**
    ```bash
    git clone https://github.com/abdul-jabbar-dev/universal_api_client.git
    cd universal_api_client
    ```

2.  **Install the Stuff:**
    This installs the local development server:
    ```bash
    npm install
    ```

3.  **Fire Up the Server:**
    To run the project locally, kick off the development server:
    ```bash
    npm start
    ```

4.  Open your browser and navigate to the local address it gives you (usually something like `http://localhost:3000`). Have fun!


🛠️ Tech Stack (What's under the hood?)

This project was built using some great modern tools:

- **React:** For building that nice, snappy UI.
- **TypeScript:** Keeps our code clean and reliable with static typing.
- **Tailwind CSS:** For super-fast, utility-first styling.
- **No messy Build Tools:** We skipped the heavy bundlers like Webpack or Vite! It runs straight off ES modules and an importmap, which is why it's quick and lightweight!

📁 File Structure (Where everything lives)

```
/
├── components/         # All our reusable React parts live here!
│   ├── icons/          # SVG icon components
│   ├── RequestForm.tsx # For building the request
│   ├── ResponseDisplay.tsx # For showing the response
│   └── SettingsModal.tsx # The little modal for settings
├── App.tsx             # The main component that runs the whole show
├── index.html          # The entry point of the app
├── index.tsx           # Where React gets mounted to the page
├── types.ts            # All the TypeScript types
└── README.md           # This very document you're reading!
```
