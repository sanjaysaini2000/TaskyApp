import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskCreateRequest, TaskDetail, TaskUpdateRequest } from '../../../../core/models/task.models';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-detail',
  imports: [CommonModule, TaskFormComponent],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css'
})
export class TaskDetailComponent {
  @Input() task: TaskDetail | null = null;
  @Input() loading = false;
  @Input() saving = false;
  @Output() save = new EventEmitter<TaskUpdateRequest>();
  @Output() addSubtask = new EventEmitter<TaskCreateRequest>();
}
