# TaskyFrontend

TaskyFrontend is an Angular application for managing tasks through the Tasky API. It provides a single-screen task workspace where you can create tasks, browse paginated results, filter and sort the list, inspect task details, update completion state, and add subtasks.

## What the application does

- Creates new tasks with title, description, due date, and priority
- Lists tasks with paging support
- Filters tasks by search text, completion state, priority, and due date range
- Sorts tasks by created date, due date, priority, or title
- Opens a selected task to view and edit its details
- Marks tasks as complete or incomplete
- Deletes tasks
- Creates subtasks under an existing task

## Tech stack

- Angular 20
- Angular Signals for local state management
- HTTP client integration with a backend API
- Angular dev proxy for local API access

## Run locally

### Prerequisites

- Node.js 20 or later recommended
- npm
- .NET 8 SDK

### 1. Install frontend dependencies

From the `TaskyApp` folder, run:

```bash
npm install
```

### 2. Start the backend API

This frontend depends on the `TaskyApi` project running locally on `http://localhost:5000`.

Open a second terminal and run:

```bash
cd d:\Sandbox_2026\TaskyApi
dotnet restore
dotnet run
```

The API should start on:

- `http://localhost:5000`
- `https://localhost:7000`

You can verify it is running by opening:

- `http://localhost:5000/swagger`

If the API is not running, the frontend will show proxy errors such as `ECONNREFUSED` for `/api/tasks`.

### 3. Start the frontend

In the `TaskyApp` folder, run:

```bash
npm start
```

The Angular dev server runs on `http://localhost:4200`.

### 4. Open the application

Open your browser and go to:

- `http://localhost:4200`

### How local API calls work

The frontend sends requests to `/api/tasks`. During local development, Angular proxies `/api` requests to `http://localhost:5000` using [`proxy.conf.json`](/d:/Sandbox_2026/TaskyApp/proxy.conf.json).

### Troubleshooting

- If you see `http proxy error` or `ECONNREFUSED`, the backend is not running on `http://localhost:5000`
- If `dotnet run` fails because the database is not initialized, run `dotnet ef database update` inside `d:\Sandbox_2026\TaskyApi`
- If port `5000` is already in use, update the backend port and the proxy target in [`proxy.conf.json`](/d:/Sandbox_2026/TaskyApp/proxy.conf.json)

## Other useful commands

```bash
npm run build
npm test
```

- `npm run build` creates a production build in `dist/`
- `npm test` runs the unit tests with Karma
