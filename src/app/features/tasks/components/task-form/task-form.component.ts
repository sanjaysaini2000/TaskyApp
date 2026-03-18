import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskCreateRequest, TaskDetail, TaskUpdateRequest } from '../../../../core/models/task.models';

@Component({
  selector: 'app-task-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() task: TaskDetail | null = null;
  @Input() saving = false;
  @Output() submitCreate = new EventEmitter<TaskCreateRequest>();
  @Output() submitUpdate = new EventEmitter<TaskUpdateRequest>();

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.maxLength(2000)]],
    dueDate: [''],
    priority: [0, [Validators.min(0), Validators.max(2)]],
    isCompleted: [false]
  });

  ngOnChanges(): void {
    if (this.mode === 'edit' && this.task) {
      this.form.patchValue({
        title: this.task.title,
        description: this.task.description ?? '',
        dueDate: this.toLocalDateInput(this.task.dueDate),
        priority: this.task.priority,
        isCompleted: this.task.isCompleted
      });
    }
    if (this.mode === 'create') this.form.patchValue({ isCompleted: false });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const dueDate = value.dueDate ? new Date(value.dueDate).toISOString() : null;

    if (this.mode === 'create') {
      this.submitCreate.emit({
        title: value.title.trim(),
        description: value.description.trim() || null,
        dueDate,
        priority: Number(value.priority)
      });
      this.form.patchValue({ title: '', description: '', dueDate: '', priority: 0, isCompleted: false });
      return;
    }

    this.submitUpdate.emit({
      title: value.title.trim(),
      description: value.description.trim() || null,
      dueDate,
      priority: Number(value.priority),
      isCompleted: Boolean(value.isCompleted)
    });
  }

  private toLocalDateInput(dateIso: string | null): string {
    if (!dateIso) return '';
    const date = new Date(dateIso);
    if (Number.isNaN(date.getTime())) return '';
    const pad = (v: number): string => v.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}
