import { createReducer, on } from '@ngrx/store';
import { User } from '../../core/models/user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User | null;
  loading: boolean;
  error: any;
}

export const initialState: State = {
  user: null,
  loading: false,
  error: null,
};

export const reducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    loading: false,
    error: null,
  }))
);
