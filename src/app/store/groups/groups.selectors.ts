import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './groups.reducer';

export const selectGroupsState = createFeatureSelector<State>('groups');

export const selectAllGroups = createSelector(
  selectGroupsState,
  (state) => state.groups
);

export const selectGroupsLoading = createSelector(
  selectGroupsState,
  (state) => state.loading
);

export const selectGroupsError = createSelector(
  selectGroupsState,
  (state) => state.error
);
