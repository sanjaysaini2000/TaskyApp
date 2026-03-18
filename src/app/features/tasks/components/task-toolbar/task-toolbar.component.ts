import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskQueryParams } from '../../../../core/models/task.models';

@Component({
  selector: 'app-task-toolbar',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-toolbar.component.html',
  styleUrl: './task-toolbar.component.css'
})
export class TaskToolbarComponent {
  @Input() query!: TaskQueryParams;
  @Output() queryChange = new EventEmitter<Partial<TaskQueryParams>>();

  onSearch(value: string): void { this.queryChange.emit({ search: value }); }
  onCompleted(value: string): void { this.queryChange.emit({ isCompleted: value === 'all' ? null : value === 'true' }); }
  onPriority(value: string): void { this.queryChange.emit({ priority: value === 'all' ? null : Number(value) }); }
  onSort(sortBy: string): void { this.queryChange.emit({ sortBy: sortBy as TaskQueryParams['sortBy'] }); }
  onOrder(order: string): void { this.queryChange.emit({ order: order as TaskQueryParams['order'] }); }
  onDueBefore(value: string): void { this.queryChange.emit({ dueBefore: value || null }); }
  onDueAfter(value: string): void { this.queryChange.emit({ dueAfter: value || null }); }

  clear(): void {
    this.queryChange.emit({ search: '', isCompleted: null, priority: null, dueBefore: null, dueAfter: null, sortBy: 'createdAt', order: 'asc' });
  }
}
