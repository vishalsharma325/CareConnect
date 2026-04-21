import { Injectable, signal } from '@angular/core';
import { User } from '../models/models';
import { StorageService } from './storage.service';
import { DataService } from './data.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);

  constructor(
    private storage: StorageService,
    private data: DataService,
    private router: Router
  ) {
    const saved = this.storage.getItem<User>('currentUser');
    if (saved) {
      this.currentUser.set(saved);
    }
  }

  login(email: string, pass: string): boolean {
    if (pass !== 'pass123') return false;
    
    const users = this.data.getUsers();
    const user = users.find(u => u.email === email);
    
    if (user) {
      this.currentUser.set(user);
      this.storage.setItem('currentUser', user);
      this.routeByRole(user.role);
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser.set(null);
    this.storage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  routeByRole(role: string) {
    if (role === 'admin') this.router.navigate(['/admin']);
    else if (role === 'doctor') this.router.navigate(['/doctor']);
    else this.router.navigate(['/patient']);
  }
}
