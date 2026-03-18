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
- A local Tasky API instance running at `http://localhost:5000`

### Install dependencies

```bash
npm install
```

### Start the frontend

```bash
npm start
```

The Angular dev server runs on `http://localhost:4200`.

### How local API calls work

The frontend sends requests to `/api/tasks`. During local development, Angular proxies `/api` requests to `http://localhost:5000` using [`proxy.conf.json`](/d:/Sandbox_2026/TaskyApp/proxy.conf.json).

Make sure the backend is running before you start using the UI, otherwise task list and task detail requests will fail.

## Other useful commands

```bash
npm run build
npm test
```

- `npm run build` creates a production build in `dist/`
- `npm test` runs the unit tests with Karma
