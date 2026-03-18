import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskSummary } from '../../../../core/models/task.models';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, TaskCardComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  @Input() tasks: TaskSummary[] = [];
  @Input() loading = false;
  @Input() selectedId: string | null = null;
  @Output() select = new EventEmitter<string>();
  @Output() toggle = new EventEmitter<{ id: string; isCompleted: boolean }>();
  @Output() remove = new EventEmitter<string>();
}
