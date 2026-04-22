import { Injectable, signal } from '@angular/core';
import { User } from '../models/models';
import { StorageService } from './storage.service';
import { DataService } from './data.service';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseConfig } from '../firebase.config';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

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

  async login(email: string, pass: string): Promise<boolean> {
    try {
      if (email.endsWith('@demo.com') && pass === 'pass123') {
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

      if (firebaseConfig.apiKey === 'YOUR_API_KEY') {
        // Mock fallback since Firebase is not configured
        const mockCredentials = this.storage.getItem<any[]>('mockCredentials') || [];
        const cred = mockCredentials.find(c => c.email === email && c.password === pass);

        if (cred) {
          const users = this.data.getUsers();
          const user = users.find(u => u.id === cred.id);
          if (user) {
            this.currentUser.set(user);
            this.storage.setItem('currentUser', user);
            this.routeByRole(user.role);
            return true;
          }
        }
        
        // Fallback for demo users that don't have stored mock credentials
        if (email.endsWith('@demo.com') && pass === 'pass123') {
          const users = this.data.getUsers();
          const user = users.find(u => u.email === email);
          if (user) {
            this.currentUser.set(user);
            this.storage.setItem('currentUser', user);
            this.routeByRole(user.role);
            return true;
          }
        }
        
        return false;
      }

      const cred = await signInWithEmailAndPassword(auth, email, pass);
      return this.handleFirebaseUser(cred.user);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async register(email: string, pass: string): Promise<boolean> {
    try {
      if (firebaseConfig.apiKey === 'YOUR_API_KEY') {
        // Mock fallback
        const mockId = 'mock_uid_' + Date.now();
        const user: User = {
          id: mockId,
          email: email,
          name: '',
          role: 'patient'
        };
        
        // Save mock user credentials
        const mockCredentials = this.storage.getItem<any[]>('mockCredentials') || [];
        mockCredentials.push({ id: mockId, email, password: pass });
        this.storage.setItem('mockCredentials', mockCredentials);
        
        // Add to data service so they exist in the mock DB
        this.data.addUser(user);
        
        this.currentUser.set(user);
        this.storage.setItem('currentUser', user);
        return true;
      }

      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const user: User = {
        id: cred.user.uid,
        email: cred.user.email || email,
        name: '',
        role: 'patient'
      };
      
      this.currentUser.set(user);
      this.storage.setItem('currentUser', user);
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async signInWithGoogle(): Promise<boolean> {
    try {
      if (firebaseConfig.apiKey === 'YOUR_API_KEY') {
        // Mock fallback
        return this.handleFirebaseUser({
          uid: 'google_mock_' + Date.now(),
          email: 'googleuser@example.com',
          displayName: 'Google Mock User'
        });
      }

      const cred = await signInWithPopup(auth, googleProvider);
      return this.handleFirebaseUser(cred.user);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private handleFirebaseUser(firebaseUser: any): boolean {
    const uid = firebaseUser.uid;
    const users = this.data.getUsers();
    let user = users.find(u => u.id === uid);
    
    if (!user) {
      // First time but registered (maybe via Firebase but data deleted locally)
      user = {
        id: uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        role: 'patient'
      };
      // Let them go to profile setup
      this.currentUser.set(user);
      this.storage.setItem('currentUser', user);
      this.router.navigate(['/profile-setup']);
      return true;
    }
    
    this.currentUser.set(user);
    this.storage.setItem('currentUser', user);
    
    if (!user.name) {
      this.router.navigate(['/profile-setup']);
    } else {
      this.routeByRole(user.role);
    }
    return true;
  }

  updateUser(user: User) {
    this.currentUser.set(user);
    this.storage.setItem('currentUser', user);
  }

  async logout() {
    await signOut(auth);
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
