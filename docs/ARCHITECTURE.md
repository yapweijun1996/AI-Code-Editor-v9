# Application Architecture

This document provides a high-level overview of the application's architecture. For a more detailed guide on the project structure, development workflow, and how to contribute, please see the **[Contributing Guide](./CONTRIBUTING.md)**.

## Core Philosophy: Client-Centric Design

The application is architected to be **secure and frontend-heavy**. The majority of the logic, including all file system interactions, the editor, and the AI agent, runs directly in the browser. A minimal backend is used only for tasks that the browser's sandbox cannot perform.

## Component Overview

*   **Frontend**: A single-page application built with vanilla JavaScript, HTML, and CSS. It uses the Monaco Editor and manages all core application logic.
*   **Backend**: A lightweight Node.js/Express server that serves static files and provides sandboxed execution for terminal commands and URL fetching.
*   **AI Agent**: The Gemini agent logic is managed entirely on the client-side in `frontend/js/gemini_chat.js`, which defines all available tools and orchestrates the interaction with the model.

## End-to-End Workflow

This diagram illustrates the primary interaction flow between the user, frontend, backend, and the Gemini AI.

```mermaid
sequenceDiagram
    participant User
    participant Frontend (Browser) as FE
    participant FileSystem API as FS
    participant Backend (Node.js) as BE
    participant Gemini AI as AI

    User->>FE: Enters prompt (e.g., "Read app.js and tell me what it does")
    FE->>AI: Sends user prompt

    alt Client-Side Tool Execution (e.g., read_file)
        AI-->>FE: Requests tool call: read_file('app.js')
        FE->>FS: Uses File System Access API to get file handle
        FS-->>FE: Returns file handle
        FE->>FS: Reads file content
        FS-->>FE: Returns file content
        FE-->>AI: Sends file content as tool response
    else Backend Tool Execution (e.g., run_terminal_command)
        AI-->>FE: Requests tool call: run_terminal_command('ls -l')
        FE->>BE: POST /api/execute-tool with command
        BE->>BE: Spawns process with node-pty
        BE-->>FE: Returns command output (JSON)
        FE-->>AI: Sends command output as tool response
    end

    AI->>AI: Processes tool result and formulates answer
    AI-->>FE: Streams final text response to user
    FE->>User: Displays formatted AI response in chat
```

## State Management

The application's state, including API keys and the handle to the open project folder, is persisted in the browser's **IndexedDB**. This allows for seamless session restoration between visits.
