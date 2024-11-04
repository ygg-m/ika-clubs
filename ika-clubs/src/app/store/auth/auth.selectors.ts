import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './auth.reducer';

export const selectAuthState = createFeatureSelector<State>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectUser,
  (user) => !!user
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);
