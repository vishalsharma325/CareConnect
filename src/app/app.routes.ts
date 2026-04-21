import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { DashboardComponent as PatientDashboard } from './components/patient/dashboard/dashboard';
import { DashboardComponent as DoctorDashboard } from './components/doctor/dashboard/dashboard';
import { DashboardComponent as AdminDashboard } from './components/admin/dashboard/dashboard';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'patient', 
    component: PatientDashboard,
    canActivate: [authGuard, roleGuard],
    data: { role: 'patient' }
  },
  { 
    path: 'doctor', 
    component: DoctorDashboard,
    canActivate: [authGuard, roleGuard],
    data: { role: 'doctor' }
  },
  { 
    path: 'admin', 
    component: AdminDashboard,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' }
  },
  { path: '**', redirectTo: '' }
];
