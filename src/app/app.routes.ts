import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/assessment', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'resume',
    canActivate: [authGuard],
    data: { permission: 'app:full_access' },
    loadComponent: () => import('./features/resume-generator/resume-generator.component').then(m => m.ResumeGeneratorComponent)
  },
  {
    path: 'assessment',
    canActivate: [authGuard],
    data: { permission: 'assessment:write' },
    loadComponent: () => import('./features/candidate-assessment/candidate-assessment.component').then(m => m.CandidateAssessmentComponent)
  },
  {
    path: 'reports',
    canActivate: [authGuard],
    data: { permission: 'app:full_access' },
    loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
  },
  { path: '**', redirectTo: '/assessment' }
];
