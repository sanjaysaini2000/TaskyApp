import { Routes } from '@angular/router';
import { TaskBoardComponent } from './features/tasks/components/task-board/task-board.component';

export const routes: Routes = [
  { path: '', component: TaskBoardComponent },
  { path: 'tasks/:id', component: TaskBoardComponent },
  { path: '**', redirectTo: '' }
];
