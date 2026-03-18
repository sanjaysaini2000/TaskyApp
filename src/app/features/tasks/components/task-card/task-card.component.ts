import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskSummary } from '../../../../core/models/task.models';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
  @Input() task!: TaskSummary;
  @Input() selected = false;
  @Output() select = new EventEmitter<string>();
  @Output() toggle = new EventEmitter<{ id: string; isCompleted: boolean }>();
  @Output() remove = new EventEmitter<string>();
  confirmDelete = false;

  priorityLabel(priority: number): string { return ['Low', 'Medium', 'High'][priority] ?? 'Unknown'; }
  dueLabel(dueDate: string | null): string { return dueDate ? new Date(dueDate).toLocaleString() : 'No due date'; }
}
