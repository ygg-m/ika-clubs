import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from './auth/auth.reducer';
import * as fromGroups from './groups/groups.reducer';

export interface AppState {
  auth: fromAuth.State;
  groups: fromGroups.State;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: fromAuth.reducer,
  groups: fromGroups.reducer,
};
