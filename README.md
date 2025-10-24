# Universal API Client

A powerful, free, and lightweight online API client that runs entirely in your browser. Test GET, POST, PUT, DELETE, and PATCH requests, analyze JSON responses, manage headers, authentication, and payloads with an intuitive, resizable interface. A perfect alternative to heavy desktop applications like Postman or Insomnia for quick API testing and debugging.

![Universal API Client Screenshot](https://i.imgur.com/your-screenshot.png) <!-- It's recommended to add a screenshot of the app here -->

## ✨ Features

- **All HTTP Methods:** Full support for `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.
- **Intuitive Request Builder:** Easily configure URL, query parameters, headers, and authentication.
- **Bearer Token Auth:** A dedicated 'Auth' tab simplifies adding `Authorization` headers.
- **Flexible Body Editor:**
  - **`form-data`**: Send text fields and upload files.
  - **`raw`**: Full control for JSON, XML, or any text-based payload.
- **Smart JSON Tools:**
  - Live JSON validation as you type.
  - One-click JSON formatter for readability.
  - Import JSON content directly from a local `.json` file.
- **Detailed Response Viewer:**
  - Key metrics at a glance: HTTP Status, Time, and Size.
  - Separate tabs for Body, Headers, and Cookies.
  - Customizable syntax highlighting for JSON responses.
  - Download the response body to a file with an appropriate extension.
- **Resizable Layout:** Adjust the request and response panels to focus on what you need.
- **Highly Customizable:**
  - Change colors for JSON syntax highlighting and UI elements.
  - Adjust font sizes for input and response areas.
  - All settings are saved locally in your browser for a consistent experience.
- **Zero Installation:** Runs entirely in the browser. No backend, no accounts, no setup required.

## 🚀 How It Works (User Guide)

This tool is designed to be straightforward. Follow these steps to make your first API call.

#### 1. Set Your Request
Start by entering the API endpoint URL into the main input field. Use the dropdown on the left to select your desired HTTP method (`GET`, `POST`, etc.).

#### 2. Add Details: Params, Headers & Auth
Use the tabs below the URL bar to configure your request:
- **Params:** Add query parameters that will be automatically appended to the URL.
- **Auth:** For APIs requiring authentication, you can easily add a Bearer Token. The client automatically creates the correct `Authorization` header.
- **Headers:** Add any custom HTTP headers required by your API.

#### 3. Build Your Request Body
For methods like `POST` or `PUT`, the **Body** tab allows you to define the payload:
- **form-data:** Ideal for submitting web forms. You can add key-value pairs for text and attach files directly from your computer.
- **raw:** A powerful text area for sending raw data. It defaults to JSON but can be used for XML, plaintext, etc.
  - **JSON Helper:** When working with JSON, the editor will show a validation error if your syntax is incorrect. The **Format** button will automatically pretty-print your JSON for better readability. Use the **Import** button to load a JSON file from your machine.

#### 4. Analyze the Response
Click the **Send** button to execute the request. The response will appear instantly in the right-hand panel.
- **Metrics:** See the HTTP status code, response time, and payload size.
- **Body Tab:** The response body is displayed here. If it's JSON, it will be automatically formatted and color-coded. Use the **Download** button to save it.
- **Headers Tab:** Inspect the HTTP headers returned by the server.
- **Cookies Tab:** View any cookies that were set by the response.

## ⚙️ Installation & Setup

As a web-based tool, there is no installation needed for general use.

#### For Users
Simply open the `index.html` file in any modern web browser.

#### For Developers
If you want to modify the source code, you'll need a local development server to handle the ES modules correctly.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/universal-api-client.git
    cd universal-api-client
    ```
2.  **Run a local server:**
    A simple way is to use a tool like `live-server` or Python's built-in HTTP server.
    - **Using `npx` (no installation needed):**
      ```bash
      npx serve .
      ```
    - **Using Python 3:**
      ```bash
      python -m http.server
      ```
3.  Open your browser and navigate to the local address provided by the server (e.g., `http://localhost:3000` or `http://localhost:8000`).

## 🛠️ Technology Stack

- **React:** For building the user interface.
- **TypeScript:** For static typing and improved code quality.
- **Tailwind CSS:** For styling the application with a utility-first approach.
- **No Build Tools:** The project uses `es-modules` and an `importmap` to run directly in the browser without needing a bundler like Webpack or Vite, keeping it simple and lightweight.

## 📁 File Structure

```
/
├── components/         # Contains all React components
│   ├── icons/          # SVG icon components
│   ├── RequestForm.tsx # Component for building the HTTP request
│   ├── ResponseDisplay.tsx # Component for showing the API response
│   └── SettingsModal.tsx # Modal for customizing colors and fonts
├── App.tsx             # Main application component, manages state
├── index.html          # The entry point of the application
├── index.tsx           # Mounts the React application to the DOM
├── types.ts            # TypeScript type definitions
└── README.md           # This documentation file
```
"# universal_api_client" 
