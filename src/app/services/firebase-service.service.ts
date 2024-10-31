import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private readonly config = environment.firebase;

  constructor() {
    // Use this.config to initialize Firebase
    console.log('Firebase config loaded:', this.config);
  }
}
