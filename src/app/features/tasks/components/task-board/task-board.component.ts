import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskCreateRequest, TaskQueryParams, TaskUpdateRequest } from '../../../../core/models/task.models';
import { TasksStore } from '../../state/tasks.store';
import { PaginationComponent } from '../pagination/pagination.component';
import { StatusBannerComponent } from '../status-banner/status-banner.component';
import { TaskDetailComponent } from '../task-detail/task-detail.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskToolbarComponent } from '../task-toolbar/task-toolbar.component';

@Component({
  selector: 'app-task-board',
  imports: [CommonModule, TaskToolbarComponent, TaskFormComponent, TaskListComponent, TaskDetailComponent, PaginationComponent, StatusBannerComponent],
  providers: [TasksStore],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.css'
})
export class TaskBoardComponent implements OnInit {
  readonly store = inject(TasksStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  async ngOnInit(): Promise<void> {
    await this.store.loadTasks();
    this.route.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      if (!id) {
        this.store.selectedTask.set(null);
        return;
      }
      await this.store.loadTaskDetail(id);
    });
  }

  async onQueryChange(patch: Partial<TaskQueryParams>): Promise<void> { await this.store.applyFilters(patch); }
  async onSelectTask(id: string): Promise<void> { await this.router.navigate(['/tasks', id]); await this.store.loadTaskDetail(id); }

  async onCreateTask(payload: TaskCreateRequest): Promise<void> {
    const createdId = await this.store.createTask(payload);
    if (createdId) {
      await this.router.navigate(['/tasks', createdId]);
      await this.store.loadTaskDetail(createdId);
    }
  }

  async onUpdateTask(payload: TaskUpdateRequest): Promise<void> {
    const task = this.store.selectedTask();
    if (!task) return;
    await this.store.updateTask(task.id, payload);
  }

  async onToggle(payload: { id: string; isCompleted: boolean }): Promise<void> { await this.store.setTaskCompletion(payload.id, payload.isCompleted); }

  async onDelete(id: string): Promise<void> {
    await this.store.deleteTask(id);
    if (this.route.snapshot.paramMap.get('id') === id) await this.router.navigate(['/']);
  }

  async onCreateSubtask(payload: TaskCreateRequest): Promise<void> {
    const task = this.store.selectedTask();
    if (!task) return;
    await this.store.createSubtask(task.id, payload);
  }

  async onPageChange(page: number): Promise<void> { await this.store.goToPage(page); }
}
