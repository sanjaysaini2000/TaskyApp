import { computed, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  TaskCreateRequest,
  TaskDetail,
  TaskQueryParams,
  TaskSummary,
  TaskUpdateRequest
} from '../../../core/models/task.models';
import { TasksApiService } from '../../../core/services/tasks-api.service';

@Injectable()
export class TasksStore {
  private readonly defaults: TaskQueryParams = {
    search: '',
    isCompleted: null,
    priority: null,
    dueBefore: null,
    dueAfter: null,
    page: 1,
    pageSize: 8,
    sortBy: 'createdAt',
    order: 'asc'
  };

  readonly query = signal<TaskQueryParams>({ ...this.defaults });
  readonly tasks = signal<TaskSummary[]>([]);
  readonly selectedTask = signal<TaskDetail | null>(null);
  readonly isLoadingList = signal(false);
  readonly isLoadingDetail = signal(false);
  readonly isSaving = signal(false);
  readonly totalCount = signal(0);
  readonly totalPages = signal(1);
  readonly currentPage = signal(1);
  readonly statusMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly hasTasks = computed(() => this.tasks().length > 0);

  constructor(private readonly api: TasksApiService) {}

  async loadTasks(): Promise<void> {
    this.isLoadingList.set(true);
    this.errorMessage.set(null);
    try {
      const result = await firstValueFrom(this.api.getTasks(this.query()));
      this.tasks.set(result.items);
      this.totalCount.set(result.totalCount);
      this.totalPages.set(Math.max(result.totalPages, 1));
      this.currentPage.set(result.page);
    } catch (error) {
      this.errorMessage.set(this.readError(error, 'Failed to load tasks.'));
    } finally {
      this.isLoadingList.set(false);
    }
  }

  async loadTaskDetail(id: string): Promise<void> {
    this.isLoadingDetail.set(true);
    this.errorMessage.set(null);
    try {
      const task = await firstValueFrom(this.api.getTaskById(id));
      this.selectedTask.set(task);
    } catch (error) {
      this.selectedTask.set(null);
      this.errorMessage.set(this.readError(error, 'Failed to load task details.'));
    } finally {
      this.isLoadingDetail.set(false);
    }
  }

  setQueryPatch(patch: Partial<TaskQueryParams>): void {
    this.query.set({ ...this.query(), ...patch });
  }

  async applyFilters(patch: Partial<TaskQueryParams>): Promise<void> {
    this.setQueryPatch({ ...patch, page: 1 });
    await this.loadTasks();
  }

  async goToPage(page: number): Promise<void> {
    const totalPages = this.totalPages();
    if (page < 1 || page > totalPages) return;
    this.setQueryPatch({ page });
    await this.loadTasks();
  }

  async createTask(payload: TaskCreateRequest): Promise<string | null> {
    this.isSaving.set(true);
    this.errorMessage.set(null);
    try {
      const created = await firstValueFrom(this.api.createTask(payload));
      this.statusMessage.set('Task created.');
      await this.loadTasks();
      return created.id;
    } catch (error) {
      this.errorMessage.set(this.readError(error, 'Failed to create task.'));
      return null;
    } finally {
      this.isSaving.set(false);
    }
  }

  async updateTask(id: string, payload: TaskUpdateRequest): Promise<void> {
    this.isSaving.set(true);
    this.errorMessage.set(null);
    try {
      await firstValueFrom(this.api.updateTask(id, payload));
      this.statusMessage.set('Task updated.');
      await Promise.all([this.loadTasks(), this.loadTaskDetail(id)]);
    } catch (error) {
      this.errorMessage.set(this.readError(error, 'Failed to update task.'));
    } finally {
      this.isSaving.set(false);
    }
  }

  async setTaskCompletion(id: string, isCompleted: boolean): Promise<void> {
    this.errorMessage.set(null);
    try {
      await firstValueFrom(this.api.setTaskCompletion(id, isCompleted));
      await this.loadTasks();
      if (this.selectedTask()?.id === id) await this.loadTaskDetail(id);
    } catch (error) {
      this.errorMessage.set(this.readError(error, 'Failed to update task completion.'));
    }
  }

  async deleteTask(id: string): Promise<void> {
    this.errorMessage.set(null);
    try {
      await firstValueFrom(this.api.deleteTask(id));
      this.statusMessage.set('Task deleted.');
      await this.loadTasks();
      if (this.selectedTask()?.id === id) this.selectedTask.set(null);
    } catch (error) {
      this.errorMessage.set(this.readError(error, 'Failed to delete task.'));
    }
  }

  async createSubtask(parentId: string, payload: TaskCreateRequest): Promise<void> {
    this.isSaving.set(true);
    this.errorMessage.set(null);
    try {
      await firstValueFrom(this.api.createSubtask(parentId, payload));
      this.statusMessage.set('Subtask created.');
      await Promise.all([this.loadTasks(), this.loadTaskDetail(parentId)]);
    } catch (error) {
      this.errorMessage.set(this.readError(error, 'Failed to create subtask.'));
    } finally {
      this.isSaving.set(false);
    }
  }

  clearMessages(): void {
    this.statusMessage.set(null);
    this.errorMessage.set(null);
  }

  private readError(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      return (error.error?.detail as string | undefined) ?? fallback;
    }
    return fallback;
  }
}
