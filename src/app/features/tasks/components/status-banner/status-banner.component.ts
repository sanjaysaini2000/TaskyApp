import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-status-banner',
  imports: [CommonModule],
  templateUrl: './status-banner.component.html',
  styleUrl: './status-banner.component.css'
})
export class StatusBannerComponent {
  @Input() success: string | null = null;
  @Input() error: string | null = null;
  @Output() dismiss = new EventEmitter<void>();
}
