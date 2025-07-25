# AI-Powered Browser-Based Code Editor

This project is a sophisticated, browser-based code editor that integrates a powerful AI agent (Google's Gemini) to assist with a wide range of coding tasks. The application is designed with a secure, client-centric architecture, ensuring that all file system operations run directly in the browser, providing a seamless and safe user experience.

---

## Core Architecture

The editor's architecture has been streamlined to use a local Node.js server, simplifying setup and management.

*   **Local Node.js Server**: A lightweight `Express` server (`index.js`) now serves the `frontend` assets, making the application accessible at `http://localhost:3000`. This approach provides a stable and consistent runtime environment.

*   **Client-Centric File Operations**: All core logic and file system interactions remain securely on the client-side in `frontend/js/main.js`. The application uses the browser's native **File System Access API**, ensuring that all file operations are handled directly and safely by the user's browser.

*   **Stateful Experience with IndexedDB**: The application continues to use IndexedDB to persist user data locally, including API keys and the handle to the last used project directory.

---

## Features

*   **Monaco Editor**: Integrates the same powerful editor used in VS Code, providing a rich and familiar coding environment with syntax highlighting and advanced editing features.
*   **Gemini AI Agent**: A stateful AI assistant powered by the **Google Gemini API** (`v1beta`) and its official tool-calling capabilities. This ensures a reliable and predictable conversational loop:
    1.  **Tool Declaration**: The frontend formally declares its available functions to the Gemini API.
    2.  **Function Call**: The AI responds with a structured `functionCall` when it needs to use a tool.
    3.  **Frontend Execution**: The browser executes the requested function (e.g., reading a file).
    4.  **Function Response**: The result is sent back to the AI in a formal `functionResponse`.
    5.  **Final Answer**: The AI provides a natural-language response to the user.
*   **Resizable Panels**: A flexible UI with resizable panels for the file tree, editor, and AI chat.
*   **Intelligent Tab and File Management**:
    *   **Path-Based Identification**: Open files are tracked by their unique file path, which prevents the creation of duplicate tabs when a file is accessed multiple times.
    *   **Automatic Focus**: When the AI uses a tool like `read_file` or `rewrite_file`, the application automatically opens the relevant file or switches to its existing tab, providing a seamless workflow.
    *   **Stateful UI**: The file tree and open tabs are rendered dynamically, providing a clear and consistent view of the project state.
*   **Automatic File Opening**: When the AI agent reads, creates, or rewrites a file, it is automatically opened or focused, providing immediate visibility into the agent's actions.
*   **AST-Powered Code Analysis**: The AI can use the `analyze_code` tool to parse JavaScript code into an Abstract Syntax Tree (AST), enabling a deep, structural understanding of the code for more precise refactoring and analysis.
*   **Multimodal Input**: The AI chat supports both text and image uploads, allowing you to ask questions about visual content.
*   **Multiple Agent Modes**: Switch between different AI modes (`Code`, `Plan`, `Search`) to tailor the agent's behavior to your specific needs.

---

## Getting Started

Running the application is now managed by simple, powerful scripts for all major operating systems.

### Prerequisites

*   [Node.js](https://nodejs.org/) (which includes `npm`) installed on your system.

### Installation and Management

The application includes interactive scripts to handle all aspects of installation, execution, and process management.

1.  **Launch the Management Script**:
    *   **On Windows**: Double-click `app.bat`.
    *   **On macOS / Linux**: First, make the script executable by running `chmod +x ./app.sh`, then run it with `./app.sh`.

2.  **Install Dependencies (First-Time Setup)**:
    *   From the script's main menu, select **[1] Install Dependencies**. This will download the necessary `npm` packages and install `pm2` globally.

3.  **Start the Server**:
    *   From the menu, select **[2] Start Server**. This will launch the application using `pm2`.

4.  **Access the Application**:
    *   Open your web browser (e.g., Chrome, Edge) and navigate to **`http://localhost:3000`**.

The management scripts also provide options to **stop**, **restart**, and **monitor** the server, as well as **enable/disable auto-startup** on system reboot.

### Configuration

1.  **Add API Keys**:
    *   In the AI Chat panel, expand the "API Key Settings" section.
    *   Enter one or more Google Gemini API keys, separated by new lines.
    *   Click "Save Keys". The keys are stored securely in your browser's IndexedDB.

2.  **Open a Project**:
    *   Click the "Open Project Folder" button.
    *   Select a local directory to work with. The application will remember this folder for future sessions.

---

## AST-Powered Code Analysis Workflow

```mermaid
sequenceDiagram
    participant User
    participant Frontend (Browser)
    participant AI Agent (Gemini)
    participant Acorn (AST Parser)

    User->>Frontend (Browser): "Refactor the 'getUser' function"
    Frontend (Browser)->>AI Agent (Gemini): Sends prompt
    
    AI Agent (Gemini)-->>Frontend (Browser): Request tool call: analyze_code('app.js')
    
    Frontend (Browser)->>Acorn (AST Parser): Parses content of app.js
    Acorn (AST Parser)-->>Frontend (Browser): Returns AST
    
    Frontend (Browser)->>Frontend (Browser): Extracts functions, classes, etc.
    Frontend (Browser)-->>AI Agent (Gemini): Sends analysis result
    
    AI Agent (Gemini)-->>Frontend (Browser): Request tool call: rewrite_file(...)
    Frontend (Browser)->>Frontend (Browser): Executes file rewrite
    Frontend (Browser)-->>AI Agent (Gemini): Sends success message
    
    AI Agent (Gemini)-->>Frontend (Browser): "I have refactored the function."
    Frontend (Browser)-->>User: Displays final answer
```

---

