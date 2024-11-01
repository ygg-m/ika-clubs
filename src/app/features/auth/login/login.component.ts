import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../store/auth/auth.actions';
import * as AuthSelectors from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AsyncPipe, CommonModule],
  template: `
    <div
      class="flex flex-col items-center justify-center min-h-screen bg-gray-100"
    >
      <div class="p-8 bg-white rounded-lg shadow-md">
        <h1 class="mb-6 text-2xl font-bold text-center">
          Welcome to IKA Clubs
        </h1>
        <button
          (click)="login()"
          [disabled]="loading$ | async"
          class="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {{ (loading$ | async) ? 'Signing in...' : 'Sign in with Google' }}
        </button>

        <div *ngIf="error$ | async as error" class="mt-4 text-red-600 text-sm">
          {{ error }}
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  loading$ = this.store.select(AuthSelectors.selectAuthLoading);
  error$ = this.store.select(AuthSelectors.selectAuthError);

  constructor(private store: Store) {}

  login() {
    this.store.dispatch(AuthActions.login());
  }
}
