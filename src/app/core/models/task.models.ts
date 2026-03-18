export interface TaskSummary {
  id: string;
  title: string;
  isCompleted: boolean;
  dueDate: string | null;
  priority: number;
  createdAt: string;
  updatedAt: string | null;
  parentTaskId: string | null;
}

export interface TaskDetail extends TaskSummary {
  description: string | null;
  subtasks: TaskSummary[];
}

export interface TaskCreateRequest {
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: number;
}

export interface TaskUpdateRequest {
  title: string;
  description: string | null;
  isCompleted: boolean;
  dueDate: string | null;
  priority: number;
}

export interface CompleteTaskRequest {
  isCompleted: boolean;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
}

export interface TaskQueryParams {
  search: string;
  isCompleted: boolean | null;
  priority: number | null;
  dueBefore: string | null;
  dueAfter: string | null;
  page: number;
  pageSize: number;
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'title';
  order: 'asc' | 'desc';
}
