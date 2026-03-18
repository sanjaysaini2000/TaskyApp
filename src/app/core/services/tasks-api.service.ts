import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CompleteTaskRequest,
  PagedResult,
  TaskCreateRequest,
  TaskDetail,
  TaskQueryParams,
  TaskSummary,
  TaskUpdateRequest
} from '../models/task.models';

const API_BASE = '/api/tasks';

@Injectable({ providedIn: 'root' })
export class TasksApiService {
  constructor(private readonly http: HttpClient) {}

  getTasks(query: TaskQueryParams): Observable<PagedResult<TaskSummary>> {
    let params = new HttpParams()
      .set('page', query.page)
      .set('pageSize', query.pageSize)
      .set('sortBy', query.sortBy)
      .set('order', query.order);

    if (query.search.trim()) params = params.set('search', query.search.trim());
    if (query.isCompleted !== null) params = params.set('isCompleted', query.isCompleted);
    if (query.priority !== null) params = params.set('priority', query.priority);
    if (query.dueBefore) params = params.set('dueBefore', query.dueBefore);
    if (query.dueAfter) params = params.set('dueAfter', query.dueAfter);

    return this.http.get<PagedResult<TaskSummary>>(API_BASE, { params });
  }

  getTaskById(id: string): Observable<TaskDetail> {
    return this.http.get<TaskDetail>(`${API_BASE}/${id}`);
  }

  createTask(payload: TaskCreateRequest): Observable<TaskDetail> {
    return this.http.post<TaskDetail>(API_BASE, payload);
  }

  updateTask(id: string, payload: TaskUpdateRequest): Observable<TaskDetail> {
    return this.http.put<TaskDetail>(`${API_BASE}/${id}`, payload);
  }

  setTaskCompletion(id: string, isCompleted: boolean): Observable<TaskDetail> {
    const payload: CompleteTaskRequest = { isCompleted };
    return this.http.patch<TaskDetail>(`${API_BASE}/${id}/complete`, payload);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/${id}`);
  }

  createSubtask(parentId: string, payload: TaskCreateRequest): Observable<TaskDetail> {
    return this.http.post<TaskDetail>(`${API_BASE}/${parentId}/subtask`, payload);
  }
}
